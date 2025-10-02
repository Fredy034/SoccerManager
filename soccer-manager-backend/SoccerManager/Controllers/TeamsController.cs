using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoccerManager.Data;
using SoccerManager.Models;

namespace SoccerManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeamsController : ControllerBase
    {
        private readonly SoccerDbContext _context;
        public TeamsController(SoccerDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var teams = await _context.Teams
                .Where(t => t.Active)
                .Select(t => new TeamDto(
                    t.Id,
                    t.Name,
                    t.Country,
                    t.City,
                    t.ShieldUrl,
                    t.CreationDate,
                    t.Active
                 ))
                .ToListAsync();

            return Ok(teams);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var t = await _context.Teams.FindAsync(id);
            if (t == null || !t.Active) return NotFound();

            var team = new TeamDto(
                t.Id,
                t.Name,
                t.Country,
                t.City,
                t.ShieldUrl,
                t.CreationDate,
                t.Active
            );

            return Ok(team);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTeamDto dto)
        {
            var team = new Team
            {
                Name = dto.Name,
                Country = dto.Country,
                City = dto.City,
                ShieldUrl = dto.ShieldUrl,
                CreationDate = DateTime.UtcNow,
                Active = true
            };
            _context.Teams.Add(team);

            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = team.Id }, team);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateTeamDto dto)
        {
            var team = await _context.Teams.FindAsync(id);
            if (team == null || !team.Active) return NotFound();

            team.Name = dto.Name;
            team.Country = dto.Country;
            team.City = dto.City;
            team.ShieldUrl = dto.ShieldUrl;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var team = await _context.Teams.FindAsync(id);
            if (team == null || !team.Active) return NotFound();

            team.Active = false;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}