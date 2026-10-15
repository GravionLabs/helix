import type { HelixRouteMenuItem } from '@gravionlabs/helix-shell';

/**
 * Menu metadata for the charts section.
 * No component imports — safe to include in the main bundle.
 * `charts.routes.ts` uses this same array to generate Angular routes.
 */
export const CHARTS_MENU_ITEMS: HelixRouteMenuItem[] = [
  { label: 'Line', icon: 'pi pi-fw pi-chart-line', path: 'line' },
  { label: 'Bar', icon: 'pi pi-fw pi-chart-bar', path: 'bar' },
  { label: 'Pie & Doughnut', icon: 'pi pi-fw pi-chart-pie', path: 'pie' },
  { label: 'Polar Area', icon: 'pi pi-fw pi-compass', path: 'polar-area' },
  { label: 'Radar', icon: 'pi pi-fw pi-chart-scatter', path: 'radar' },
];
