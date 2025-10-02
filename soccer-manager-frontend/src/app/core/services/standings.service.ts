import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class StandingsService {
  constructor(private _api: ApiService) { }

  getStandings(): Observable<any[]> {
    return this._api.get<any[]>("Standings");
  }
}
