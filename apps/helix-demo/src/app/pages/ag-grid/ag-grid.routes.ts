import type { Type } from '@angular/core';
import type { Routes } from '@angular/router';
import { AG_GRID_MENU_ITEMS } from './ag-grid-menu-items';
import { CellsDemo } from './cells/cells-demo';
import { Crud } from './crud/crud';
import { TableDemo } from './overview/table-demo';

const COMPONENTS: Record<string, Type<unknown>> = {
  overview: TableDemo,
  cells: CellsDemo,
  crud: Crud,
};

export default [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  ...AG_GRID_MENU_ITEMS.filter((item) => item.path != null && COMPONENTS[item.path]).map(
    (item) => ({
      path: item.path!,
      component: COMPONENTS[item.path!],
      data: { breadcrumb: item.label },
    }),
  ),
  { path: '**', redirectTo: '/notfound' },
] as Routes;
