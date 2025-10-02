using System.ComponentModel.DataAnnotations;

namespace SoccerManager.Models
{
    public class Team
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Country { get; set; }
        public string? City { get; set; }
        public string? ShieldUrl { get; set; }
        public DateTime CreationDate { get; set; }
        public bool Active { get; set; }
    }
}