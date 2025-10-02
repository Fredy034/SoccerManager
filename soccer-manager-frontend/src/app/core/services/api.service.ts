import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor( private http: HttpClient ) {}

  get<T>( path: string, params?: {[key: string]: any} ): Observable<T> {
    let p = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        const v = params[key];
        console.log('Param', key, '->', v, typeof v);

        if (v === null || v === undefined || v === '') {
          return;
        }

        if (Array.isArray(v)) {
          v.forEach((item: any) => {
            p = p.append(key, this.toParamValue(item));
          });
          return;
        }

        p = p.set(key, this.toParamValue(v));
      });
    }

    return this.http.get<T>( `${this.baseUrl}/${path}`, { params: p } );
  }

  post<T>( path: string, body: any ) {
    return this.http.post<T>( `${this.baseUrl}/${path}`, body );
  }

  put<T>( path: string, body: any ) {
    return this.http.put<T>( `${this.baseUrl}/${path}`, body );
  }

  delete<T>( path: string ) {
    return this.http.delete<T>( `${this.baseUrl}/${path}` );
  }

  private toParamValue(value: any): string {
    if (value instanceof Date) return value.toISOString();
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'number') return String(value);
    // fallback (string, object...)
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  }
}
