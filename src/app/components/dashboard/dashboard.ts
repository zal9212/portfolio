import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CompetenceService } from '../../services/competence.service';
import { ProjetService } from '../../services/projet.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  stats = signal({
    competences: 0,
    projets: 0
  });
  currentUser = signal<any>(undefined);

  constructor(
    private competenceService: CompetenceService,
    private projetService: ProjetService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUser.set(this.authService.getCurrentUser());
    this.loadStats();
  }

  loadStats(): void {
    this.competenceService.getAll().subscribe(data => {
      this.stats.update(s => ({ ...s, competences: data.length }));
    });
    this.projetService.getAll().subscribe(data => {
      this.stats.update(s => ({ ...s, projets: data.length }));
    });
  }
}
