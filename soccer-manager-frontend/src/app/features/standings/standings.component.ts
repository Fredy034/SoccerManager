import { Component, OnInit } from '@angular/core';
import { StandingsService } from '../../core/services/standings.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-standings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss'],
})
export class StandingsComponent implements OnInit {
  standings: any[] = [];
  constructor(private svc: StandingsService) {}
  ngOnInit() {
    this.svc.getStandings().subscribe((r) => (this.standings = r));
  }
}
