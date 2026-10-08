import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  HxBreadcrumb,
  type HxBreadcrumbItem,
  HxButton,
  HxDivider,
  HxPassword,
  HxSelectButton,
  HxTooltip,
} from '@gravionlabs/helix-ui';

/** Divider, Tooltip, Breadcrumb, Password and SelectButton of `@gravionlabs/helix-ui`. */
@Component({
  selector: 'app-hx-blocks-demo',
  standalone: true,
  imports: [HxBreadcrumb, HxButton, HxDivider, HxPassword, HxSelectButton, HxTooltip, FormsModule],
  templateUrl: './hx-blocks-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hx-blocks-demo.scss',
})
export class HxBlocksDemo {
  readonly home: HxBreadcrumbItem = { icon: 'pi pi-home', routerLink: '/' };
  readonly trail: HxBreadcrumbItem[] = [
    { label: 'UI Kit', routerLink: '/uikit' },
    { label: 'Helix UI', routerLink: '/uikit/hx-blocks' },
    { label: 'Breadcrumb' },
  ];

  readonly positions = ['top', 'right', 'bottom', 'left'] as const;
  readonly align = signal<string | null>('center');
  readonly alignOptions = ['left', 'center', 'right'];
  readonly toppings = signal<string[]>(['cheese']);
  readonly toppingOptions = ['cheese', 'ham', 'olives', 'basil'];
  password = '';
}
