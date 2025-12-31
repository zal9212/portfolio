import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjetService } from '../../../services/projet.service';
import { AuthService } from '../../../services/auth.service';
import { Projet } from '../../../models/projet';

@Component({
  selector: 'app-projet-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projet-list.html',
  styleUrl: './projet-list.css',
})
export class ProjetList implements OnInit {
  projets = signal<Projet[]>([]);
  isAdmin = signal<boolean>(false);

  constructor(
    private projetService: ProjetService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isAdmin.set(user?.role === 'admin');
    });
    this.loadProjets();
  }

  loadProjets(): void {
    this.projetService.getAll().subscribe((data) => {
      this.projets.set(data);
    });
  }

  deleteProjet(id: number | undefined, event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    console.log('Attempting to delete projet with ID:', id);

    if (id && confirm('Etes-vous sûr de vouloir supprimer ce projet ?')) {
      this.projetService.delete(id).subscribe({
        next: () => {
          console.log('Projet deleted successfully:', id);
          this.loadProjets();
        },
        error: (error) => {
          console.error('Error deleting projet:', error);
          alert('Erreur lors de la suppression du projet. Vérifiez la console pour plus de détails.');
        }
      });
    }
  }
}
