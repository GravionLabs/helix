import { Routes } from '@angular/router';
import { GvAccess } from './access/access';
import { GvError } from './error/error';
import { GvLogin } from './login/login';

export const authRoutes: Routes = [
  { path: 'access', component: GvAccess },
  { path: 'error', component: GvError },
  { path: 'login', component: GvLogin },
];
