import type { HelixRouteMenuItem } from '@gravionlabs/helix';

/**
 * Menu metadata for the uikit section.
 * No component imports — safe to include in the main bundle.
 * `uikit.routes.ts` uses this same array to generate Angular routes.
 */
export const UIKIT_MENU_ITEMS: HelixRouteMenuItem[] = [
  { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', path: 'formlayout' },
  { label: 'Dynamic Form', icon: 'pi pi-fw pi-sliders-h', path: 'dynamicform' },
  { label: 'Input', icon: 'pi pi-fw pi-check-square', path: 'input' },
  { label: 'Button', icon: 'pi pi-fw pi-mobile', path: 'button', styleClass: 'rotated-icon' },
  { label: 'Table', icon: 'pi pi-fw pi-table', path: 'table' },
  { label: 'List', icon: 'pi pi-fw pi-list', path: 'list' },
  { label: 'Tree', icon: 'pi pi-fw pi-share-alt', path: 'tree' },
  { label: 'Panel', icon: 'pi pi-fw pi-tablet', path: 'panel' },
  { label: 'Overlay', icon: 'pi pi-fw pi-clone', path: 'overlay' },
  { label: 'Media', icon: 'pi pi-fw pi-image', path: 'media' },
  { label: 'Menu', icon: 'pi pi-fw pi-bars', path: 'menu' },
  { label: 'Message', icon: 'pi pi-fw pi-comment', path: 'message' },
  { label: 'File', icon: 'pi pi-fw pi-file', path: 'file' },
  { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', path: 'charts' },
  { label: 'Timeline', icon: 'pi pi-fw pi-calendar', path: 'timeline' },
  { label: 'Misc', icon: 'pi pi-fw pi-circle', path: 'misc' },
  { label: 'Topbar', icon: 'pi pi-fw pi-bars', path: 'topbar' },
];
