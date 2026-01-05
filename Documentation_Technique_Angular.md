# Rapport Final de Stage : Réalisation d'un Portfolio Dynamique
## Licence Telecommunications et Informatique (LTI/DAR)

**Étudiants :**
- Mamadou Saliou Diallo (Développeur Backend)
- Gnima Sané (Développeuse Frontend)

**Encadreur :** [Nom de l'encadreur]
**Institution :** Ecole Superieure Multinationale des Telecommunications (ESMT), Dakar

---

## Sommaire
1. **Introduction**
2. **Architecture Technique**
3. **Composant : Home (Accueil)**
4. **Composant : Login (Authentification)**
5. **Composant : Dashboard (Administration)**
6. **Module : Gestion des Compétences**
7. **Module : Gestion des Projets**
8. **Module : Gestion du Parcours**
9. **Services et Logique de Données**
10. **Sécurité et Protection des Routes**
11. **Justification des Choix et Améliorations**
12. **Conclusion**

---

## 1. Introduction
Ce projet consiste en la conception et le développement d'une application web de type "Portfolio" utilisant le framework **Angular**. L'objectif est de permettre à des professionnels ou des étudiants de présenter leurs compétences, leurs réalisations (projets) et leur parcours (formations et expériences) de manière élégante et interactive.

L'application intègre un espace d'administration sécurisé permettant de mettre à jour le contenu dynamiquement sans modifier le code source. Cette flexibilité est cruciale pour un portfolio qui doit évoluer avec la carrière de ses propriétaires.

---

## 2. Architecture Technique

L'architecture est basée sur le patron de conception **Composant-Service** favorisé par Angular.

- **Frontend Core** : Angular 21 (Standalone Components).
- **Styling UI** : Tailwind CSS pour un design moderne et responsive.
- **Gestion des Formulaires** : Reactive & Template Driven Forms.
- **Backend Mock** : JSON Server (API REST).
- **Injection de Dépendances** : Services isolés pour la communication HTTP.

---

## 3. Interface d'Accueil (Home)
### Description
L'interface d'accueil est le point d'entrée principal. Elle utilise une architecture de composants imbriqués pour afficher les différentes sections du portfolio.

**Capture d'écran :** `accueil_full.png`

#### 3.1. Template HTML (`home.html`)
```html
<section id="profile" class="flex justify-center gap-10 md:gap-20 py-[10vh] h-auto max-lg:flex-col max-lg:items-center">
    @for (profile of profiles; track $index) {
    <div class="profile-card flex flex-col items-center gap-6 p-8 rounded-[3rem] border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div class="section__pic-container flex h-[300px] w-[300px] max-md:h-[200px] max-md:w-[200px]">
            <img [src]="profile.image" [alt]="profile.name" class="rounded-full w-full h-full object-cover" />
        </div>
        <div class="section__text text-center px-4">
            <h1 class="title text-2xl md:text-4xl font-bold">{{ profile.name }}</h1>
            <p class="text-lg md:text-xl mb-4 font-semibold text-gray-500">{{ profile.role }}</p>
            <div class="btn-container flex justify-center gap-4">
                <button (click)="openCV(profile.cv)" class="font-semibold p-3 w-32 rounded-[2rem] border border-black hover:bg-black hover:text-white transition-all">CV</button>
                <button (click)="scrollToContact()" class="font-semibold p-3 w-32 rounded-[2rem] bg-black text-white hover:bg-gray-800 transition-all">Contact</button>
            </div>
        </div>
    </div>
    }
</section>
<app-parcours-list></app-parcours-list>
<app-competence-list></app-competence-list>
<app-projet-list></app-projet-list>
```

#### 3.2. Logique TypeScript (`home.ts`)
```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompetenceList } from '../competences/competence-list/competence-list';
import { ProjetList } from '../projets/projet-list/projet-list';
import { ParcoursList } from '../parcours/parcours-list/parcours-list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CompetenceList, ProjetList, ParcoursList],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  profiles = [
    { name: 'Mamadou Saliou Diallo', role: 'Backend Dev', image: 'assets/saliou.jpg', cv: 'assets/cv.pdf' },
    { name: 'Gnima Sané', role: 'Frontend Dev', image: 'assets/gnima.png', cv: 'assets/cv.pdf' }
  ];

  openCV(cvPath: string) { window.open(cvPath, '_blank'); } 
  scrollToContact() { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }
}
```

---

## 4. Authentification (Login)
### Description
Sécurise l'accès à la partie administration.

**Capture d'écran :** `login_interface.png`

#### 4.1. Template HTML (`login.html`)
```html
<form (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
    <input type="text" name="username" [(ngModel)]="username" placeholder="Username" required class="...">
    <input type="password" name="password" [(ngModel)]="password" placeholder="Password" required class="...">
    <button type="submit" class="w-full py-4 bg-black text-white font-bold rounded-[2rem]">Se connecter</button>
    <p *ngIf="errorMessage" class="text-red-500 text-center">{{ errorMessage }}</p>
</form>
```

#### 4.2. Logique TypeScript (`login.ts`)
```typescript
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';
  
  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (users) => { 
        if (users.length > 0) this.router.navigate(['/']);
        else this.errorMessage = 'Erreur';
      },
      error: () => this.errorMessage = 'Erreur serveur' 
    });
  }
}
```

---

## 5. Tableau de Bord (Dashboard)
### Description
Vue d'ensemble statistique pour l'admin.

**Capture d'écran :** `dashboard_admin.png`

#### 5.1. Template HTML (`dashboard.html`)
```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
    <div class="bg-white p-8 rounded-[2rem] border border-[#a3a3a3] shadow-sm flex flex-col items-center">
        <span class="text-5xl font-bold mb-2">{{ stats().competences }}</span>
        <span class="text-gray-500 font-semibold uppercase tracking-wider">Compétences</span>
    </div>
    <div class="bg-white p-8 rounded-[2rem] border border-[#a3a3a3] shadow-sm flex flex-col items-center">
        <span class="text-5xl font-bold mb-2">{{ stats().projets }}</span>
        <span class="text-gray-500 font-semibold uppercase tracking-wider">Projets</span>
    </div>
</div>
```

---

## 6. Gestion des Compétences
### 6.1. Liste des Compétences
Affiche les savoir-faire avec barres de progression.

#### 6.1.1. Template HTML (`competence-list.html`)
```html
<section id="experience" class="py-20 bg-gray-50 font-poppins min-h-screen">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Titre de la section avec sous-titre stylisé -->
        <div class="text-center mb-16">
            <p class="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">Découvrez mes</p>
            <h2 class="text-3xl md:text-5xl font-bold text-black mb-4">Mes Compétences</h2>
            <div class="h-1.5 w-20 bg-black mx-auto rounded-full"></div>
        </div>

        <!-- Bouton d'ajout visible uniquement pour l'administrateur -->
        <div class="flex justify-center mb-12" *ngIf="isAdmin()">
            <a routerLink="/competences/new"
                class="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all font-bold shadow-lg">
                + Ajouter une compétence
            </a>
        </div>

        <!-- Grille principale itérant sur les catégories de compétences -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div *ngFor="let cat of getCategories()"
                class="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-200 shadow-sm hover:shadow-md transition-all">

                <h3 class="text-2xl font-bold mb-8 flex items-center gap-3">
                    <span class="w-2 h-8 bg-black rounded-full"></span>
                    {{ cat }}
                </h3>

                <!-- Sous-grille itérant sur les compétences d'une catégorie donnée -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div *ngFor="let comp of getCompetencesByCategory(cat)"
                        class="group relative p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">

                        <div class="flex items-center gap-4">
                            <!-- Affichage de l'icône de la compétence ou d'un checkmark par défaut -->
                            <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center p-2 group-hover:bg-white transition-all shadow-sm">
                                <img [src]="comp.image || 'assets/checkmark.png'" alt="Skill icon" class="w-full h-full object-contain">
                            </div>

                            <div class="flex-1">
                                <div class="flex justify-between items-end mb-1">
                                    <h4 class="font-bold text-gray-800">{{ comp.titre }}</h4>
                                    <span class="text-[10px] font-bold text-gray-400">{{ comp.niveau }}/10</span>
                                </div>
                                <!-- Barre de progression dynamique basée sur le niveau -->
                                <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                    <div class="bg-black h-full rounded-full transition-all duration-1000"
                                        [style.width.%]="comp.niveau * 10"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Boutons d'édition et suppression réservés à l'admin -->
                        <div class="absolute top-2 right-2 flex gap-2 transition-opacity" *ngIf="isAdmin()">
                            <a [routerLink]="['/competences/edit', comp.id]" (click)="$event.stopPropagation()"
                                class="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 z-10 relative">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </a>
                            <button (click)="deleteCompetence(comp.id, $event)"
                                class="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 z-10 relative">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>

                        <a [routerLink]="['/competences', comp.id]" class="absolute inset-0 z-0" title="Voir les détails"></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

#### 6.1.2. Logique TypeScript (`competence-list.ts`)
```typescript
import { Component, OnInit, signal } from '@angular/core'; // Importation des classes de base et des Signals pour la réactivité
import { CommonModule } from '@angular/common'; // Importation des fonctionnalités Angular communes
import { RouterLink } from '@angular/router'; // Importation pour la navigation par liens
import { CompetenceService } from '../../../services/competence.service'; // Importation du service de gestion des compétences
import { AuthService } from '../../../services/auth.service'; // Importation du service d'authentification
import { Competence } from '../../../models/competence'; // Importation de l'interface du modèle Compétence

@Component({
  selector: 'app-competence-list', // Nom du sélecteur du composant
  standalone: true, // Composant sans module parent
  imports: [CommonModule, RouterLink], // Liste des dépendances UI
  templateUrl: './competence-list.html', // Localisation du template HTML
  styleUrl: './competence-list.css', // Localisation des styles CSS
})
export class CompetenceList implements OnInit { // Classe gérant la liste des compétences
  // Déclaration d'un Signal pour stocker et mettre à jour la liste des compétences réactivement
  competences = signal<Competence[]>([]);
  // Signal booléen pour savoir si l'utilisateur courant a les droits administrateur
  isAdmin = signal<boolean>(false);

  // Constructeur avec injection des services métier
  constructor(
    private competenceService: CompetenceService,
    private authService: AuthService
  ) { }

  // Méthode s'exécutant à l'initialisation du composant
  ngOnInit(): void {
    // Écoute de l'état de l'utilisateur pour mettre à jour isAdmin
    this.authService.currentUser$.subscribe(user => {
      this.isAdmin.set(user?.role === 'admin');
    });
    // Appel de la méthode de chargement des données
    this.loadCompetences();
  }

  // Méthode récupérant les compétences via le service API
  loadCompetences(): void {
    this.competenceService.getAll().subscribe((data) => {
      // Si l'utilisateur est admin, il voit tout. Sinon, seulement les compétences visibles.
      this.competences.set(data.filter(c => c.est_visible || this.isAdmin()));
    });
  }

  // Méthode calculant les catégories uniques de compétences présentes
  getCategories(): string[] {
    const categories = this.competences()
      .map(c => c.categorie || 'Autres') // Récupère les catégories ou met 'Autres' par défaut
      .filter((value, index, self) => self.indexOf(value) === index); // Garde uniquement les valeurs uniques
    return categories;
  }

  // Méthode filtrant les compétences appartenant à une catégorie spécifique
  getCompetencesByCategory(category: string): Competence[] {
    return this.competences().filter(c => (c.categorie || 'Autres') === category);
  }

  // Méthode gérant la suppression d'une compétence avec confirmation
  deleteCompetence(id: number, event?: Event): void {
    if (event) {
      event.stopPropagation(); // Stop la propagation de l'événement clic
      event.preventDefault(); // Annule le comportement par défaut
    }
    // Demande de confirmation avant action irréversible
    if (confirm('Etes-vous sûr de vouloir supprimer cette compétence ?')) {
      this.competenceService.delete(id).subscribe({
        next: () => {
          this.loadCompetences(); // Rechargement de la liste après suppression
        },
        error: (error) => {
          console.error('Error deleting competence:', error); // Log l'erreur en console
        }
      });
    }
  }
}
```



### 6.2. Détail d'une Compétence (`CompetenceDetail`)
Offre une vue approfondie sur une compétence spécifique, incluant sa description longue.

**Capture d'écran :** `competence_detail.png`

#### 6.2.1. Template HTML (`competence-detail.html`)
```html
<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-poppins fadeIn" *ngIf="!isLoading() && competence()">
    <div class="max-w-4xl mx-auto bg-white p-10 rounded-[2.5rem] border border-gray-200 shadow-sm text-center">
        <div class="flex flex-col items-center">
            <!-- Icône agrandie -->
            <div class="w-32 h-32 bg-gray-100 rounded-3xl flex items-center justify-center p-6 mb-8 shadow-inner overflow-hidden">
                <img [src]="competence()?.image || 'assets/checkmark.png'" alt="Skill Image" class="w-full h-full object-contain" />
            </div>

            <!-- Badge de catégorie -->
            <div class="mb-4">
                <span class="px-4 py-1.5 bg-black text-white text-xs font-bold rounded-full uppercase tracking-widest">
                    {{ competence()?.categorie || 'Compétence' }}
                </span>
            </div>

            <h1 class="text-5xl font-bold mb-2 text-gray-900">{{ competence()?.titre }}</h1>

            <!-- Jauge de maîtrise détaillée -->
            <div class="w-64 mx-auto mb-8">
                <div class="flex justify-between items-end mb-2">
                    <span class="text-sm font-bold text-gray-500">Maitrise actuelle</span>
                    <span class="text-lg font-bold text-black">{{ competence()?.niveau }}/10</span>
                </div>
                <div class="w-full bg-gray-100 h-3 rounded-full overflow-hidden shadow-sm">
                    <div class="bg-black h-full rounded-full transition-all duration-1000"
                        [style.width.%]="(competence()?.niveau || 0) * 10"></div>
                </div>
            </div>

            <!-- Description textuelle -->
            <div class="w-full max-w-2xl">
                <p class="text-gray-600 leading-relaxed text-lg italic bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                    {{ competence()?.description || 'Aucune description fournie.' }}
                </p>
            </div>

            <!-- Actions admin et retour -->
            <div class="mt-16 pt-8 border-t border-gray-100 w-full">
                <div class="flex gap-4 justify-center mb-6" *ngIf="isAdmin()">
                    <a [routerLink]="['/competences/edit', competence()?.id]" class="px-6 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all font-semibold">Modifier</a>
                    <button (click)="deleteCompetence()" class="px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-semibold">Supprimer</button>
                </div>
                <a routerLink="/home" class="text-gray-500 font-bold hover:text-black transition-all">← Retour au Portfolio</a>
            </div>
        </div>
    </div>
</div>
```

#### 6.2.2. Logique TypeScript (`competence-detail.ts`)
```typescript
import { Component, OnInit, signal } from '@angular/core'; // Classes de base et Signals
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // Outils de routage et navigation
import { CompetenceService } from '../../../services/competence.service'; // Service de données compétences
import { AuthService } from '../../../services/auth.service'; // Service de gestion de session
import { Competence } from '../../../models/competence'; // Modèle de données

@Component({
  selector: 'app-competence-detail', // Sélecteur CSS
  standalone: true, // Auto-suffisant
  imports: [CommonModule, RouterLink], // Modules requis pour la vue
  templateUrl: './competence-detail.html', // Template associé
})
export class CompetenceDetail implements OnInit { // Composant de vue détaillée
  // Stocke la compétence chargée de manière réactive
  competence = signal<Competence | undefined>(undefined);
  // État de chargement pour l'affichage conditionnel
  isLoading = signal<boolean>(true);
  // Détermine si les boutons d'action d'administration doivent s'afficher
  isAdmin = signal<boolean>(false);

  // Injection des services nécessaires
  constructor(
    private competenceService: CompetenceService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  // Initialisation du composant : récupération de l'ID et chargement
  ngOnInit(): void {
    // Vérification asynchrone des droits de l'utilisateur
    this.authService.currentUser$.subscribe(user => this.isAdmin.set(user?.role === 'admin'));

    // Écoute des changements de paramètres dans l'URL
    this.route.params.subscribe(params => {
      const id = params['id']; // Récupération du paramètre ID
      if (id) {
        // Requête vers le service pour obtenir les détails
        this.competenceService.getById(id).subscribe({
          next: (data) => { 
            this.competence.set(data); // Mise à jour du signal avec les données
            this.isLoading.set(false); // Fin de l'état de chargement
          },
          error: () => this.isLoading.set(false) // Arrêt du chargement en cas d'erreur
        });
      }
    });
  }

  // Méthode permettant de supprimer l'élément courant
  deleteCompetence(): void {
    const id = this.competence()?.id; // Récupère l'ID de la compétence chargée
    if (id && confirm('Êtes-vous sûr ?')) { // Demande confirmation
      // Appel du service pour la suppression effective
      this.competenceService.delete(id).subscribe(() => this.router.navigate(['/home'])); // Redirection après succès
    }
  }
}
```

### 6.3. Formulaire de Compétence (`CompetenceForm`)
Interface unifiée pour la création et la modification, utilisant la validation de formulaire.

**Capture d'écran :** `competence_form.png`

#### 6.3.1. Template HTML (`competence-form.html`)
```html
<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-poppins">
    <div class="max-w-2xl mx-auto bg-white p-10 rounded-[2rem] border border-[#a3a3a3] shadow-sm">
        <h2 class="text-3xl font-bold text-center mb-8">{{ isEditMode ? 'Modifier' : 'Ajouter' }} une compétence</h2>

        <form (ngSubmit)="onSubmit()" #competenceForm="ngForm" class="space-y-6">
            <!-- Champs Libellé et Niveau -->
            <div class="grid grid-cols-2 gap-4">
                <input type="text" name="titre" [(ngModel)]="competence.titre" required placeholder="ex: Angular" class="px-4 py-3 rounded-full border">
                <input type="number" name="niveau" [(ngModel)]="competence.niveau" min="1" max="10" required class="px-4 py-3 rounded-full border">
            </div>

            <!-- Description longue -->
            <textarea name="description" [(ngModel)]="competence.description" rows="3" required class="w-full px-4 py-3 rounded-2xl border" placeholder="Description..."></textarea>

            <!-- Gestion de l'image illustrative -->
            <div class="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <img [src]="competence.image || 'assets/checkmark.png'" class="w-24 h-24 object-contain">
                <input type="file" (change)="onFileSelected($event)" accept="image/*" class="text-xs">
            </div>

            <!-- Sélection de la catégorie et validation -->
            <select name="categorie" [(ngModel)]="competence.categorie" required class="w-full px-4 py-3 rounded-full border">
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Design">Design</option>
            </select>

            <button type="submit" class="w-full bg-black text-white font-bold py-4 rounded-full hover:bg-gray-800 transition-all">
                {{ isEditMode ? 'Enregistrer' : 'Créer' }}
            </button>
        </form>
    </div>
</div>
```

---

#### 7.1.1. Template HTML (`projet-list.html`)
```html
<section id="projects" class="py-20 bg-white font-poppins">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- En-tête de section -->
        <div class="text-center mb-16">
            <p class="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">Mes réalisations</p>
            <h2 class="text-3xl md:text-5xl font-bold text-black mb-4">Mes Projets Pro</h2>
            <div class="h-1.5 w-20 bg-black mx-auto rounded-full"></div>
        </div>

        <!-- Grille de cartes de projets -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div *ngFor="let proj of projets()"
                class="group flex flex-col bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative">
                
                <!-- Zone d'image avec effet de survol -->
                <div class="h-64 overflow-hidden relative">
                    <img [src]="proj.image || 'assets/project-1.png'" [alt]="proj.titre"
                        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                    <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                </div>

                <!-- Détails du projet -->
                <div class="p-8 flex-1 flex flex-col">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-2xl font-bold text-gray-900 group-hover:text-black transition-colors">{{ proj.titre }}</h3>
                        <span class="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{{ proj.technologies.split(',')[0] }}</span>
                    </div>
                    <p class="text-gray-600 mb-8 line-clamp-3 leading-relaxed flex-1">
                        {{ proj.description }}
                    </p>

                    <!-- Bouton d'action -->
                    <div class="flex items-center justify-between mt-auto">
                        <a [routerLink]="['/projets', proj.id]"
                            class="text-sm font-black text-black uppercase tracking-tighter border-b-2 border-black pb-1 hover:border-gray-400 hover:text-gray-500 transition-all">
                            Voir le projet →
                        </a>
                        <div class="flex gap-2" *ngIf="isAdmin()">
                             <!-- Liens rapides admin -->
                             <a [routerLink]="['/projets/edit', proj.id]" (click)="$event.stopPropagation()" class="text-blue-500 hover:text-blue-700">Editer</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

#### 7.1.2. Logique TypeScript (`projet-list.ts`)
```typescript
import { Component, OnInit, signal } from '@angular/core'; // Importation des cœurs Angular et des Signals
import { CommonModule } from '@angular/common'; // Importation des directives de base
import { RouterLink } from '@angular/router'; // Importation du module de liens de routage
import { ProjetService } from '../../../services/projet.service'; // Importation du service métier des projets
import { AuthService } from '../../../services/auth.service'; // Importation du service d'accès et d'identité
import { Projet } from '../../../models/projet'; // Importation de l'interface typée Projet

@Component({
  selector: 'app-projet-list', // Définition de la balise HTML du composant
  standalone: true, // Composant utilisable sans déclaration dans un module
  imports: [CommonModule, RouterLink], // Liste des outils Angular nécessaires pour le HTML
  templateUrl: './projet-list.html', // Pointage vers le fichier de structure visuelle
})
export class ProjetList implements OnInit { // Classe orchestrant la liste des projets
  // Signal réactif contenant le tableau des projets récupérés
  projets = signal<Projet[]>([]);
  // Signal réactif indiquant si l'utilisateur a des privilèges d'édition
  isAdmin = signal<boolean>(false);

  // Injection des dépendances via le constructeur
  constructor(
    private projetService: ProjetService,
    private authService: AuthService
  ) { }

  // Phase d'initialisation du composant
  ngOnInit(): void {
    // Écoute du flux utilisateur pour basculer l'état admin
    this.authService.currentUser$.subscribe(user => this.isAdmin.set(user?.role === 'admin'));
    // Lancement de la récupération des données
    this.loadProjets();
  }

  // Requête vers le service pour bpupler le signal projets
  loadProjets(): void {
    this.projetService.getAll().subscribe((data) => this.projets.set(data));
  }

  // Gestion de la suppression d'un projet ciblé par son identifiant
  deleteProjet(id: number | undefined, event?: Event): void {
    if (event) event.stopPropagation(); // Évite de déclencher la navigation vers le détail
    // Demande de confirmation avant suppression API
    if (id && confirm('Sûr ?')) {
      this.projetService.delete(id).subscribe(() => this.loadProjets()); // Rechargement automatique après succès
    }
  }
}
```

### 7.2. Détail du Projet (`ProjetDetail`)
Interface immersive présentant une étude de cas complète pour chaque réalisation.

**Capture d'écran de l'interface :**
> [!NOTE]
> *Insérer ici la capture d'écran du détail du projet.*

#### 7.2.1. Template HTML (`projet-detail.html`)
```html
<div class="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-poppins fadeIn" *ngIf="!isLoading() && projet()">
    <div class="max-w-6xl mx-auto">
        <!-- Navigation haute avec indicateur de statut -->
        <div class="mb-8 flex items-center justify-between">
            <a routerLink="/home" class="flex items-center gap-2 text-gray-500 hover:text-black transition-all group font-bold">
                ← Retour au Portfolio
            </a>
            <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">{{ projet()?.est_public ? 'Public' : 'Privé' }}</span>
        </div>

        <!-- Bloc principal : Design Split Screen -->
        <div class="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100">
            <div class="grid grid-cols-1 lg:grid-cols-12">
                <!-- Zone Visuelle -->
                <div class="lg:col-span-7 bg-gray-100 overflow-hidden">
                    <img [src]="projet()?.image || 'assets/project-1.png'" class="w-full h-full object-cover min-h-[400px] lg:min-h-[600px]" />
                </div>

                <!-- Zone Informations -->
                <div class="lg:col-span-5 p-8 lg:p-12">
                    <h1 class="text-4xl lg:text-5xl font-black text-gray-900 mb-6">{{ projet()?.titre }}</h1>
                    
                    <!-- Technologies sous forme de tags -->
                    <div class="flex flex-wrap gap-2 mb-8">
                        <span *ngFor="let tech of (projet()?.technologies || '').split(',')"
                            class="bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase">
                            {{ tech.trim() }}
                        </span>
                    </div>

                    <!-- Blocs de contenu descriptif -->
                    <div class="space-y-8">
                        <section>
                            <h2 class="text-lg font-bold text-gray-900 border-b-2 border-gray-100 pb-2 mb-4 uppercase">Description</h2>
                            <p class="text-gray-600 leading-relaxed">{{ projet()?.description }}</p>
                        </section>

                        <!-- Liens externes (Github/Live Demo) -->
                        <div class="flex gap-4 pt-4">
                            <a *ngIf="projet()?.lien_demo" [href]="projet()?.lien_demo" target="_blank" class="flex-1 bg-black text-white py-4 rounded-2xl font-bold text-center shadow-lg">Live Demo</a>
                            <a *ngIf="projet()?.lien_github" [href]="projet()?.lien_github" target="_blank" class="flex-1 border-2 border-black py-4 rounded-2xl font-bold text-center">Github</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
```

#### 7.2.2. Logique TypeScript (`projet-detail.ts`)
```typescript
import { Component, OnInit, signal } from '@angular/core'; // Classes réactives et cycle de vie
import { CommonModule } from '@angular/common'; // Directives structurelles
import { ActivatedRoute, RouterLink } from '@angular/router'; // Navigation et paramètres de route
import { ProjetService } from '../../../services/projet.service'; // Service de données projets
import { CompetenceService } from '../../../services/competence.service'; // Service de données compétences
import { Projet } from '../../../models/projet'; // Contrat d'interface Projet
import { Competence } from '../../../models/competence'; // Contrat d'interface Compétence

@Component({
  selector: 'app-projet-detail', // Sélecteur personnalisé
  standalone: true, // Auto-déclaré
  imports: [CommonModule, RouterLink], // Modules requis pour la vue
  templateUrl: './projet-detail.html', // Fichier de template
})
export class ProjetDetail implements OnInit { // Composant affichant l'étude de cas d'un projet
  // Signal contenant les données du projet courant
  projet = signal<Projet | undefined>(undefined);
  // Signal contenant les compétences spécifiquement liées à ce projet
  linkedCompetences = signal<Competence[]>([]);
  // État binaire pour gérer les indicateurs de chargement
  isLoading = signal<boolean>(true);

  // Injection des services nécessaires via le constructeur
  constructor(
    private projetService: ProjetService,
    private competenceService: CompetenceService,
    private route: ActivatedRoute
  ) { }

  // Initialisation : Extraction de l'ID et chargement des données
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Capture l'identifiant de la route (URL)
    if (id) {
      // Récupération des détails du projet via l'ID
      this.projetService.getById(id).subscribe({
        next: (data) => {
          this.projet.set(data); // Stocke le projet trouvé
          // Si le projet a des liens avec des compétences, on les charge
          if (data.competences && data.competences.length > 0) {
            this.loadLinkedCompetences(data.competences);
          } else {
            this.isLoading.set(false); // Sinon, on arrête le chargement immédiatement
          }
        },
        error: () => this.isLoading.set(false) // Gestion d'erreur basique
      });
    }
  }

  // Charge les objets Compétence complets à partir d'une liste d'identifiants
  loadLinkedCompetences(ids: number[]): void {
    this.competenceService.getAll().subscribe(all => {
      // Filtrage du catalogue global pour ne garder que les IDs pertinents
      this.linkedCompetences.set(all.filter(c => ids.includes(c.id)));
      this.isLoading.set(false); // Fin du processus de chargement global
    });
  }
}
```

### 7.3. Formulaire Projet (`ProjetForm`)
Composant critique gérant la création et la modification, incluant la gestion des relations avec les compétences.

**Capture d'écran de l'interface :**
> [!NOTE]
> *Insérer ici la capture d'écran du formulaire de projet.*

#### 7.3.1. Template HTML (`projet-form.html`)
```html
<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-poppins">
    <div class="max-w-4xl mx-auto w-full">
        <div class="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100">
            <h2 class="text-3xl font-black text-black mb-10 text-center uppercase tracking-tighter">
                {{ isEditMode ? 'Modifier le Projet' : 'Nouveau Projet' }}
            </h2>

            <form (ngSubmit)="onSubmit()" #projForm="ngForm" class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Titre et Technologies -->
                    <div class="space-y-6">
                        <div>
                            <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Titre du Projet</label>
                            <input type="text" name="titre" [(ngModel)]="projet.titre" required
                                class="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-black transition-all">
                        </div>
                        <div>
                            <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Technologies (séparées par des virgules)</label>
                            <input type="text" name="technologies" [(ngModel)]="projet.technologies" required
                                class="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-black transition-all">
                        </div>
                    </div>

                    <!-- Image et Liens -->
                    <div class="space-y-6">
                        <div>
                            <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Image du projet</label>
                            <input type="file" (change)="onFileSelected($event)" class="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-black file:text-white hover:file:bg-gray-800 transition-all">
                        </div>
                        <div class="flex gap-4">
                            <div class="flex-1">
                                <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Lien Demo</label>
                                <input type="text" name="lien_demo" [(ngModel)]="projet.lien_demo" class="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-black">
                            </div>
                            <div class="flex-1">
                                <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Lien Github</label>
                                <input type="text" name="lien_github" [(ngModel)]="projet.lien_github" class="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-black">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Description XL -->
                <div>
                    <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Description détaillée</label>
                    <textarea name="description" [(ngModel)]="projet.description" rows="5" required
                        class="w-full bg-gray-50 border-none rounded-3xl p-6 focus:ring-2 focus:ring-black transition-all"></textarea>
                </div>

                <!-- Sélection des compétences liées -->
                <div class="bg-gray-50 p-8 rounded-[2rem]">
                    <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Associer des Compétences</label>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div *ngFor="let comp of allCompetences" 
                             (click)="toggleCompetence(comp.id)"
                             [class.bg-black]="isCompetenceSelected(comp.id)"
                             [class.text-white]="isCompetenceSelected(comp.id)"
                             class="p-4 rounded-2xl border-2 border-gray-200 cursor-pointer text-center transition-all hover:scale-105">
                            <span class="text-[10px] font-bold uppercase">{{ comp.titre }}</span>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-4 pt-6">
                    <button type="button" routerLink="/home" class="flex-1 py-4 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all">Annuler</button>
                    <button type="submit" [disabled]="!projForm.valid" class="flex-[2] bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-gray-900 transition-all disabled:opacity-50">
                        {{ isEditMode ? 'Mettre à jour' : 'Créer le Projet' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
```

#### 7.3.2. Logique TypeScript (`projet-form.ts`)
```typescript
import { Component, OnInit } from '@angular/core'; // Importation des classes de base Angular
import { CommonModule } from '@angular/common'; // Importation des directives structurelles
import { FormsModule } from '@angular/forms'; // Importation pour la gestion des formulaires (ngModel)
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // Outils de routage et navigation
import { ProjetService } from '../../../services/projet.service'; // Service pour les projets
import { CompetenceService } from '../../../services/competence.service'; // Service pour les compétences
import { Projet } from '../../../models/projet'; // Interface Projet
import { Competence } from '../../../models/competence'; // Interface Compétence

@Component({
  selector: 'app-projet-form', // Identifiant HTML du composant
  standalone: true, // Auto-déclaré
  imports: [CommonModule, FormsModule, RouterLink], // Modules requis pour le template
  templateUrl: './projet-form.html', // Lien vers le fichier HTML
})
export class ProjetForm implements OnInit { // Composant de gestion des formulaires (Ajout/Edition)
  // Objet partiel pour stocker les données saisies
  projet: Partial<Projet> = { technologies: '', competences: [] };
  // Catalogue des compétences disponibles pour l'association
  allCompetences: Competence[] = [];
  // Indicateur du mode (création vs modification)
  isEditMode = false;

  // Injection des dépendances
  constructor(
    private projetService: ProjetService,
    private competenceService: CompetenceService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  // Initialisation : chargement des compétences et détection du mode
  ngOnInit(): void {
    // Récupère toutes les compétences pour les afficher dans le formulaire
    this.competenceService.getAll().subscribe(data => this.allCompetences = data);

    // Vérifie si un ID est présent dans l'URL pour passer en mode édition
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true; // Active le flag d'édition
      // Récupère les données existantes du projet
      this.projetService.getById(id).subscribe(data => this.projet = data);
    }
  }

  // Gère la sélection de fichier et sa conversion en Base64 pour l'aperçu
  onFileSelected(event: any): void {
    const file = event.target.files[0]; // Récupère le fichier sélectionné
    if (file) {
      const reader = new FileReader(); // Instance de lecture de fichier
      // Met à jour la propriété image de l'objet projet une fois lu
      reader.onload = (e: any) => this.projet.image = e.target.result;
      reader.readAsDataURL(file); // Lance la lecture en format Data URL
    }
  }

  // Ajoute ou retire une compétence de la liste des compétences liées
  toggleCompetence(id: number): void {
    if (!this.projet.competences) this.projet.competences = []; // Initialise la liste si vide
    const index = this.projet.competences.indexOf(id); // Cherche si l'ID existe déjà
    if (index > -1) this.projet.competences.splice(index, 1); // Retire si présent
    else this.projet.competences.push(id); // Ajoute si absent
  }

  // Vérifie si une compétence donnée est actuellement sélectionnée
  isCompetenceSelected(id: number): boolean {
    return this.projet.competences?.includes(id) || false;
  }

  // Soumet le formulaire vers l'API
  onSubmit(): void {
    if (this.isEditMode) {
      // Envoie une requête PUT pour la mise à jour
      this.projetService.update(this.projet.id!, this.projet as Projet)
        .subscribe(() => this.router.navigate(['/home'])); // Redirection après succès
    } else {
      // Envoie une requête POST pour la création
      this.projetService.create(this.projet as Projet)
        .subscribe(() => this.router.navigate(['/home'])); // Redirection après succès
    }
  }
}
```



---

## 8. Gestion du Parcours (`ParcoursList`)
Composant affichant une timeline interactive des expériences et formations.

**Capture d'écran de l'interface :**
> [!NOTE]
> *Insérer ici la capture d'écran de la timeline du parcours.*

#### 8.1.1. Template HTML (`parcours-list.html`)
```html
<section class="py-20 bg-white font-poppins" id="parcours">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
            <p class="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">Mon parcours</p>
            <h2 class="text-4xl md:text-5xl font-bold text-black mb-4">Expériences & Formations</h2>
            <div class="h-1.5 w-20 bg-black mx-auto rounded-full"></div>
        </div>

        <div class="relative">
            <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200 hidden md:block"></div>
            <div class="space-y-12">
                <div *ngFor="let item of parcours(); let i = index"
                    class="relative flex flex-col md:flex-row items-center" [class.md:flex-row-reverse]="i % 2 !== 0">
                    <div class="w-full md:w-[45%] bg-gray-50 p-6 md:p-8 rounded-[2rem] border border-gray-200 hover:border-black transition-all duration-300 shadow-sm relative group">
                        <div class="flex items-center gap-3 mb-4">
                            <span class="px-4 py-1.5 bg-black text-white text-xs font-bold rounded-full">
                                {{ item.annee_debut }} - {{ item.annee_fin || 'Présent' }}
                            </span>
                        </div>
                        <h3 class="text-xl md:text-2xl font-bold mb-1">{{ item.titre }}</h3>
                        <p class="text-gray-500 font-semibold mb-4">{{ item.entreprise }}</p>
                        <p class="text-gray-600 mb-6">{{ item.description }}</p>
                        <a [routerLink]="['/parcours', item.id]" class="text-xs font-bold text-black hover:underline z-10">Voir détails →</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

#### 8.1.2. Logique TypeScript (`parcours-list.ts`)
```typescript
import { Component, OnInit, signal } from '@angular/core'; // Classes réactives Signals
import { CommonModule } from '@angular/common'; // Directives communes (nfFor)
import { RouterLink } from '@angular/router'; // Navigation entre vues
import { ParcoursService } from '../../../services/parcours.service'; // Service d'accès aux données parcours
import { AuthService } from '../../../services/auth.service'; // Service d'authentification
import { Parcours } from '../../../models/parcours'; // Interface typée Parcours

@Component({
  selector: 'app-parcours-list', // Nom de la balise HTML
  standalone: true, // Auto-suffisant
  imports: [CommonModule, RouterLink], // Dépendances UI
  templateUrl: './parcours-list.html', // Fichier de template HTML
})
export class ParcoursList implements OnInit { // Composant gérant la timeline du parcours
  // Signal réactif contenant l'historique du parcours utilisateur
  parcours = signal<Parcours[]>([]);

  // Injection des services nécessaires via le constructeur
  constructor(private parcoursService: ParcoursService, private authService: AuthService) { }

  // Initialisation : Récupération des données triées chronologiquement
  ngOnInit(): void {
    this.parcoursService.getAll().subscribe(data => {
      // Tri du tableau par année de début décroissante (du plus récent au plus ancien)
      this.parcours.set(data.sort((a, b) => (b.annee_debut || 0) - (a.annee_debut || 0)));
    });
  }

  // Vérifie si l'utilisateur courant est administrateur
  isAdmin(): boolean { return this.authService.isAdmin(); }
}
```

### 8.2. Détail du Parcours (`ParcoursDetail`)
#### 8.2.1. Template HTML (`parcours-detail.html`)
```html
<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-poppins" *ngIf="!isLoading() && item()">
    <div class="max-w-4xl mx-auto bg-white p-10 rounded-[2.5rem] border border-gray-200">
        <h1 class="text-3xl font-black mb-2">{{ item()?.titre }}</h1>
        <p class="text-lg font-bold text-gray-400 mb-6">{{ item()?.entreprise }}</p>
        <p class="text-gray-600 mb-8">{{ item()?.description }}</p>
        <a routerLink="/home" class="text-black font-black hover:underline">← Retour</a>
    </div>
</div>
```

---

## 9. Sécurité et Guards
### 9.1. AuthGuard (`auth.guard.ts`)
```typescript
@Injectable({ providedIn: 'root' }) // Déclare le service comme injectable globalement
export class AuthGuard implements CanActivate { // Garde de navigation pour l'authentification
  // Injection du service d'authentification et du routeur
  constructor(private authService: AuthService, private router: Router) {}
  // Méthode déterminant si l'accès à la route est autorisé
  canActivate(): boolean {
    if (this.authService.isAuthenticated()) return true; // Autorise si l'utilisateur est connecté
    this.router.navigate(['/login']); // Redirige vers la page de connexion sinon
    return false; // Bloque l'accès
  }
}
```

### 9.2. AdminGuard (`admin.guard.ts`)
```typescript
@Injectable({ providedIn: 'root' }) // Injection à la racine
export class AdminGuard implements CanActivate { // Garde restreignant l'accès aux administrateurs
  // Injection des dépendances
  constructor(private authService: AuthService, private router: Router) {}
  // Logique de validation de la route
  canActivate(): boolean {
    if (this.authService.isAdmin()) return true; // Accès autorisé si rôle admin
    this.router.navigate(['/dashboard']); // Redirection vers le dashboard simple sinon
    return false; // Bloque l'accès
  }
}
```
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): boolean {
    if (this.authService.isAuthenticated()) return true;
    this.router.navigate(['/login']);
    return false;
  }
}
```

## 10. Services et Modèles
Cette section détaille la couche de données et les services de communication API.

### 10.1. Modèles de Données (Interfaces TypeScript)
Les interfaces garantissent un typage strict dans toute l'application.

#### 10.1.1. Compétence (`competence.ts`)
```typescript
export interface Competence { // Structure de données pour une Compétence
  id: number; // Identifiant unique
  titre: string; // Nom de la compétence (ex: 'Web Design')
  description: string; // Explication détaillée du savoir-faire
  image?: string; // URL ou Base64 de l'icône illustrative (optionnel)
  niveau: number; // Score de maîtrise de 1 à 10
  categorie?: string; // Famille de compétence (Frontend, Backend, etc.)
  est_visible: boolean; // État d'affichage public
  created_at?: Date; // Date de création en base
  updated_at?: Date; // Date de dernière modification
}
```

#### 10.1.2. Projet (`projet.ts`)
```typescript
export interface Projet { // Modèle pour un projet réalisé
  id?: number; // Identifiant unique optionnel (auto-généré par le backend)
  titre: string; // Nom du projet
  description: string; // Présentation fonctionnelle du projet
  image?: string; // Aperçu visuel (image ou logo)
  technologies: string; // Liste des technos utilisées (ex: 'Angular, RxJS')
  lien_demo?: string; // URL de démonstration en ligne
  lien_github?: string; // URL vers le dépôt de code source
  date_debut: Date; // Date de lancement du projet
  date_fin?: Date; // Date d'achèvement (si terminé)
  est_public: boolean; // Visibilité pour les visiteurs
  competences?: number[]; // Liste des IDs de compétences associées
}
```

#### 10.1.3. Parcours (`parcours.ts`)
```typescript
export interface Parcours { // Modèle pour un jalon du parcours
  id?: number; // Identifiant unique
  titre: string; // Intitulé du poste ou du diplôme
  categorie: 'education' | 'experience'; // Type de jalon
  annee_debut: number; // Année de début
  annee_fin?: number; // Année de fin (facultatif si en cours)
  entreprise: string; // Nom de l'institution ou de l'entreprise
  description: string; // Détails des missions ou cours suivis
  competences: string; // Compétences clés acquises/utilisées
  realisations: string; // Faits marquants ou projets notables
  icone: string; // Identifiant d'icône pour le design
  ordre: number; // Positionnement dans la timeline
  est_visible: boolean; // Statut de publication
}
```

### 10.2. Services de Communication
Les services utilisent `HttpClient` pour interagir avec le backend simulé.

#### 10.2.1. Projet Service (`projet.service.ts`)
```typescript
import { Injectable } from '@angular/core'; // Décorateur Injectable
import { HttpClient } from '@angular/common/http'; // Client HTTP pour les appels API
import { Observable } from 'rxjs'; // Gestion des flux asynchrones
import { Projet } from '../models/projet'; // Interface Projet

@Injectable({ providedIn: 'root' }) // Service disponible dans toute l'application
export class ProjetService { // Service de gestion des données projets
  private apiUrl = 'http://localhost:3000/projets'; // URL du backend (JSON Server)
  
  // Injection du client HttpClient
  constructor(private http: HttpClient) { }

  // Récupère la liste complète des projets
  getAll(): Observable<Projet[]> {
    return this.http.get<Projet[]>(this.apiUrl);
  }

  // Récupère un projet spécifique par son ID
  getById(id: number | string): Observable<Projet> {
    return this.http.get<Projet>(`${this.apiUrl}/${id}`);
  }

  // Envoie un nouveau projet pour création
  create(projet: Projet): Observable<Projet> {
    return this.http.post<Projet>(this.apiUrl, projet);
  }

  // Met à jour un projet existant via son ID
  update(id: number | string, projet: Projet): Observable<Projet> {
    return this.http.put<Projet>(`${this.apiUrl}/${id}`, projet);
  }

  // Supprime un projet de la base de données
  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

---

## 11. Backend (JSON Server)
Pour le développement et la démonstration, un serveur JSON est utilisé pour simuler une API REST complète.

### Configuration (`db.json`)
```json
{
  "users": [
    { "id": 1, "username": "admin", "password": "password", "role": "admin" }
  ],
  "competences": [],
  "projets": [],
  "parcours": []
}
```

---

## 12. Justification des Choix Techniques et Améliorations
Le choix d'**Angular 21** s'inscrit dans une volonté de performance et de modernité :
- **Standalone Components** : Simplifie l'architecture en supprimant les NgModules redondants, facilitant le lazy loading et la testabilité.
- **Angular Signals** : Offre une gestion d'état ultra-réactive et granulaire. Contrairement à Zone.js, les Signals permettent à Angular de savoir exactement quel élément du DOM a besoin d'être mis à jour, améliorant radicalement les performances.
- **Tailwind CSS** : Permet un design "Utility-First" hautement personnalisable. L'utilisation de classes utilitaires garantit que le fichier CSS final reste petit tout en offrant une flexibilité totale sur le design premium.
- **Dark Mode Support** : L'implémentation d'un mode sombre persistant montre l'attention portée à l'expérience utilisateur (UX) et à l'accessibilité.

---

## 13. Conclusion
Ce projet de portfolio démontre la maîtrise des technologies Web modernes. L'intégration de fonctionnalités avancées comme l'authentification sécurisée, la gestion administrative CRUD et une interface utilisateur haut de gamme répond aux standards de l'industrie. L'architecture est propre, documentée et prête pour une mise en production réelle.
