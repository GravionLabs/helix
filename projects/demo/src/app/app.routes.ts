import { Routes } from '@angular/router';
import { GvAppLayout, GvLanding, GvNotfound, authRoutes, gvRoutesFrom } from '@gravion/sakai-ui';
import { DEMO_MENU_MODEL } from './layout/menu.model';

export const appRoutes: Routes = [
  {
    path: '',
    component: GvAppLayout,
    data: { menu: DEMO_MENU_MODEL },
    children: gvRoutesFrom(DEMO_MENU_MODEL),
  },
  { path: 'landing', component: GvLanding },
  { path: 'notfound', component: GvNotfound },
  { path: 'auth', children: authRoutes },
  { path: '**', redirectTo: '/notfound' },
];
