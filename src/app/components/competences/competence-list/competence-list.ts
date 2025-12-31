import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CompetenceService } from '../../../services/competence.service';
import { AuthService } from '../../../services/auth.service';
import { Competence } from '../../../models/competence';

@Component({
  selector: 'app-competence-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './competence-list.html',
  styleUrl: './competence-list.css',
})
export class CompetenceList implements OnInit {
  competences = signal<Competence[]>([]);
  isAdmin = signal<boolean>(false);

  constructor(
    private competenceService: CompetenceService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isAdmin.set(user?.role === 'admin');
    });
    this.loadCompetences();
  }

  loadCompetences(): void {
    this.competenceService.getAll().subscribe((data) => {
      this.competences.set(data.filter(c => c.est_visible || this.isAdmin()));
    });
  }

  getCategories(): string[] {
    const categories = this.competences()
      .map(c => c.categorie || 'Autres')
      .filter((value, index, self) => self.indexOf(value) === index);
    return categories;
  }

  getCompetencesByCategory(category: string): Competence[] {
    return this.competences().filter(c => (c.categorie || 'Autres') === category);
  }

  deleteCompetence(id: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    console.log('Attempting to delete competence with ID:', id);

    if (confirm('Etes-vous sûr de vouloir supprimer cette compétence ?')) {
      this.competenceService.delete(id).subscribe({
        next: () => {
          console.log('Competence deleted successfully:', id);
          this.loadCompetences();
        },
        error: (error) => {
          console.error('Error deleting competence:', error);
          alert('Erreur lors de la suppression de la compétence. Vérifiez la console pour plus de détails.');
        }
      });
    }
  }
}
