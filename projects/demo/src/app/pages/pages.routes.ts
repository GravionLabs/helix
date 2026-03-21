import { Routes } from '@angular/router';
import { GvEmpty } from '@gravion/sakai-ui';
import { Crud } from './crud/crud';
import { Documentation } from './documentation/documentation';

export default [
  { path: 'documentation', component: Documentation },
  { path: 'crud', component: Crud },
  { path: 'empty', component: GvEmpty },
  { path: '**', redirectTo: '/notfound' },
] as Routes;
