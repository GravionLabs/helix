import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  HX_PRIMARY_COLORS,
  HX_SURFACE_NAMES,
  HX_THEME_OPTIONS,
  HxBreadcrumb,
  type HxBreadcrumbItem,
  HxButton,
  HxCheckbox,
  HxDivider,
  HxPassword,
  HxSelect,
  HxSelectButton,
  HxSwitch,
  HxTheme,
  HxTooltip,
} from '@gravionlabs/helix-ui';

/** Divider, Tooltip, Breadcrumb, Password and SelectButton of `@gravionlabs/helix-ui`. */
@Component({
  selector: 'app-blocks-section',
  standalone: true,
  imports: [
    HxBreadcrumb,
    HxButton,
    HxCheckbox,
    HxDivider,
    HxPassword,
    HxSelect,
    HxSelectButton,
    HxSwitch,
    HxTooltip,
    FormsModule,
  ],
  // The theme service of this page only: it takes its overrides away again when the page is left.
  providers: [
    HxTheme,
    {
      provide: HX_THEME_OPTIONS,
      useFactory: () => ({ dark: inject(DOCUMENT).documentElement.classList.contains('app-dark') }),
    },
  ],
  templateUrl: './blocks-section.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './blocks-section.scss',
})
export class HxBlocksSection {
  readonly theme = inject(HxTheme);
  readonly primaryColors = [...HX_PRIMARY_COLORS];
  readonly surfaces = [...HX_SURFACE_NAMES];

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
