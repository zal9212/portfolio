import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ParcoursService } from '../../../services/parcours.service';
import { Parcours } from '../../../models/parcours';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-parcours-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './parcours-list.html',
  styleUrl: './parcours-list.css',
})
export class ParcoursList implements OnInit {
  parcours = signal<Parcours[]>([]);

  constructor(
    private parcoursService: ParcoursService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.parcoursService.getAll().subscribe({
      next: (data: Parcours[]) => {
        const sortedData = data.sort((a: Parcours, b: Parcours) => (b.annee_debut || 0) - (a.annee_debut || 0));
        this.parcours.set(sortedData);
      },
      error: (err) => console.error('ParcoursList: Error', err)
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  deleteParcours(id: number | undefined, event: Event): void {
    event.stopPropagation();
    if (!id) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer ce parcours ?')) {
      this.parcoursService.delete(id).subscribe({
        next: () => {
          this.parcours.set(this.parcours().filter(p => p.id !== id));
          console.log('Parcours deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting parcours:', error);
          alert('Erreur lors de la suppression du parcours.');
        }
      });
    }
  }
}
