using Microsoft.EntityFrameworkCore;
using SoccerManager.Models;

namespace SoccerManager.Data
{
    public class SoccerDbContext : DbContext
    {
        public SoccerDbContext(DbContextOptions<SoccerDbContext> options) : base(options) { }
        public DbSet<Team> Teams { get; set; } = null!;
        public DbSet<Match> Matches { get; set; } = null!;
        public DbSet<Goal> Goals { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Team>(eb =>
            {
                eb.ToTable("TBL_Team");
                eb.HasKey(t => t.Id).HasName("PK_TBL_Team");
                eb.Property(t => t.Id).HasColumnName("PK_IdTeam");
                eb.Property(t => t.Name).HasColumnName("SName").HasMaxLength(100).IsRequired();
                eb.Property(t => t.Country).HasColumnName("SCountry").HasMaxLength(100);
                eb.Property(t => t.City).HasColumnName("SCity").HasMaxLength(100);
                eb.Property(t => t.ShieldUrl).HasColumnName("SShieldUrl").HasMaxLength(255);
                eb.Property(t => t.CreationDate).HasColumnName("DCreationDate");
                eb.Property(t => t.Active).HasColumnName("BActive");
            });

            modelBuilder.Entity<Match>(eb =>
            {
                eb.ToTable("TBL_Match");
                eb.HasKey(m => m.Id).HasName("PK_TBL_Match");
                eb.Property(m => m.Id).HasColumnName("PK_IdMatch");
                eb.Property(m => m.MatchDate).HasColumnName("DMatchDate").IsRequired();
                eb.Property(m => m.HomeTeamId).HasColumnName("FK_HomeTeam").IsRequired();
                eb.Property(m => m.AwayTeamId).HasColumnName("FK_AwayTeam").IsRequired();
                eb.Property(m => m.HomeTeamScore).HasColumnName("IHomeTeamScore");
                eb.Property(m => m.AwayTeamScore).HasColumnName("IAwayTeamScore");
                eb.Property(m => m.Status).HasColumnName("SStatus").IsRequired().HasMaxLength(50).IsRequired();
                eb.Property(m => m.CreationDate).HasColumnName("DCreationDate");
                eb.Property(m => m.Active).HasColumnName("BActive");

                eb.HasOne(m => m.HomeTeam)
                .WithMany()
                .HasForeignKey(m => m.HomeTeamId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_HomeTeam");

                eb.HasOne(m => m.AwayTeam)
                .WithMany()
                .HasForeignKey(m => m.AwayTeamId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_AwayTeam");

                eb.HasCheckConstraint("CHK_DifferentTeams", "FK_HomeTeam <> FK_AwayTeam");
            });

            modelBuilder.Entity<Goal>(eb =>
            {
                eb.ToTable("TBL_Goal");
                eb.HasKey(g => g.Id).HasName("PK_TBL_Goal");
                eb.Property(g => g.Id).HasColumnName("PK_IdGoal");
                eb.Property(g => g.MatchId).HasColumnName("FK_Match");
                eb.Property(g => g.TeamId).HasColumnName("FK_Team");
                eb.Property(g => g.Scorer).HasColumnName("SScorer").HasMaxLength(200);
                eb.Property(g => g.Minute).HasColumnName("IMinute");
                eb.Property(g => g.CreationDate).HasColumnName("DCreationDate");
                eb.Property(g => g.Active).HasColumnName("BActive");

                eb.HasOne(g => g.Match).WithMany(m => m.Goals).HasForeignKey(g => g.MatchId).OnDelete(DeleteBehavior.Cascade).HasConstraintName("FK_Match");
                eb.HasOne(g => g.Team).WithMany().HasForeignKey(g => g.TeamId).OnDelete(DeleteBehavior.Restrict).HasConstraintName("FK_Team");
            });
        }
    }
}