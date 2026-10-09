import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
} from '@angular/core';

export type HxProgressMode = 'determinate' | 'indeterminate';

/**
 * A bar that fills from 0 to 100, or slides while the duration is unknown.
 *
 * ```html
 * <hx-progress-bar [value]="progress()" ariaLabel="Upload" />
 * <hx-progress-bar mode="indeterminate" ariaLabel="Loading" />
 * ```
 *
 * `role="progressbar"` with `aria-valuemin/max` and, when determinate, `aria-valuenow`; an indeterminate bar leaves
 * `aria-valuenow` out. Name it with `ariaLabel`. The slide stops under `prefers-reduced-motion`.
 */
@Component({
  selector: 'hx-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-progress-bar',
    role: 'progressbar',
    'aria-valuemin': '0',
    'aria-valuemax': '100',
    '[attr.aria-valuenow]': 'indeterminate() ? null : clamped()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[class.hx-progress-bar-indeterminate]': 'indeterminate()',
  },
  template: `
    <div class="hx-progress-bar-value" [style.width.%]="indeterminate() ? null : clamped()">
      @if (showValue() && !indeterminate()) {
        <span class="hx-progress-bar-label">{{ clamped() }}{{ unit() }}</span>
      }
    </div>
  `,
})
export class HxProgressBar {
  /** 0 to 100; values outside are clamped. */
  readonly value = input(0, { transform: numberAttribute });
  readonly mode = input<HxProgressMode>('determinate');
  /** Shows the value and `unit` inside the bar. */
  readonly showValue = input(true, { transform: booleanAttribute });
  readonly unit = input('%');
  /** Accessible name. */
  readonly ariaLabel = input<string>();

  protected readonly indeterminate = computed(() => this.mode() === 'indeterminate');
  protected readonly clamped = computed(() => {
    const value = this.value();
    return Math.min(100, Math.max(0, Number.isFinite(value) ? Math.round(value) : 0));
  });
}

/**
 * A spinning circle for an operation of unknown duration.
 *
 * ```html
 * <hx-progress-spinner ariaLabel="Saving" />
 * ```
 *
 * `role="progressbar"` without `aria-valuenow` (indeterminate), named by `ariaLabel` ("Loading" by default). The
 * rotation stops under `prefers-reduced-motion`.
 */
@Component({
  selector: 'hx-progress-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-progress-spinner',
    role: 'progressbar',
    '[attr.aria-label]': 'ariaLabel()',
  },
  template: `
    <svg class="hx-progress-spinner-svg" viewBox="25 25 50 50" aria-hidden="true" [style.animation-duration]="animationDuration()">
      <circle class="hx-progress-spinner-circle" cx="50" cy="50" r="20" fill="none" [attr.stroke-width]="strokeWidth()" stroke-miterlimit="10" [style.animation-duration]="animationDuration()" />
    </svg>
  `,
})
export class HxProgressSpinner {
  /** Width of the ring in the 50-unit drawing. */
  readonly strokeWidth = input('2');
  /** CSS time of one cycle of the colours. */
  readonly animationDuration = input('2s');
  readonly ariaLabel = input('Loading');
}
