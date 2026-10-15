import type { HelixRouteMenuItem } from '@gravionlabs/helix-shell';

/**
 * Menu metadata for the charts section.
 * No component imports — safe to include in the main bundle.
 * `charts.routes.ts` uses this same array to generate Angular routes.
 */
export const CHARTS_MENU_ITEMS: HelixRouteMenuItem[] = [
  { label: 'Overview', icon: 'pi pi-fw pi-chart-bar', path: 'overview' },
];
