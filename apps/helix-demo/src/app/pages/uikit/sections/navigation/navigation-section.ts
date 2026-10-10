import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  HxButton,
  HxMenu,
  HxMenubar,
  type HxMenuItem,
  HxPaginator,
  HxSplitButton,
  HxStep,
  HxStepContent,
  HxStepList,
  HxStepPanel,
  HxStepPanels,
  HxStepper,
  HxTab,
  HxTabContent,
  HxTabList,
  HxTabPanel,
  HxTabPanels,
  HxTabs,
} from '@gravionlabs/helix-ui';

/** `@gravionlabs/helix-ui` navigation: Menu, Menubar, Paginator, Split button, Stepper, Tabs. */
@Component({
  selector: 'app-navigation-section',
  standalone: true,
  imports: [
    HxButton,
    HxMenu,
    HxMenubar,
    HxPaginator,
    HxSplitButton,
    HxStepper,
    HxStepList,
    HxStep,
    HxStepPanels,
    HxStepPanel,
    HxStepContent,
    HxTabs,
    HxTabList,
    HxTab,
    HxTabPanels,
    HxTabPanel,
    HxTabContent,
  ],
  templateUrl: './navigation-section.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './navigation-section.scss',
})
export class HxNavigationSection {
  readonly first = signal(0);
  readonly rows = signal(10);
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
  readonly bar: HxMenuItem[] = [
    { label: 'Home', icon: 'pi pi-home', command: () => undefined },
    {
      label: 'Products',
      icon: 'pi pi-box',
      items: [
        { label: 'Components' },
        { label: 'Templates', badge: 'New' },
        { separator: true },
        { label: 'Pricing', items: [{ label: 'Free' }, { label: 'Team' }] },
      ],
    },
    { label: 'Docs', icon: 'pi pi-book', url: 'https://angular.dev', target: '_blank' },
    { label: 'Soon', disabled: true },
  ];
  readonly saved = signal('');
  readonly saveItems: HxMenuItem[] = [
    { label: 'Save as draft', command: () => this.saved.set('draft') },
    { label: 'Save and close', command: () => this.saved.set('closed') },
    { separator: true },
    { label: 'Discard', disabled: true },
  ];
  readonly step = signal<number | string | null>(1);
  readonly tab = signal<string | null>('a');
  readonly numbers = Array.from({ length: 12 }, (_, i) => i + 1);
}
