import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HxMenuItem } from '../menu-item';

/** One step of the trail: the menu item model, of which the breadcrumb uses label, icon, link and state. */
export type HxBreadcrumbItem = HxMenuItem;

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
