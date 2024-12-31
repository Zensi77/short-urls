import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './auth/guards/isAuthenticated.guard';
import { isNotAuthenticatedGuard } from './auth/guards/isNotAuthenticated.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landing/pages/landing-page/landing-page.component').then(
        (m) => m.LandingPageComponent
      ),
    canActivate: [isNotAuthenticatedGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canActivate: [isNotAuthenticatedGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes'),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/pages/not-found-page/not-found-page.component').then(
        (m) => m.NotFoundPageComponent
      ),
  },
];
