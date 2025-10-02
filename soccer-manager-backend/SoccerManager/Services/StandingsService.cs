using SoccerManager.Models;

namespace SoccerManager.Services
{
    public class StandingRow
    {
        public int Position { get; set; }
        public int TeamId { get; set; }
        public string? ShieldUrl { get; set; }
        public string TeamName { get; set; } = null!;
        public int MP { get; set; } // Partidos Jugados
        public int MW { get; set; } // Partidos Ganados
        public int MD { get; set; } // Partidos Empatados
        public int ML { get; set; } // Partidos Perdidos
        public int GF { get; set; } // Goles a Favor
        public int GA { get; set; } // Goles en Contra
        public int GD { get; set; } // Diferencia de Goles
        public int PTS => MW * 3 + MD; // Puntos
    }

    public class StandingService
    {
        public List<StandingRow> Calculate(IEnumerable<Team> teams, IEnumerable<Match> matches)
        {
            var rows = teams.ToDictionary(t => t.Id, t => new StandingRow { TeamId = t.Id, TeamName = t.Name, ShieldUrl = t.ShieldUrl });
            var played = matches.Where(m => string.Equals(m.Status, "Jugado", StringComparison.OrdinalIgnoreCase) && m.HomeTeamScore != null && m.AwayTeamScore != null);

            foreach (var m in played)
            {
                var home = rows[m.HomeTeamId];
                var away = rows[m.AwayTeamId];

                home.MP++;
                away.MP++;
                home.GF += m.HomeTeamScore.GetValueOrDefault();
                home.GA += m.AwayTeamScore.GetValueOrDefault();
                away.GF += m.AwayTeamScore.GetValueOrDefault();
                away.GA += m.HomeTeamScore.GetValueOrDefault();

                var homeScore = m.HomeTeamScore.GetValueOrDefault();
                var awayScore = m.AwayTeamScore.GetValueOrDefault();

                if (homeScore > awayScore)
                {
                    home.MW++;
                    away.ML++;
                }
                else if (homeScore < awayScore)
                {
                    home.ML++;
                    away.MW++;
                }
                else
                {
                    home.MD++;
                    away.MD++;
                }
            }
            
            foreach (var row in rows.Values)
            {
                row.GD = row.GF - row.GA;
            }

            var ordered = rows.Values
                .OrderByDescending(r => r.PTS)
                .ThenByDescending(r => r.GD)
                .ThenByDescending(r => r.GF)
                .ThenBy(r => r.TeamName)
                .ToList();

            for (int i = 0; i < ordered.Count; i++) ordered[i].Position = i + 1;
            return ordered;
        }
    }
}