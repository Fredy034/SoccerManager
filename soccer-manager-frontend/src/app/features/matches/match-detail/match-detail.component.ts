import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchesService } from '../../../core/services/matches.service';
import { TeamsService } from '../../../core/services/teams.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { formatDate } from '@angular/common';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-match-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.scss'],
})
export class MatchDetailComponent implements OnInit {
  match: any = null;
  teamMap = new Map<number, string>();
  loading = false;
  error: string | null = null;

  constructor(
    private matchesSvc: MatchesService,
    private teamsSvc: TeamsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.error = 'ID inválido';
      return;
    }
    this.loadDetail(id);
  }

  goBack() {
    window.history.back();
  }

  private loadDetail(id: number) {
    this.loading = true;
    this.matchesSvc
      .getById(id)
      .pipe(
        switchMap((m: any) => {
          console.log('Match loaded:', m.goalsDto);
          this.match = m;
          // Si el backend ya devolvió nombres, poblamos el mapa
          if (m.homeTeamName || m.awayTeamName || m.HomeTeam || m.AwayTeam) {
            const hn = m.homeTeamName ?? m.HomeTeam ?? m.homeTeam?.name;
            const an = m.awayTeamName ?? m.AwayTeam ?? m.awayTeam?.name;
            if (hn) this.teamMap.set(m.homeTeamId, hn);
            if (an) this.teamMap.set(m.awayTeamId, an);
            return of(m);
          }
          // Si no hay nombres, solicitar ambos equipos
          return this.teamsSvc.getById(m.homeTeamId).pipe(
            switchMap((h) => {
              this.teamMap.set(h.id, h.name);
              return this.teamsSvc.getById(m.awayTeamId);
            }),
            switchMap((a) => {
              this.teamMap.set(a.id, a.name);
              return of(m);
            })
          );
        })
      )
      .subscribe({
        next: () => {
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.error = 'Error cargando detalle';
          console.error(err);
        },
      });
  }

  teamName(id: number) {
    return this.teamMap.get(id) ?? `#${id}`;
  }

  // formato sencillo de fecha
  format(dt: string | Date) {
    return formatDate(dt, 'medium', 'en-US'); // ajustar locale si quieres
  }
}
