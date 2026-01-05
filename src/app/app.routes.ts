import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { CompetenceList } from './components/competences/competence-list/competence-list';
import { CompetenceDetail } from './components/competences/competence-detail/competence-detail';
import { CompetenceForm } from './components/competences/competence-form/competence-form';
import { ProjetList } from './components/projets/projet-list/projet-list';
import { ProjetDetail } from './components/projets/projet-detail/projet-detail';
import { ProjetForm } from './components/projets/projet-form/projet-form';
import { ParcoursDetail } from './components/parcours/parcours-detail/parcours-detail';
import { AuthGuard } from './guards/auth-guard';
import { AdminGuard } from './guards/admin-guard';

import { ParcoursList } from './components/parcours/parcours-list/parcours-list';
import { ParcoursForm } from './components/parcours/parcours-form/parcours-form';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [AuthGuard]
    },
    {
        path: 'competences',
        component: CompetenceList
    },
    {
        path: 'competences/new',
        component: CompetenceForm,
        canActivate: [AuthGuard, AdminGuard]
    },
    {
        path: 'competences/edit/:id',
        component: CompetenceForm,
        canActivate: [AuthGuard, AdminGuard]
    },
    {
        path: 'competences/:id',
        component: CompetenceDetail
    },
    {
        path: 'projets',
        component: ProjetList
    },
    {
        path: 'projets/new',
        component: ProjetForm,
        canActivate: [AuthGuard, AdminGuard]
    },
    {
        path: 'projets/edit/:id',
        component: ProjetForm,
        canActivate: [AuthGuard, AdminGuard]
    },
    {
        path: 'projets/:id',
        component: ProjetDetail
    },
    {
        path: 'parcours',
        component: ParcoursList
    },
    {
        path: 'parcours/new',
        component: ParcoursForm,
        canActivate: [AuthGuard, AdminGuard]
    },
    {
        path: 'parcours/edit/:id',
        component: ParcoursForm,
        canActivate: [AuthGuard, AdminGuard]
    },
    {
        path: 'parcours/:id',
        component: ParcoursDetail
    },
    { path: '**', redirectTo: '' }
];
