import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ParcoursService } from '../../../services/parcours.service';
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

    constructor(
        private parcoursService: ParcoursService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
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
}
