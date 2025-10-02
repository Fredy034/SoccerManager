public record GoalDetailDto(int Id, int MatchId, int TeamId, string? Scorer, int? Minute);

// DTOs/MatchDetailDto.cs
public record MatchDetailDto(
    int Id,
    DateTime MatchDate,
    int HomeTeamId,
    string? HomeTeamName,
    int AwayTeamId,
    string? AwayTeamName,
    int? HomeTeamScore,
    int? AwayTeamScore,
    string Status,
    IEnumerable<GoalDetailDto> Goals
);
