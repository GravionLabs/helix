import { GvRouteMenuItem } from '@gravion/sakai-ui';

/**
 * Menu metadata for routes defined in pages.routes.ts.
 * No component imports — safe to include in the main bundle.
 * `pages.routes.ts` uses this same array to generate Angular routes.
 */
export const PAGES_MENU_ITEMS: GvRouteMenuItem[] = [
  { label: 'Crud', icon: 'pi pi-fw pi-pencil', path: 'crud' },
  { label: 'Empty', icon: 'pi pi-fw pi-circle-off', path: 'empty' },
];
