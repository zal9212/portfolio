import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ParcoursService } from '../../../services/parcours.service';
import { AuthService } from '../../../services/auth.service';
import { Parcours } from '../../../models/parcours';

@Component({
    selector: 'app-parcours-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './parcours-detail.html',
    styleUrl: './parcours-detail.css'
})
export class ParcoursDetail implements OnInit {
    item = signal<Parcours | undefined>(undefined);
    isLoading = signal<boolean>(true);
    isAdmin = signal<boolean>(false);

    constructor(
        private parcoursService: ParcoursService,
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
                this.parcoursService.getById(id).subscribe({
                    next: (data) => {
                        this.item.set(data);
                        this.isLoading.set(false);
                    },
                    error: (err) => {
                        console.error('Error loading parcours:', err);
                        this.isLoading.set(false);
                    }
                });
            } else {
                this.isLoading.set(false);
            }
        });
    }

    deleteParcours(): void {
        const id = this.item()?.id;
        if (id && confirm('Êtes-vous sûr de vouloir supprimer ce parcours ?')) {
            this.parcoursService.delete(id).subscribe({
                next: () => {
                    this.router.navigate(['/home']);
                },
                error: (err) => {
                    console.error('Error deleting parcours:', err);
                    alert('Erreur lors de la suppression du parcours.');
                }
            });
        }
    }
}
