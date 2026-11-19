import type { HelixRouteMenuItem } from '@gravionlabs/helix-shell';

/**
 * Menu metadata for the desktop section.
 * No component imports — safe to include in the main bundle.
 * `desktop.routes.ts` uses this same array to generate Angular routes.
 */
export const DESKTOP_MENU_ITEMS: HelixRouteMenuItem[] = [
  { label: 'Overview', icon: 'pi pi-fw pi-desktop', path: 'overview' },
  { label: 'Components', icon: 'pi pi-fw pi-th-large', path: 'components' },
];
