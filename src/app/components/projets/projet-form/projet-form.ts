import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjetService } from '../../../services/projet.service';
import { CompetenceService } from '../../../services/competence.service';
import { Projet } from '../../../models/projet';
import { Competence } from '../../../models/competence';

@Component({
  selector: 'app-projet-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './projet-form.html',
  styleUrl: './projet-form.css',
})
export class ProjetForm implements OnInit {
  isEditMode = false;
  projetId?: number;
  availableCompetences: Competence[] = [];
  projet: Projet = {
    titre: '',
    description: '',
    technologies: '',
    date_debut: new Date(),
    est_public: true,
    competences: []
  };

  // Validation properties
  formSubmitted = false;
  maxTitreLength = 100;
  maxDescriptionLength = 1000;
  maxTechnologiesLength = 200;

  constructor(
    private projetService: ProjetService,
    private competenceService: CompetenceService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.competenceService.getAll().subscribe((data) => {
      this.availableCompetences = data;
    });

    this.projetId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.projetId) {
      this.isEditMode = true;
      this.projetService.getById(this.projetId).subscribe((data) => {
        this.projet = data;
        if (!this.projet.competences) {
          this.projet.competences = [];
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 5MB for project images)
      if (file.size > 5 * 1024 * 1024) {
        alert('La taille du fichier ne doit pas dépasser 5 Mo.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.projet.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  isFormValid(): boolean {
    return !!(
      this.projet.titre &&
      this.projet.titre.trim().length > 0 &&
      this.projet.titre.length <= this.maxTitreLength &&
      this.projet.description &&
      this.projet.description.trim().length > 0 &&
      this.projet.description.length <= this.maxDescriptionLength &&
      this.projet.date_debut
    );
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (!this.isFormValid()) {
      alert('Veuillez remplir tous les champs obligatoires correctement.');
      return;
    }

    console.log('Form submitted:', this.projet);

    if (this.isEditMode && this.projetId) {
      console.log('Updating projet:', this.projetId);
      this.projetService.update(this.projetId, this.projet).subscribe({
        next: () => {
          console.log('Projet updated successfully');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error updating projet:', error);
          alert('Erreur lors de la mise à jour du projet. Vérifiez la console pour plus de détails.');
        }
      });
    } else {
      this.projet.id = Math.floor(Math.random() * 10000);
      console.log('Creating new projet:', this.projet);
      this.projetService.create(this.projet).subscribe({
        next: () => {
          console.log('Projet created successfully');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error creating projet:', error);
          alert('Erreur lors de la création du projet. Vérifiez la console pour plus de détails.');
        }
      });
    }
  }

  onCompetenceToggle(id: number): void {
    if (!this.projet.competences) {
      this.projet.competences = [];
    }
    const index = this.projet.competences.indexOf(id);
    if (index > -1) {
      this.projet.competences.splice(index, 1);
    } else {
      this.projet.competences.push(id);
    }
  }

  isCompetenceSelected(id: number): boolean {
    return this.projet.competences?.includes(id) || false;
  }

  getRemainingChars(field: 'titre' | 'description' | 'technologies'): number {
    let maxLength = 0;
    if (field === 'titre') maxLength = this.maxTitreLength;
    else if (field === 'description') maxLength = this.maxDescriptionLength;
    else if (field === 'technologies') maxLength = this.maxTechnologiesLength;

    const currentLength = this.projet[field]?.toString().length || 0;
    return maxLength - currentLength;
  }
}
