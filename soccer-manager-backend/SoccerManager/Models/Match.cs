using System.ComponentModel.DataAnnotations;

namespace SoccerManager.Models
{
    public class Match
    {
        [Key]
        public int Id { get; set; }
        public DateTime MatchDate { get; set; }
        public int HomeTeamId { get; set; }
        public Team? HomeTeam { get; set; }
        public int AwayTeamId { get; set; }
        public Team? AwayTeam { get; set; }
        public int? HomeTeamScore { get; set; }
        public int? AwayTeamScore { get; set; }
        public string Status { get; set; } = "Programado";
        public ICollection<Goal>? Goals { get; set; }
        public DateTime CreationDate { get; set; }
        public bool Active { get; set; }
    }
}