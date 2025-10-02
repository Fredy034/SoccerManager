import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { Team } from "../models/team.model";

@Injectable({ providedIn: "root" })
export class TeamsService {
  private path = "Teams";
  constructor(private _api: ApiService) { }

  getAll(): Observable<Team[]> {
    return this._api.get<Team[]>(this.path);
  }

  getById(id: number): Observable<Team> {
    return this._api.get<Team>(`${this.path}/${id}`);
  }

  create(payload: Partial<Team>): Observable<Team> {
    return this._api.post<Team>(this.path, payload);
  }

  update(id: number, payload: Partial<Team>) {
    return this._api.put(`${this.path}/${id}`, payload);
  }

  delete(id: number) {
    return this._api.delete(`${this.path}/${id}`);
  }
}
