import { Component, OnInit } from '@angular/core';
import { MatchesService } from '../../../core/services/matches.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Match, MatchStatus } from '../../../core/models/match.model';
import { TeamsService } from '../../../core/services/teams.service';
import { Team } from '../../../core/models/team.model';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-matches-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './matches-list.component.html',
  styleUrls: ['./matches-list.component.scss'],
})
export class MatchesListComponent implements OnInit {
  matches: Match[] = [];
  teams: Team[] = [];
  teamMap = new Map<number, string>();
  // Form para filtros
  filterForm: any;

  // Opciones de estado (coinciden con el backend)
  statuses: (MatchStatus | '')[] = [
    '',
    'Programado',
    'Jugado',
    'Suspendido',
    'Cancelado',
  ];

  constructor(
    private svc: MatchesService,
    private teamsSvc: TeamsService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      teamId: [null],
      dateFrom: [''],
      dateTo: [''],
      status: [''], // '' means all
    });
  }

  ngOnInit() {
    this.teamsSvc
      .getAll()
      .pipe(
        switchMap((ts) => {
          this.teams = ts;
          this.teamMap = new Map(
            ts.map((t) => [t.id, t.name] as [number, string])
          );
          return of(null);
        })
      )
      .subscribe(
        () => {
          this.load(); // carga partidos con filtros por defecto (vacíos)
        },
        (err) => {
          console.error('Error cargando equipos', err);
          this.load();
        }
      );
  }

  load() {
    const f = this.filterForm.value;
    const filters: any = {};

    if (f.teamId !== null && f.teamId !== undefined && f.teamId !== '') {
      filters.teamId = Number(f.teamId);
    }

    if (f.dateFrom) {
      const df = new Date(f.dateFrom);
      if (!isNaN(df.getTime())) filters.dateFrom = df.toISOString();
    }
    if (f.dateTo) {
      const dt = new Date(f.dateTo);
      if (!isNaN(dt.getTime())) {
        filters.dateTo = dt.toISOString();
      }
    }

    if (f.status) filters.status = f.status;

    this.svc.getAll(filters).subscribe({
      next: (r) => (this.matches = r),
      error: (err) => {
        console.error('Error cargando partidos', err);
        this.matches = [];
      },
    });
  }

  create() {
    this.router.navigate(['/matches/new']);
  }
  view(id: number) {
    this.router.navigate([`/matches/${id}`]);
  }
  result(id: number) {
    this.router.navigate([`/matches/${id}/result`]);
  }

  // helper para mostrar nombre del equipo por id
  teamName(id: number): string {
    return this.teamMap.get(id) ?? `#${id}`;
  }

  clearFilters() {
    this.filterForm.reset({
      teamId: null,
      dateFrom: '',
      dateTo: '',
      status: '',
    });
    this.load();
  }

  openDetail(id: number) {
    this.router.navigate([`/matches/${id}/detail`]);
  }

  suspendMatch(matchId: number) {
    if (!confirm('¿Confirma que desea suspender este partido?')) return;
    this.svc.updateStatus(matchId, 'Suspendido').subscribe({
      next: () => {
        alert('Partido suspendido');
        this.load();
      },
      error: (err: any) => {
        console.error(err);
        alert(
          'No se pudo suspender el partido: ' +
            (err?.error || err?.message || err)
        );
      },
    });
  }

  cancelMatch(matchId: number) {
    if (!confirm('¿Confirma que desea cancelar este partido?')) return;
    this.svc.updateStatus(matchId, 'Cancelado').subscribe({
      next: () => {
        alert('Partido cancelado');
        this.load();
      },
      error: (err: any) => {
        console.error(err);
        alert(
          'No se pudo cancelar el partido: ' +
            (err?.error || err?.message || err)
        );
      },
    });
  }
}
