import type { HelixRouteMenuItem } from '@gravionlabs/helix-shell';

/**
 * Menu metadata for the code section.
 * No component imports — safe to include in the main bundle.
 * `code.routes.ts` uses this same array to generate Angular routes.
 */
export const CODE_MENU_ITEMS: HelixRouteMenuItem[] = [
  { label: 'Overview', icon: 'pi pi-fw pi-code', path: 'overview' },
  { label: 'Theme', icon: 'pi pi-fw pi-palette', path: 'theme' },
  { label: 'Editor', icon: 'pi pi-fw pi-pencil', path: 'editor' },
  { label: 'Language', icon: 'pi pi-fw pi-globe', path: 'language' },
  { label: 'Diff', icon: 'pi pi-fw pi-arrows-h', path: 'diff' },
  { label: 'Changed files', icon: 'pi pi-fw pi-list', path: 'changed-files' },
];
