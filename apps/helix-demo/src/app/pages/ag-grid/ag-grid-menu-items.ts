import type { HelixRouteMenuItem } from '@gravionlabs/helix-shell';

/**
 * Menu metadata for the AG Grid section.
 * No component imports — safe to include in the main bundle.
 * `ag-grid.routes.ts` uses this same array to generate Angular routes.
 */
export const AG_GRID_MENU_ITEMS: HelixRouteMenuItem[] = [
  { label: 'Overview & theme', icon: 'pi pi-fw pi-table', path: 'overview' },
  { label: 'Cells', icon: 'pi pi-fw pi-th-large', path: 'cells' },
  { label: 'CRUD', icon: 'pi pi-fw pi-pencil', path: 'crud' },
];
