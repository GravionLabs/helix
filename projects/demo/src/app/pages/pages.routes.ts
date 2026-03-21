import { Routes } from '@angular/router';
import { Crud } from './crud/crud';
import { Documentation } from './documentation/documentation';
import { Empty } from './empty/empty';

export default [
  { path: 'documentation', component: Documentation },
  { path: 'crud', component: Crud },
  { path: 'empty', component: Empty },
  { path: '**', redirectTo: '/notfound' },
] as Routes;
