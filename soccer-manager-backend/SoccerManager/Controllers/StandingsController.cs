using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoccerManager.Data;
using SoccerManager.Services;

namespace SoccerManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StandingsController : ControllerBase
    {
        private readonly SoccerDbContext _context;
        private readonly StandingService _standingService;
        public StandingsController(SoccerDbContext context)
        {
            _context = context;
            _standingService = new StandingService();
        }

        [HttpGet]
        public async Task<IActionResult> GetStandings()
        {
            var teams = await _context.Teams.Where(t => t.Active).ToListAsync();
            var matches = await _context.Matches.Where(m => m.Active).ToListAsync();
            var standings = _standingService.Calculate(teams, matches);
            for (int i = 0; i < standings.Count; i++)
            {
                standings[i].Position = i + 1;
            }

            return Ok(standings);
        }
    }
}