import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CompetenceService } from '../../../services/competence.service';
import { AuthService } from '../../../services/auth.service';
import { Competence } from '../../../models/competence';

@Component({
  selector: 'app-competence-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './competence-detail.html',
  styleUrl: './competence-detail.css',
})
export class CompetenceDetail implements OnInit {
  competence = signal<Competence | undefined>(undefined);
  isLoading = signal<boolean>(true);
  isAdmin = signal<boolean>(false);

  constructor(
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
        this.competenceService.getById(id).subscribe({
          next: (data) => {
            this.competence.set(data);
            this.isLoading.set(false);
          },
          error: (err) => {
            console.error('Error fetching competence:', err);
            this.isLoading.set(false);
          }
        });
      }
    });
  }

  deleteCompetence(): void {
    const id = this.competence()?.id;
    if (id && confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) {
      this.competenceService.delete(id).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Error deleting competence:', err);
          alert('Erreur lors de la suppression de la compétence.');
        }
      });
    }
  }
}
