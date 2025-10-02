public record CreateMatchDto(DateTime MatchDate, int HomeTeamId, int AwayTeamId);

public record UpdateMatchStatusDto(string Status);