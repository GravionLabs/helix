import type { Routes } from '@angular/router';
import {
  authRoutes,
  HelixAppLayout,
  HelixLanding,
  HelixNotfound,
  helixRoutesFrom,
} from '@gravionlabs/helix';
import { DEMO_MENU_MODEL } from './layout/menu.model';

export const appRoutes: Routes = [
  {
    path: '',
    component: HelixAppLayout,
    data: { menu: DEMO_MENU_MODEL, environment: 'development', alertCount: 3 },
    children: helixRoutesFrom(DEMO_MENU_MODEL),
  },
  { path: 'landing', component: HelixLanding },
  { path: 'notfound', component: HelixNotfound },
  { path: 'auth', children: authRoutes },
  { path: '**', redirectTo: '/notfound' },
];
