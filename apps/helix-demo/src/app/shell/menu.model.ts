import { type HelixRouteMenuItem, helixMenuLinksFrom } from '@gravionlabs/helix-shell';
import { Dashboard } from '../pages/dashboard/dashboard';
import { Documentation } from '../pages/documentation/documentation';
import { PAGES_MENU_ITEMS } from '../pages/pages-menu-items';
import { UIKIT_MENU_ITEMS } from '../pages/uikit/uikit-menu-items';

export const DEMO_MENU_MODEL: HelixRouteMenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'pi pi-fw pi-home',
    path: '',
    component: Dashboard,
    breadcrumb: 'Dashboard',
    routerLink: ['/'],
  },
  {
    label: 'Components',
    icon: 'pi pi-fw pi-th-large',
    breadcrumb: 'Components',
    path: 'uikit',
    loadChildren: () => import('../pages/uikit/uikit.routes'),
    items: helixMenuLinksFrom(UIKIT_MENU_ITEMS, '/uikit'),
  },
  {
    label: 'Pages',
    icon: 'pi pi-fw pi-briefcase',
    breadcrumb: 'Pages',
    path: 'pages',
    loadChildren: () => import('../pages/pages.routes'),
    items: [
      { label: 'Landing', icon: 'pi pi-fw pi-globe', routerLink: ['/landing'] },
      {
        label: 'Auth',
        icon: 'pi pi-fw pi-user',
        items: [
          { label: 'Login', icon: 'pi pi-fw pi-sign-in', routerLink: ['/auth/login'] },
          { label: 'Error', icon: 'pi pi-fw pi-times-circle', routerLink: ['/auth/error'] },
          { label: 'Access Denied', icon: 'pi pi-fw pi-lock', routerLink: ['/auth/access'] },
        ],
      },
      ...helixMenuLinksFrom(PAGES_MENU_ITEMS, '/pages'),
      {
        label: 'Not Found',
        icon: 'pi pi-fw pi-exclamation-circle',
        routerLink: ['/notfound'],
      },
    ],
  },
  {
    label: 'Resources',
    icon: 'pi pi-fw pi-compass',
    items: [
      {
        label: 'Documentation',
        icon: 'pi pi-fw pi-book',
        breadcrumb: 'Documentation',
        path: 'documentation',
        component: Documentation,
        routerLink: ['/documentation'],
      },
      {
        label: 'GitHub',
        icon: 'pi pi-fw pi-github',
        url: 'https://github.com/GravionLabs/helix',
        target: '_blank',
      },
    ],
  },
];
