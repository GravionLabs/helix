import type { Routes } from '@angular/router';
import { authRoutes, HelixLanding, HelixNotfound, helixRoutesFrom } from '@gravionlabs/helix';
import { AppShell } from './shell/app-shell';
import { DEMO_MENU_MODEL } from './shell/menu.model';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppShell,
    children: helixRoutesFrom(DEMO_MENU_MODEL),
  },
  { path: 'landing', component: HelixLanding },
  { path: 'notfound', component: HelixNotfound },
  { path: 'auth', children: authRoutes },
  { path: '**', redirectTo: '/notfound' },
];
