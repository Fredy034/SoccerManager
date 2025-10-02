import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Team } from '../../../core/models/team.model';
import { TeamsService } from '../../../core/services/teams.service';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './teams-list.component.html',
  styleUrls: ['./teams-list.component.scss']
})
export class TeamsListComponent implements OnInit {
  teams: Team[] = [];
  constructor(private teamsSvc: TeamsService, private router: Router) {}
  ngOnInit() {
    this.load();
  }
  load() {
    this.teamsSvc.getAll().subscribe((r) => (this.teams = r));
  }
  create() {
    this.router.navigate(['/teams/new']);
  }
  edit(id: number) {
    this.router.navigate([`/teams/${id}/edit`]);
  }
}
