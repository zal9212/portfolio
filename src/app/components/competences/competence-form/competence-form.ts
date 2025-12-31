import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CompetenceService } from '../../../services/competence.service';
import { Competence } from '../../../models/competence';

@Component({
  selector: 'app-competence-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './competence-form.html',
  styleUrl: './competence-form.css',
})
export class CompetenceForm implements OnInit {
  isEditMode = false;
  competenceId?: number;
  competence: Competence = {
    id: 0,
    titre: '',
    description: '',
    niveau: 5,
    est_visible: true,
    categorie: '',
  };

  // Validation properties
  formSubmitted = false;
  maxTitreLength = 50;
  maxDescriptionLength = 500;

  constructor(
    private competenceService: CompetenceService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.competenceId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('CompetenceForm ngOnInit - ID from route:', this.competenceId);
    if (this.competenceId) {
      this.isEditMode = true;
      console.log('Edit mode activated, fetching competence...');
      this.competenceService.getById(this.competenceId).subscribe({
        next: (data) => {
          console.log('Competence data received:', data);
          this.competence = data;
          console.log('Competence assigned to form:', this.competence);
        },
        error: (error) => {
          console.error('Error loading competence:', error);
          alert('Erreur lors du chargement de la compétence. ID: ' + this.competenceId);
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('La taille du fichier ne doit pas dépasser 2 Mo.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.competence.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  isFormValid(): boolean {
    return !!(
      this.competence.titre &&
      this.competence.titre.trim().length > 0 &&
      this.competence.titre.length <= this.maxTitreLength &&
      this.competence.description &&
      this.competence.description.trim().length > 0 &&
      this.competence.description.length <= this.maxDescriptionLength &&
      this.competence.categorie &&
      this.competence.niveau >= 1 &&
      this.competence.niveau <= 10
    );
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (!this.isFormValid()) {
      alert('Veuillez remplir tous les champs obligatoires correctement.');
      return;
    }

    console.log('Form submitted:', this.competence);

    if (this.isEditMode && this.competenceId) {
      console.log('Updating competence:', this.competenceId);
      this.competenceService.update(this.competenceId, this.competence).subscribe({
        next: () => {
          console.log('Competence updated successfully');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error updating competence:', error);
          alert('Erreur lors de la mise à jour de la compétence. Vérifiez la console pour plus de détails.');
        }
      });
    } else {
      this.competence.id = Math.floor(Math.random() * 10000); // Simple ID generation for json-server
      console.log('Creating new competence:', this.competence);
      this.competenceService.create(this.competence).subscribe({
        next: () => {
          console.log('Competence created successfully');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error creating competence:', error);
          alert('Erreur lors de la création de la compétence. Vérifiez la console pour plus de détails.');
        }
      });
    }
  }

  getRemainingChars(field: 'titre' | 'description'): number {
    const maxLength = field === 'titre' ? this.maxTitreLength : this.maxDescriptionLength;
    const currentLength = this.competence[field]?.length || 0;
    return maxLength - currentLength;
  }

  showError(field: string): boolean {
    return this.formSubmitted && !this.competence[field as keyof Competence];
  }
}
