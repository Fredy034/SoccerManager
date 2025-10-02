using System.ComponentModel.DataAnnotations;

namespace SoccerManager.Models
{
    public class Goal
    {
        [Key]
        public int Id { get; set; }
        public int MatchId { get; set; }
        public Match? Match { get; set; }
        public int TeamId { get; set; }
        public Team? Team { get; set; }
        public string? Scorer { get; set; }
        public int? Minute { get; set; }
        public DateTime CreationDate { get; set; }
        public bool Active { get; set; }
    }
}