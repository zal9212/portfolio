import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjetService } from '../../../services/projet.service';
import { CompetenceService } from '../../../services/competence.service';
import { AuthService } from '../../../services/auth.service';
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
  isAdmin = signal<boolean>(false);

  constructor(
    private projetService: ProjetService,
    private competenceService: CompetenceService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isAdmin.set(user?.role === 'admin');
    });

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

  deleteProjet(): void {
    const id = this.projet()?.id;
    if (id && confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      this.projetService.delete(id).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Error deleting project:', err);
          alert('Erreur lors de la suppression du projet.');
        }
      });
    }
  }
}
