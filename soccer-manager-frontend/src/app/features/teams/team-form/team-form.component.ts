import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TeamsService } from '../../../core/services/teams.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.scss'],
})
export class TeamFormComponent implements OnInit {
  form: any;
  isEdit = false;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private teams: TeamsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: [''],
      country: [''],
      city: [''],
      shieldUrl: [''],
    });
  }

  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      this.isEdit = true;
      this.id = Number(param);
      this.teams.getById(this.id).subscribe((t) =>
        this.form.patchValue({
          name: t.name,
          country: t.country,
          city: t.city,
          shieldUrl: t.shieldUrl,
        })
      );
    }
  }

  save() {
    const payload = this.form.value;
    if (!payload.name) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    if (this.isEdit && this.id) {
      this.teams
        .update(this.id, payload)
        .subscribe(() => this.router.navigate(['/teams']));
    } else {
      this.teams
        .create(payload)
        .subscribe(() => this.router.navigate(['/teams']));
    }
  }

  cancel() {
    this.router.navigate(['/teams']);
  }
}
