using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoccerManager.Data;
using SoccerManager.Models;

namespace SoccerManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchesController : ControllerBase
    {
        private readonly SoccerDbContext _context;
        public MatchesController(SoccerDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? teamId, [FromQuery] DateTime? dateFrom, [FromQuery] DateTime? dateTo, [FromQuery] string? status)
        {
            var q = _context.Matches.AsQueryable().Include(m => m.HomeTeam).Include(m => m.AwayTeam).Where(m => m.Active);

            if (teamId.HasValue) 
                q = q.Where(m => m.HomeTeamId == teamId || m.AwayTeamId == teamId);

            if (dateFrom.HasValue)
                q = q.Where(m => m.MatchDate >= dateFrom.Value);

            if (dateTo.HasValue)
                q = q.Where(m => m.MatchDate <= dateTo.Value);

            if (!string.IsNullOrWhiteSpace(status))
                q = q.Where(m => m.Status == status);

            var matches = await q.Select(m => new MatchDto(
                m.Id,
                m.MatchDate,
                m.HomeTeamId,
                m.AwayTeamId,
                m.HomeTeamScore,
                m.AwayTeamScore,
                m.Status
            )).ToListAsync();

            return Ok(matches);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var m = await _context.Matches.Include(m => m.HomeTeam).Include(m => m.AwayTeam).Include(m => m.Goals).FirstOrDefaultAsync(m => m.Id == id && m.Active);
            if (m == null || !m.Active) return NotFound();
            
            var goalsDto = m.Goals?.Select(g => new GoalDetailDto(
                g.Id,
                g.MatchId,
                g.TeamId,
                g.Scorer,
                g.Minute
             )) ?? Enumerable.Empty<GoalDetailDto>();

            var match = new {
                m.Id,
                m.MatchDate,
                m.HomeTeamId,
                HomeTeam = m.HomeTeam?.Name,
                m.AwayTeamId,
                AwayTeam = m.AwayTeam?.Name,
                m.HomeTeamScore,
                m.AwayTeamScore,
                m.Status,
                goalsDto
            };

            return Ok(match);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateMatchDto dto)
        {
            if (dto.HomeTeamId == dto.AwayTeamId) return BadRequest("Home and Away teams must be different.");

            var homeTeam = await _context.Teams.FindAsync(dto.HomeTeamId);
            var awayTeam = await _context.Teams.FindAsync(dto.AwayTeamId);
            if (homeTeam == null || !homeTeam.Active || awayTeam == null || !awayTeam.Active) return BadRequest("Both teams must exist and be active.");

            var match = new Match
            {
                MatchDate = dto.MatchDate,
                HomeTeamId = dto.HomeTeamId,
                AwayTeamId = dto.AwayTeamId,
                Status = "Programado",
                CreationDate = DateTime.UtcNow,
                Active = true
            };
            _context.Matches.Add(match);

            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = match.Id }, new MatchDto(
                match.Id,
                match.MatchDate,
                match.HomeTeamId,
                match.AwayTeamId,
                match.HomeTeamScore,
                match.AwayTeamScore,
                match.Status
            ));
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateMatchDto dto)
        {
            var match = await _context.Matches.FindAsync(id);
            if (match == null || !match.Active) return NotFound();
            if (dto.HomeTeamId == dto.AwayTeamId) return BadRequest("Home and Away teams must be different.");

            var homeTeam = await _context.Teams.FindAsync(dto.HomeTeamId);
            var awayTeam = await _context.Teams.FindAsync(dto.AwayTeamId);
            if (homeTeam == null || !homeTeam.Active || awayTeam == null || !awayTeam.Active) return BadRequest("Both teams must exist and be active.");

            match.MatchDate = dto.MatchDate;
            match.HomeTeamId = dto.HomeTeamId;
            match.AwayTeamId = dto.AwayTeamId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id:int}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateMatchStatusDto dto)
        {
            var match = await _context.Matches.FindAsync(id);
            if (match == null || !match.Active) return NotFound();

            var validStatuses = new[] { "Programado", "Suspendido", "Jugado", "Cancelado" };
            if (!validStatuses.Contains(dto.Status)) return BadRequest("Invalid status value.");

            match.Status = dto.Status;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{id:int}/result")]
        public async Task<IActionResult> PostResult(int id, [FromBody] ResultDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var match = await _context.Matches.Include(m => m.HomeTeam).Include(m => m.AwayTeam).FirstOrDefaultAsync(m => m.Id == id && m.Active);
                if (match == null || !match.Active) return NotFound();
                if (match.Status == "Cancelado") return BadRequest("Cannot post result for a canceled match.");
                if (dto.HomeTeamScore < 0 || dto.AwayTeamScore < 0) return BadRequest("Scores must be non-negative.");

                int homeGoalsCount = dto.Goals.Count(g => g.TeamId == match.HomeTeamId);
                int awayGoalsCount = dto.Goals.Count(g => g.TeamId == match.AwayTeamId);
                if (homeGoalsCount != dto.HomeTeamScore || awayGoalsCount != dto.AwayTeamScore) return BadRequest("Number of goals does not match the provided scores.");
                foreach (var goal in dto.Goals)
                {
                    if (goal.TeamId != match.HomeTeamId && goal.TeamId != match.AwayTeamId) return BadRequest("Goal team ID must match either Home or Away team.");
                    if (goal.Minute.HasValue && (goal.Minute < 1 || goal.Minute > 120)) return BadRequest("Goal minute must be between 1 and 120.");
                }

                match.HomeTeamScore = dto.HomeTeamScore;
                match.AwayTeamScore = dto.AwayTeamScore;
                match.Status = "Jugado";

                var prevGoals = _context.Goals.Where(g => g.MatchId == match.Id);
                _context.Goals.RemoveRange(prevGoals);

                if (dto.Goals != null && dto.Goals.Any())
                {
                    foreach (var g in dto.Goals)
                    {
                        if (g.TeamId != match.HomeTeamId && g.TeamId != match.AwayTeamId) return BadRequest("Goal team ID must match either Home or Away team.");
                        var goal = new Goal
                        {
                            MatchId = match.Id,
                            TeamId = g.TeamId,
                            Scorer = g.Scorer,
                            Minute = g.Minute,
                            CreationDate = DateTime.UtcNow,
                            Active = true
                        };

                        _context.Goals.Add(goal);
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "An error occurred while processing the request." + ex.Message);
            }
        }
    }
}