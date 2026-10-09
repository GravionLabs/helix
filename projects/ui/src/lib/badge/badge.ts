import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type HxBadgeSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warn'
  | 'danger'
  | 'contrast';
export type HxBadgeSize = 'small' | 'medium' | 'large' | 'xlarge';

/**
 * A small count or status marker. Without a `value` it is a dot.
 *
 * ```html
 * <hx-badge value="4" severity="danger" />
 * <hx-badge severity="success" />
 * ```
 *
 * The value is plain text, so a screen reader reads it where it sits. A dot carries no text: when it is the only
 * sign of a status, put the status in text next to it or in the name of the element it belongs to.
 */
@Component({
  selector: 'hx-badge',
  template: '{{ value() }}',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-badge',
    '[class.hx-badge-dot]': 'isDot()',
    '[class.hx-badge-secondary]': "severity() === 'secondary'",
    '[class.hx-badge-success]': "severity() === 'success'",
    '[class.hx-badge-info]': "severity() === 'info'",
    '[class.hx-badge-warn]': "severity() === 'warn'",
    '[class.hx-badge-danger]': "severity() === 'danger'",
    '[class.hx-badge-contrast]': "severity() === 'contrast'",
    '[class.hx-badge-sm]': "size() === 'small'",
    '[class.hx-badge-lg]': "size() === 'large'",
    '[class.hx-badge-xl]': "size() === 'xlarge'",
  },
})
export class HxBadge {
  /** The text or number shown; empty makes a dot. */
  readonly value = input<string | number | null>(null);
  readonly severity = input<HxBadgeSeverity>('primary');
  readonly size = input<HxBadgeSize>('medium');

  protected isDot(): boolean {
    const value = this.value();
    return value === null || value === undefined || value === '';
  }
}

/**
 * Puts a badge on the top right corner of the wrapped element.
 *
 * ```html
 * <hx-overlay-badge value="2" severity="danger">
 *   <button hx-button iconOnly aria-label="Inbox, 2 new"><span class="pi pi-bell"></span></button>
 * </hx-overlay-badge>
 * ```
 *
 * The badge text is read after the element, but an icon-only element still needs its own accessible name, ideally one
 * that includes the count, as above.
 */
@Component({
  selector: 'hx-overlay-badge',
  imports: [HxBadge],
  template: `<ng-content /><hx-badge class="hx-overlay-badge-badge" [value]="value()" [severity]="severity()" [size]="size()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-overlay-badge' },
})
export class HxOverlayBadge {
  readonly value = input<string | number | null>(null);
  readonly severity = input<HxBadgeSeverity>('primary');
  readonly size = input<HxBadgeSize>('medium');
}
