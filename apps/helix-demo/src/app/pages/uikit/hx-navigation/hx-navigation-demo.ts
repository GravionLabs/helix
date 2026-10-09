import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  HxButton,
  HxMenu,
  type HxMenuItem,
  HxTab,
  HxTabContent,
  HxTabList,
  HxTabPanel,
  HxTabPanels,
  HxTabs,
} from '@gravionlabs/helix-ui';

/** `@gravionlabs/helix-ui` navigation: Menu, Tabs. */
@Component({
  selector: 'app-hx-navigation-demo',
  standalone: true,
  imports: [HxButton, HxMenu, HxTabs, HxTabList, HxTab, HxTabPanels, HxTabPanel, HxTabContent],
  templateUrl: './hx-navigation-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hx-navigation-demo.scss',
})
export class HxNavigationDemo {
  readonly items: HxMenuItem[] = [
    { label: 'New', icon: 'pi pi-plus', command: () => undefined },
    { label: 'Open', icon: 'pi pi-folder-open' },
    { separator: true },
    {
      label: 'Share',
      icon: 'pi pi-share-alt',
      items: [
        { label: 'Email' },
        { label: 'Link', badge: '2' },
        { label: 'More', items: [{ label: 'Print' }] },
      ],
    },
    { label: 'Disabled', disabled: true },
    { label: 'Docs', icon: 'pi pi-book', url: 'https://angular.dev', target: '_blank' },
  ];
  readonly grouped: HxMenuItem[] = [
    {
      label: 'Profile',
      items: [
        { label: 'Settings', icon: 'pi pi-cog' },
        { label: 'Sign out', icon: 'pi pi-sign-out' },
      ],
    },
    { label: 'Help', items: [{ label: 'Docs', icon: 'pi pi-book' }] },
  ];
  readonly tab = signal<string | null>('a');
  readonly numbers = Array.from({ length: 12 }, (_, i) => i + 1);
}
