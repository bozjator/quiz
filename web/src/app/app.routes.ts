import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/sections/login/login.component';
import { DashboardComponent } from './sections/dashboard/dashboard.component';
import { NavigationGroup } from './layout/sidebar/models/navigation.model';
import { PreferencesComponent } from './sections/settings/preferences/preferences.component';

export const routes: Routes = [
  // APP PAGES (pages after login)
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'quiz/:id',
        loadComponent: () => import('./sections/quiz/quiz.component').then((m) => m.QuizComponent),
      },
      {
        path: 'quiz/:id/edit',
        loadComponent: () => import('./sections/quiz/quiz.component').then((m) => m.QuizComponent),
      },
      {
        path: 'settings',
        children: [
          {
            path: 'preferences',
            component: PreferencesComponent,
          },
        ],
      },
    ],
  },
  // SINGLE PAGES
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'logout',
    loadComponent: () =>
      import('./auth/sections/logout/logout.component').then((m) => m.LogoutComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/sections/registration/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent,
      ),
  },
];

export const mainNavigation: NavigationGroup[] = [
  {
    title: '',
    path: '',
    items: [
      {
        name: 'Dashboard',
        icon: 'home',
        uri: 'dashboard',
      },
    ],
  },
  {
    title: 'SETTINGS',
    path: '/settings/',
    items: [
      {
        name: 'Preferences',
        icon: 'manage_accounts',
        uri: 'preferences',
      },
    ],
  },
];
