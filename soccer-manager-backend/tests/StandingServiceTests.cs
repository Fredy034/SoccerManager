using SoccerManager.Models;
using SoccerManager.Services;
using Xunit;

public class StandingServiceTests
{
    [Fact]
    public void Calculate_BasicScenario_ReturnsCorrectStandings()
    {
        var teams = new[]
        {
            new Team { Id = 1, Name = "Team A" },
            new Team { Id = 2, Name = "Team B" }
        };

        var matches = new[]
        {
            new Match { Id = 1, HomeTeamId = 1, AwayTeamId = 2, HomeTeamScore = 2, AwayTeamScore = 1, Status = "Jugado" }
        };

        var service = new StandingService();
        var standings = service.Calculate(teams, matches);

        // Assertions
        Xunit.Assert.Equal(1, standings.First().TeamId); // El equipo A debe estar primero
        Xunit.Assert.Equal(3, standings.First().PTS); // 3 puntos por la victoria
        Xunit.Assert.Equal(1, standings.First().MW); // 1 victoria
        Xunit.Assert.Equal(0, standings.First().MD); // 0 empates
    }
}
