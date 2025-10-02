import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormArray,
  Validators,
} from '@angular/forms';
import { MatchesService } from '../../../core/services/matches.service';
import { TeamsService } from '../../../core/services/teams.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface TeamOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-match-result',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './match-result.component.html',
  styleUrls: ['./match-result.component.scss'],
})
export class MatchResultComponent implements OnInit {
  form: any;
  match: any;
  teamOptions: TeamOption[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private matches: MatchesService,
    private teamsSvc: TeamsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      homeScore: [0, [Validators.min(0)]],
      awayScore: [0, [Validators.min(0)]],
      goals: this.fb.array([]),
    });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMatch(id);
  }

  private async loadMatch(id: number) {
    this.loading = true;
    this.matches.getById(id).subscribe({
      next: async (m) => {
        this.match = m;

        // Construir teamOptions: preferir nombres devueltos por el backend si existen
        const homeName =
          (m as any).HomeTeam ||
          (m as any).homeTeamName ||
          (m as any).homeTeam?.name;
        const awayName =
          (m as any).AwayTeam ||
          (m as any).awayTeamName ||
          (m as any).awayTeam?.name;

        const homeId = m.homeTeamId ?? m.homeTeamId;
        const awayId = m.awayTeamId ?? m.awayTeamId;

        if (homeName && awayName) {
          this.teamOptions = [
            { id: homeId, name: homeName },
            { id: awayId, name: awayName },
          ];
        } else {
          // Si backend no devolvió nombres, solicitarlos
          try {
            const [home, away] = await Promise.all([
              this.teamsSvc.getById(homeId).toPromise(),
              this.teamsSvc.getById(awayId).toPromise(),
            ]);
            this.teamOptions = [
              { id: homeId, name: home?.name ?? `#${homeId}` },
              { id: awayId, name: away?.name ?? `#${awayId}` },
            ];
          } catch (err) {
            // fallback: mostrar ids si falla la búsqueda
            console.warn('No se pudieron obtener nombres de equipos', err);
            this.teamOptions = [
              { id: homeId, name: `#${homeId}` },
              { id: awayId, name: `#${awayId}` },
            ];
          }
        }

        // inicializar valores del formulario si el match tiene scores
        if (m.homeTeamScore !== undefined && m.homeTeamScore !== null) {
          this.form.patchValue({ homeScore: m.homeTeamScore });
        }
        if (m.awayTeamScore !== undefined && m.awayTeamScore !== null) {
          this.form.patchValue({ awayScore: m.awayTeamScore });
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando partido', err);
        this.loading = false;
      },
    });
  }

  get goals(): FormArray {
    return this.form.get('goals') as FormArray;
  }

  addGoal() {
    // Por defecto asignamos al equipo local si existe
    const defaultTeamId =
      this.match?.homeTeamId ??
      (this.teamOptions.length ? this.teamOptions[0].id : null);
    this.goals.push(
      this.fb.group({
        teamId: [defaultTeamId, Validators.required],
        minute: [null, [Validators.min(1), Validators.max(120)]],
        scorer: [''],
      })
    );
  }

  removeGoal(i: number) {
    this.goals.removeAt(i);
  }

  // Helper para mostrar nombre por id (si en algún lugar lo necesitas)
  teamName(id: number): string {
    const t = this.teamOptions.find((x) => x.id === id);
    return t ? t.name : `#${id}`;
  }

  submit() {
    if (this.form.invalid) {
      alert(
        'Formulario inválido: verifica los datos y los minutos de los goles.'
      );
      return;
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));
    const payload = {
      homeTeamScore: Number(this.form.value.homeScore),
      awayTeamScore: Number(this.form.value.awayScore),
      goals: this.form.value.goals.map((g: any) => ({
        teamId: Number(g.teamId),
        minute: g.minute ? Number(g.minute) : null,
        scorer: g.scorer,
      })),
    };

    // Opcional: validar que número de goles coincida con scores
    const homeGoalsCount = payload.goals.filter(
      (gg: any) => gg.teamId === this.match.homeTeamId
    ).length;
    const awayGoalsCount = payload.goals.filter(
      (gg: any) => gg.teamId === this.match.awayTeamId
    ).length;
    if (
      homeGoalsCount !== payload.homeTeamScore ||
      awayGoalsCount !== payload.awayTeamScore
    ) {
      if (
        !confirm(
          'La cantidad de goles registrados no coincide con el marcador. ¿Deseas continuar?'
        )
      ) {
        return;
      }
    }

    this.matches.postResult(id, payload).subscribe({
      next: () => {
        alert('Resultado guardado correctamente');
        this.router.navigate(['/matches']);
      },
      error: (err) => {
        console.error(err);
        alert('Error: ' + (err?.error || err?.message || JSON.stringify(err)));
      },
    });
  }

  cancel() {
    this.router.navigate(['/matches']);
  }
}
