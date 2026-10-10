import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  HxBreadcrumb,
  type HxBreadcrumbItem,
  HxButton,
  HxIconField,
  HxInput,
  HxInputIcon,
  HxMenu,
  HxMenubar,
  type HxMenuItem,
  HxStep,
  HxStepList,
  HxStepper,
  HxTab,
  HxTabList,
  HxTabPanel,
  HxTabPanels,
  HxTabs,
} from '@gravionlabs/helix-ui';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';
import { DemoSettings } from '../../../shell/demo-settings';
import { HxNavigationSection } from '../sections/navigation/navigation-section';

/** The menu components of `@gravionlabs/helix-ui` (the context, mega and panel menu are not part of it). */
@Component({
  selector: 'app-menu-demo',
  standalone: true,
  imports: [
    SourceTabsComponent,
    HxNavigationSection,

    HxMenubar,
    HxMenu,
    HxBreadcrumb,
    HxButton,
    HxIconField,
    HxInputIcon,
    HxInput,
    HxStepper,
    HxStepList,
    HxStep,
    HxTabs,
    HxTabList,
    HxTab,
    HxTabPanels,
    HxTabPanel,
  ],
  templateUrl: './menu-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './menu-demo.scss',
})
export class MenuDemo {
  protected readonly settings = inject(DemoSettings);

  readonly step = signal<number | string | null>(1);
  readonly tab = signal<string | null>('0');

  nestedMenuItems: HxMenuItem[] = [
    {
      label: 'Customers',
      icon: 'pi pi-fw pi-table',
      items: [
        {
          label: 'New',
          icon: 'pi pi-fw pi-user-plus',
          items: [
            {
              label: 'Customer',
              icon: 'pi pi-fw pi-plus',
            },
            {
              label: 'Duplicate',
              icon: 'pi pi-fw pi-copy',
            },
          ],
        },
        {
          label: 'Edit',
          icon: 'pi pi-fw pi-user-edit',
        },
      ],
    },
    {
      label: 'Orders',
      icon: 'pi pi-fw pi-shopping-cart',
      items: [
        {
          label: 'View',
          icon: 'pi pi-fw pi-list',
        },
        {
          label: 'Search',
          icon: 'pi pi-fw pi-search',
        },
      ],
    },
    {
      label: 'Shipments',
      icon: 'pi pi-fw pi-envelope',
      items: [
        {
          label: 'Tracker',
          icon: 'pi pi-fw pi-compass',
        },
        {
          label: 'Map',
          icon: 'pi pi-fw pi-map-marker',
        },
        {
          label: 'Manage',
          icon: 'pi pi-fw pi-pencil',
        },
      ],
    },
    {
      label: 'Profile',
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'Settings',
          icon: 'pi pi-fw pi-cog',
        },
        {
          label: 'Billing',
          icon: 'pi pi-fw pi-file',
        },
      ],
    },
    {
      label: 'Quit',
      icon: 'pi pi-fw pi-sign-out',
    },
  ];

  breadcrumbHome: HxBreadcrumbItem = { icon: 'pi pi-home', routerLink: '/' };
  breadcrumbItems: HxBreadcrumbItem[] = [
    { label: 'Computer' },
    { label: 'Notebook' },
    { label: 'Accessories' },
    { label: 'Backpacks' },
    { label: 'Item' },
  ];

  /** Nested submenus: the arrow opens the next level. */
  tieredMenuItems: HxMenuItem[] = [
    {
      label: 'Customers',
      icon: 'pi pi-fw pi-table',
      items: [
        {
          label: 'New',
          icon: 'pi pi-fw pi-user-plus',
          items: [
            {
              label: 'Customer',
              icon: 'pi pi-fw pi-plus',
            },
            {
              label: 'Duplicate',
              icon: 'pi pi-fw pi-copy',
            },
          ],
        },
        {
          label: 'Edit',
          icon: 'pi pi-fw pi-user-edit',
        },
      ],
    },
    {
      label: 'Orders',
      icon: 'pi pi-fw pi-shopping-cart',
      items: [
        {
          label: 'View',
          icon: 'pi pi-fw pi-list',
        },
        {
          label: 'Search',
          icon: 'pi pi-fw pi-search',
        },
      ],
    },
    {
      label: 'Shipments',
      icon: 'pi pi-fw pi-envelope',
      items: [
        {
          label: 'Tracker',
          icon: 'pi pi-fw pi-compass',
        },
        {
          label: 'Map',
          icon: 'pi pi-fw pi-map-marker',
        },
        {
          label: 'Manage',
          icon: 'pi pi-fw pi-pencil',
        },
      ],
    },
    {
      label: 'Profile',
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'Settings',
          icon: 'pi pi-fw pi-cog',
        },
        {
          label: 'Billing',
          icon: 'pi pi-fw pi-file',
        },
      ],
    },
    {
      separator: true,
    },
    {
      label: 'Quit',
      icon: 'pi pi-fw pi-sign-out',
    },
  ];

  /** Group headings: an item with children and no action is a heading above them. */
  menuItems: HxMenuItem[] = [
    {
      label: 'Customers',
      items: [
        {
          label: 'New',
          icon: 'pi pi-fw pi-plus',
        },
        {
          label: 'Edit',
          icon: 'pi pi-fw pi-user-edit',
        },
      ],
    },
    {
      label: 'Orders',
      items: [
        {
          label: 'View',
          icon: 'pi pi-fw pi-list',
        },
        {
          label: 'Search',
          icon: 'pi pi-fw pi-search',
        },
      ],
    },
  ];

  overlayMenuItems: HxMenuItem[] = [
    {
      label: 'Save',
      icon: 'pi pi-save',
    },
    {
      label: 'Update',
      icon: 'pi pi-refresh',
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
    },
    {
      separator: true,
    },
    {
      label: 'Home',
      icon: 'pi pi-home',
    },
  ];
}
