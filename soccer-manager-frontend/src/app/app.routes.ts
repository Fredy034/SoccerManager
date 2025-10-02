import { Routes } from '@angular/router';
import { MatchFormComponent } from './features/matches/match-form/match-form.component';
import { MatchResultComponent } from './features/matches/match-result/match-result.component';
import { MatchesListComponent } from './features/matches/matches-list/matches-list.component';
import { StandingsComponent } from './features/standings/standings.component';
import { TeamFormComponent } from './features/teams/team-form/team-form.component';
import { TeamsListComponent } from './features/teams/teams-list/teams-list.component';
import { MatchDetailComponent } from './features/matches/match-detail/match-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'standings', pathMatch: 'full' },
  { path: 'home', redirectTo: 'standings', pathMatch: 'full' },

  { path: 'teams', component: TeamsListComponent },
  { path: 'teams/new', component: TeamFormComponent },
  { path: 'teams/:id/edit', component: TeamFormComponent },

  { path: 'matches', component: MatchesListComponent },
  { path: 'matches/new', component: MatchFormComponent },
  { path: 'matches/:id', component: MatchFormComponent },
  { path: 'matches/:id/result', component: MatchResultComponent },
  { path: 'matches/:id/detail', component: MatchDetailComponent },

  { path: 'standings', component: StandingsComponent },

  { path: '**', redirectTo: 'standings' },
];
