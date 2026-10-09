import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  HxTab,
  HxTabContent,
  HxTabList,
  HxTabPanel,
  HxTabPanels,
  HxTabs,
} from '@gravionlabs/helix-ui';

/** `@gravionlabs/helix-ui` navigation: Tabs. */
@Component({
  selector: 'app-hx-navigation-demo',
  standalone: true,
  imports: [HxTabs, HxTabList, HxTab, HxTabPanels, HxTabPanel, HxTabContent],
  templateUrl: './hx-navigation-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hx-navigation-demo.scss',
})
export class HxNavigationDemo {
  readonly tab = signal<string | null>('a');
  readonly numbers = Array.from({ length: 12 }, (_, i) => i + 1);
}
