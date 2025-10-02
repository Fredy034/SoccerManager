import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { Match, MatchStatus } from "../models/match.model";
import { Goal } from "../models/goal.model";

@Injectable({ providedIn: "root" })
export class MatchesService {
  private path = "Matches";
  constructor(private _api: ApiService) { }

  getAll(filters?: { teamId?: number; dateFrom?: string; dateTo?: string; status?: MatchStatus }): Observable<Match[]> {
    return this._api.get<Match[]>(this.path, filters );
  }

  getById(id: number): Observable<Match> {
    return this._api.get<Match>(`${this.path}/${id}`);
  }

  create(payload: Partial<Match>) {
    return this._api.post(this.path, payload);
  }

  update(id: number, payload: Partial<Match>) {
    return this._api.put(`${this.path}/${id}`, payload);
  }

  updateStatus(id: number, status: MatchStatus) {
    return this._api.put(`${this.path}/${id}/status`, { status });
  }

  postResult(id: number, payload: { homeTeamScore: number; awayTeamScore: number; goals: Goal[] }) {
    return this._api.post(`${this.path}/${id}/result`, payload);
  }
}
