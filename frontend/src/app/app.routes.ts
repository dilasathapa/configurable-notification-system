import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard')
        .then((m) => m.Dashboard),
  },
  {
    path: 'rules',
    loadComponent: () =>
        import('./features/rules/rules').then(m => m.Rules)
    },
    {
    path: 'rules/new',
    loadComponent: () =>
        import('./features/rules/rule-form/rule-form')
        .then(m => m.RuleForm)
    },
  {
    path: 'events',
    loadComponent: () =>
      import('./features/events/events')
        .then((m) => m.Events),
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./features/notifications/notifications')
        .then((m) => m.Notifications),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];