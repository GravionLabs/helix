import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

export type HxTagSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warn'
  | 'danger'
  | 'contrast';

/**
 * A label for a category or a status. The text is the `value` or the projected content.
 *
 * ```html
 * <hx-tag value="New" severity="success" />
 * <hx-tag severity="warn" rounded icon="pi pi-exclamation-triangle">Pending</hx-tag>
 * ```
 *
 * A tag is plain text and the icon is decorative (`aria-hidden`), so the colour must not be the only carrier of the
 * meaning: the text says it too.
 */
@Component({
  selector: 'hx-tag',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-tag',
    '[class.hx-tag-rounded]': 'rounded()',
    '[class.hx-tag-secondary]': "severity() === 'secondary'",
    '[class.hx-tag-success]': "severity() === 'success'",
    '[class.hx-tag-info]': "severity() === 'info'",
    '[class.hx-tag-warn]': "severity() === 'warn'",
    '[class.hx-tag-danger]': "severity() === 'danger'",
    '[class.hx-tag-contrast]': "severity() === 'contrast'",
  },
  template: `
    @if (icon()) {
      <span class="hx-tag-icon" [class]="icon()" aria-hidden="true"></span>
    }
    <span class="hx-tag-label">{{ value() }}<ng-content /></span>
  `,
})
export class HxTag {
  /** The text; content can be projected instead. */
  readonly value = input<string | number | null>(null);
  readonly severity = input<HxTagSeverity>('primary');
  /** A pill instead of the small radius. */
  readonly rounded = input(false, { transform: booleanAttribute });
  /** CSS classes of an icon font, e.g. `pi pi-check`. */
  readonly icon = input<string>();
}
