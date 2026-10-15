import type { Type } from '@angular/core';
import type { Routes } from '@angular/router';
import { HelixEmpty } from '@gravionlabs/helix-shell';
import { Documentation } from './documentation/documentation';
import { PAGES_MENU_ITEMS } from './pages-menu-items';

const COMPONENTS: Record<string, Type<unknown>> = {
  documentation: Documentation,
  empty: HelixEmpty,
};

export default [
  { path: '', redirectTo: 'empty', pathMatch: 'full' },
  { path: 'crud', redirectTo: '/ag-grid/crud', pathMatch: 'full' },
  ...PAGES_MENU_ITEMS.filter((item) => item.path != null && COMPONENTS[item.path]).map((item) => ({
    path: item.path!,
    component: COMPONENTS[item.path!],
    data: { breadcrumb: item.label },
  })),
  // documentation is also available directly via the main layout route (/documentation)
  { path: 'documentation', component: Documentation },
  { path: '**', redirectTo: '/notfound' },
] as Routes;
