import { Routes } from '@angular/router';
import { GvAppLayout, GvNotfound, authRoutes } from '@gravion/sakai-ui';
import { Dashboard } from './pages/dashboard/dashboard';
import { Documentation } from './pages/documentation/documentation';
import { Landing } from './pages/landing/landing';

export const appRoutes: Routes = [
  {
    path: '',
    component: GvAppLayout,
    children: [
      { path: '', component: Dashboard },
      { path: 'uikit', loadChildren: () => import('./pages/uikit/uikit.routes') },
      { path: 'documentation', component: Documentation },
      { path: 'pages', loadChildren: () => import('./pages/pages.routes') },
    ],
  },
  { path: 'landing', component: Landing },
  { path: 'notfound', component: GvNotfound },
  { path: 'auth', children: authRoutes },
  { path: '**', redirectTo: '/notfound' },
];
