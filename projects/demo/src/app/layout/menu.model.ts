import { type HelixRouteMenuItem, helixMenuLinksFrom } from '@gravionlabs/helix';
import { Dashboard } from '../pages/dashboard/dashboard';
import { Documentation } from '../pages/documentation/documentation';
import { PAGES_MENU_ITEMS } from '../pages/pages-menu-items';
import { UIKIT_MENU_ITEMS } from '../pages/uikit/uikit-menu-items';

export const DEMO_MENU_MODEL: HelixRouteMenuItem[] = [
  {
    label: 'Home',
    items: [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        path: '',
        component: Dashboard,
      },
    ],
  },
  {
    label: 'UI Components',
    path: 'uikit',
    loadChildren: () => import('../pages/uikit/uikit.routes'),
    items: helixMenuLinksFrom(UIKIT_MENU_ITEMS, '/uikit'),
  },
  {
    label: 'Pages',
    icon: 'pi pi-fw pi-briefcase',
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
    label: 'Hierarchy',
    items: [
      {
        label: 'Submenu 1',
        icon: 'pi pi-fw pi-bookmark',
        path: 'hierarchy/submenu_1',
        items: [
          {
            label: 'Submenu 1.1',
            icon: 'pi pi-fw pi-bookmark',
            items: [
              { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
            ],
          },
          {
            label: 'Submenu 1.2',
            icon: 'pi pi-fw pi-bookmark',
            items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }],
          },
        ],
      },
      {
        label: 'Submenu 2',
        icon: 'pi pi-fw pi-bookmark',
        path: 'hierarchy/submenu_2',
        items: [
          {
            label: 'Submenu 2.1',
            icon: 'pi pi-fw pi-bookmark',
            items: [
              { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
            ],
          },
          {
            label: 'Submenu 2.2',
            icon: 'pi pi-fw pi-bookmark',
            items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }],
          },
        ],
      },
    ],
  },
  {
    label: 'Get Started',
    items: [
      {
        label: 'Documentation',
        icon: 'pi pi-fw pi-book',
        path: 'documentation',
        component: Documentation,
        routerLink: ['/documentation'],
      },
      {
        label: 'View Source',
        icon: 'pi pi-fw pi-github',
        url: 'https://github.com/primefaces/sakai-ng',
        target: '_blank',
      },
    ],
  },
];
