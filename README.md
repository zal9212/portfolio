# Modern Portfolio App - Angular 21 & Signals

> [!IMPORTANT]
> **Instructions pour l'Évaluateur**
> - **Dossier de Rendu** : `dar326_DIALLO_MamadouSaliou_SANE_Gnima_angular`
> - **Documentation** : Un rapport technique détaillé de 15 pages est disponible à la racine : [Documentation_Technique_Angular.md](./Documentation_Technique_Angular.md).
> - **Vidéo de Démonstration** : (Lien/Fichier à ajouter par les étudiants dans le dossier final).
> - **Identifiants Admin** : Username: `admin` | Password: `password`.

---

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Signals](https://img.shields.io/badge/Angular-Signals-blue?style=for-the-badge)](https://angular.dev/guide/signals)

Un portfolio de nouvelle génération conçu avec les dernières fonctionnalités d'**Angular 21**, privilégiant la performance, la réactivité avec les **Signals**, et un design premium via **Tailwind CSS**.

##  Fonctionnalités Clés

- **Home Dynamique** : Présentation interactive avec scroll fluide et intégration de CV.
- **Authentification & Rôles** : Système de login complet avec redirection intelligente et protection des routes (`AuthGuard`, `AdminGuard`).
- **Dashboard Stats** : Vue d'ensemble réactive des compétences et projets utilisant les Signals.
- **Administration CRUD** : Interface complète pour ajouter, modifier ou supprimer des Compétences, Projets et Parcours.
- **Design Premium & Dark Mode** : Esthétique moderne avec support natif du mode sombre et transitions fluides.
- **Backend Mock** : Serveur JSON simulé pour une expérience Full-Stack immédiate.

## Stack Technique

- **Framework** : Angular 21 (Standalone Components)
- **State Management** : Angular Signals & RxJS
- **Styling** : Tailwind CSS (Utility-first)
- **Backend (Mock)** : JSON Server
- **Tests** : Vitest & HttpClientTestingModule

## Installation & Lancement

### 1. Cloner le projet
```bash
git clone https://github.com/votre-repo/portfolio-app.git
cd portfolio-app
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Lancer le Backend (JSON Server)
Dans un premier terminal :
```bash
npx json-server --watch db.json --port 3000
```

### 4. Lancer l'application
Dans un second terminal :
```bash
ng serve
```
L'application est maintenant accessible sur `http://localhost:4200/`.

##  Architecture du Projet

```text
src/app/
├── components/      # Composants Standalone (Home, Login, Dashboard...)
├── services/        # Services Injectables (Auth, API CRUD)
├── guards/          # Protection des routes (Admin, Auth)
├── models/          # Interfaces TypeScript
├── app.routes.ts    # Routage Angular 21
└── db.json          # Données mockées du serveur
```

## Tests

Exécutez les tests unitaires avec Vitest :
```bash
ng test
```

---
*Développé avec pour un rendu professionnel et performant.* 
