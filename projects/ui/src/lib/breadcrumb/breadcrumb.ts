import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** One step of the trail. Structurally compatible with the menu items of the shell. */
export interface HxBreadcrumbItem {
  label?: string;
  /** CSS classes of an icon font, e.g. `pi pi-home`. */
  icon?: string;
  /** Router link (string or commands). Wins over `url`. */
  routerLink?: string | readonly unknown[];
  url?: string;
  target?: string;
  disabled?: boolean;
  visible?: boolean;
}

/**
 * The path to the current page. The last item is the current page (`aria-current="page"`).
 *
 * ```html
 * <hx-breadcrumb [model]="items" [home]="{ icon: 'pi pi-home', routerLink: '/' }" />
 * ```
 */
@Component({
  selector: 'hx-breadcrumb',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './breadcrumb.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-breadcrumb' },
})
export class HxBreadcrumb {
  readonly model = input<readonly HxBreadcrumbItem[]>([]);
  readonly home = input<HxBreadcrumbItem>();
  /** Accessible name of the navigation landmark. */
  readonly ariaLabel = input('Breadcrumb');

  protected items(): HxBreadcrumbItem[] {
    return this.model().filter((item) => item.visible !== false);
  }
}
