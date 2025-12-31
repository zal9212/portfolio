import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CompetenceService } from '../../../services/competence.service';
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

  constructor(
    private competenceService: CompetenceService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
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
}
