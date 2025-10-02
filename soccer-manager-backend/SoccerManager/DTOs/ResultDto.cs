public record GoalDto(int TeamId, int? Minute, string? Scorer);
public record ResultDto(int HomeTeamScore, int AwayTeamScore, List<GoalDto> Goals);