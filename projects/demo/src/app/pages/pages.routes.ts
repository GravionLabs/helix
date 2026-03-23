import { Type } from '@angular/core';
import { Routes } from '@angular/router';
import { GvEmpty } from '@gravion/sakai-ui';
import { Crud } from './crud/crud';
import { Documentation } from './documentation/documentation';
import { PAGES_MENU_ITEMS } from './pages-menu-items';

const COMPONENTS: Record<string, Type<unknown>> = {
  documentation: Documentation,
  crud: Crud,
  empty: GvEmpty,
};

export default [
  ...PAGES_MENU_ITEMS.filter((item) => item.path != null && COMPONENTS[item.path]).map((item) => ({
    path: item.path!,
    component: COMPONENTS[item.path!],
    data: { breadcrumb: item.label },
  })),
  // documentation is also available directly via the main layout route (/documentation)
  { path: 'documentation', component: Documentation },
  { path: '**', redirectTo: '/notfound' },
] as Routes;
