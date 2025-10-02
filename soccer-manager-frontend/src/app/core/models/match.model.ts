export type MatchStatus = 'Programado' | 'Jugado' | 'Suspendido' | 'Cancelado';

export interface Match {
  id: number;
  matchDate: string | Date;
  homeTeamId: number;
  awayTeamId: number;
  homeTeamScore?: number | null;
  awayTeamScore?: number | null;
  status: MatchStatus;
  creationDate?: string | Date | null;
  active?: boolean | null;
}
