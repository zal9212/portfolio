import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ParcoursService } from '../../../services/parcours.service';
import { Parcours } from '../../../models/parcours';

@Component({
    selector: 'app-parcours-form',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './parcours-form.html',
})
export class ParcoursForm implements OnInit {
    parcours: Parcours = {
        titre: '',
        categorie: 'education',
        annee_debut: new Date().getFullYear(),
        entreprise: '',
        description: '',
        competences: '',
        realisations: '',
        icone: '',
        ordre: 0,
        est_visible: true
    };

    isEditMode = false;

    constructor(
        private parcoursService: ParcoursService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.parcoursService.getById(id).subscribe({
                next: (data) => this.parcours = data,
                error: (err) => console.error('Erreur chargement parcours', err)
            });
        }
    }

    onSubmit(): void {
        if (this.isEditMode && this.parcours.id) {
            this.parcoursService.update(this.parcours.id, this.parcours).subscribe({
                next: () => this.router.navigate(['/parcours']),
                error: (err) => console.error('Erreur mise à jour', err)
            });
        } else {
            this.parcoursService.create(this.parcours).subscribe({
                next: () => this.router.navigate(['/parcours']),
                error: (err) => console.error('Erreur création', err)
            });
        }
    }
}
