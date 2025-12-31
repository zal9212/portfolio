import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjetService } from '../../../services/projet.service';
import { CompetenceService } from '../../../services/competence.service';
import { Projet } from '../../../models/projet';
import { Competence } from '../../../models/competence';

@Component({
  selector: 'app-projet-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projet-detail.html',
  styleUrl: './projet-detail.css',
})
export class ProjetDetail implements OnInit {
  projet = signal<Projet | undefined>(undefined);
  linkedCompetences = signal<Competence[]>([]);
  isLoading = signal<boolean>(true);

  constructor(
    private projetService: ProjetService,
    private competenceService: CompetenceService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isLoading.set(true);
        this.projetService.getById(id).subscribe({
          next: (data) => {
            this.projet.set(data);
            const p = data;
            if (p?.competences && p.competences.length > 0) {
              this.loadLinkedCompetences(p.competences);
            } else {
              this.isLoading.set(false);
            }
          },
          error: (err) => {
            console.error('Error fetching project:', err);
            this.isLoading.set(false);
          }
        });
      }
    });
  }

  loadLinkedCompetences(ids: (number | string)[]): void {
    const numericIds = ids.map(id => Number(id));
    this.competenceService.getAll().subscribe({
      next: (all) => {
        this.linkedCompetences.set(all.filter(c => numericIds.includes(Number(c.id))));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching competences:', err);
        this.isLoading.set(false);
      }
    });
  }
}
