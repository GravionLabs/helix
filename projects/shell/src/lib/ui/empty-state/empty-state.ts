import { ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';

export type HelixEmptyStateSize = 'small' | 'medium';

/**
 * The state of a list, table or page that has nothing to show: an icon, a title, a sentence that says what to do,
 * and projected actions (a button, a link).
 *
 * ```html
 * <helix-empty-state icon="pi pi-inbox" title="No invoices yet" description="Invoices you create appear here.">
 *   <button hx-button type="button">New invoice</button>
 * </helix-empty-state>
 * ```
 *
 * `small` fits inside a table or a card, `medium` (default) is the page-level state.
 */
@Component({
  selector: 'helix-empty-state',
  standalone: true,
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'helix-empty-state', '[class.helix-empty-state--small]': "size() === 'small'" },
})
export class HelixEmptyState {
  readonly title = input.required<string>();
  readonly description = input<string>();
  /** Icon classes (`pi pi-inbox`). */
  readonly icon = input<string>();
  readonly size = input<HelixEmptyStateSize>('medium');
  /** The heading element of the title (2–6). */
  readonly headingLevel = input(3, { transform: numberAttribute });
}
