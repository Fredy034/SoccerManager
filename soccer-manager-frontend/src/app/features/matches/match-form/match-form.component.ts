import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatchesService } from '../../../core/services/matches.service';
import { TeamsService } from '../../../core/services/teams.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-match-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './match-form.component.html',
  styleUrls: ['./match-form.component.scss'],
})
export class MatchFormComponent implements OnInit {
  form: any;
  teams: any[] = [];
  isEdit = false;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private matches: MatchesService,
    private teamsSvc: TeamsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      matchDate: [''],
      homeTeamId: [null],
      awayTeamId: [null],
    });
  }

  ngOnInit() {
    this.teamsSvc.getAll().subscribe((t) => (this.teams = t));
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      this.isEdit = true;
      this.id = Number(param);
      this.matches.getById(this.id).subscribe((m) => {
        // convert ISO -> local datetime-local value
        const dt = new Date(m.matchDate);
        const isoLocal = dt.toISOString().slice(0, 16);
        this.form.patchValue({
          matchDate: isoLocal,
          homeTeamId: m.homeTeamId,
          awayTeamId: m.awayTeamId,
        });
      });
    }
  }

  save() {
    const raw = this.form.value;

    if (raw.homeTeamId === raw.awayTeamId) {
      alert('El equipo local y visitante deben ser diferentes.');
      return;
    }

    const payload = {
      matchDate: new Date(raw.matchDate).toISOString(),
      homeTeamId: raw.homeTeamId,
      awayTeamId: raw.awayTeamId,
    };
    if (this.isEdit && this.id) {
      this.matches
        .update(this.id, payload)
        .subscribe(() => this.router.navigate(['/matches']));
    } else {
      this.matches
        .create(payload)
        .subscribe(() => this.router.navigate(['/matches']));
    }
  }

  cancel() {
    this.router.navigate(['/matches']);
  }
}
