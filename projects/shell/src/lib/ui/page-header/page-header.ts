import { ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';
import { HxBreadcrumb, type HxBreadcrumbItem } from '@gravionlabs/helix-ui';

/**
 * The header of a page: an optional breadcrumb, the title (an `h1` by default) with a subtitle, and the page's
 * actions on the end edge. The actions are projected and wrap under the title on narrow screens.
 *
 * ```html
 * <helix-page-header title="Invoices" subtitle="Open and paid invoices" [breadcrumb]="crumbs">
 *   <button helixPageActions hx-button type="button">New invoice</button>
 * </helix-page-header>
 * ```
 */
@Component({
  selector: 'helix-page-header',
  standalone: true,
  imports: [HxBreadcrumb],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'helix-page-header' },
})
export class HelixPageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  /** The trail above the title; the current page is its last item. */
  readonly breadcrumb = input<readonly HxBreadcrumbItem[]>();
  /** The first item of the breadcrumb (usually a home icon). */
  readonly home = input<HxBreadcrumbItem>();
  /** The heading element of the title (1–6). */
  readonly headingLevel = input(1, { transform: numberAttribute });
}
