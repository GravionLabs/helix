import type { Routes } from '@angular/router';
import { HelixAccess } from './access/access';
import { HelixError } from './error/error';
import { HelixLogin } from './login/login';

export const authRoutes: Routes = [
  { path: 'access', component: HelixAccess },
  { path: 'error', component: HelixError },
  { path: 'login', component: HelixLogin },
];
