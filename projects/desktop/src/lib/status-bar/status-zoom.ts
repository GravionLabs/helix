import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

/**
 * Zoom out, the level in percent (a click resets to `reset`), zoom in.
 *
 * ```html
 * <hx-status-zoom slot="end" [(value)]="zoom" [min]="50" [max]="200" />
 * ```
 *
 * `value` is a percentage and changes in steps of `step`, kept between `min` and `max`.
 */
@Component({
  selector: 'hx-status-zoom',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-status-zoom' },
  template: `
    <button
      type="button"
      class="hx-status-control hx-status-zoom-out"
      title="Zoom out"
      aria-label="Zoom out"
      [disabled]="value() <= min()"
      (click)="change(-step())"
    >
      &minus;
    </button>
    <button
      type="button"
      class="hx-status-control hx-status-zoom-level"
      title="Reset zoom"
      [attr.aria-label]="'Reset zoom, ' + value() + ' percent'"
      (click)="set(reset())"
    >
      {{ value() }}%
    </button>
    <button
      type="button"
      class="hx-status-control hx-status-zoom-in"
      title="Zoom in"
      aria-label="Zoom in"
      [disabled]="value() >= max()"
      (click)="change(step())"
    >
      +
    </button>
  `,
})
export class HxStatusZoom {
  /** The zoom level in percent. */
  readonly value = model(100);
  readonly min = input(50);
  readonly max = input(200);
  readonly step = input(10);
  /** The level a click on the percentage resets to. */
  readonly reset = input(100);

  protected change(delta: number): void {
    this.set(this.value() + delta);
  }

  protected set(next: number): void {
    const clamped = Math.min(this.max(), Math.max(this.min(), next));
    if (clamped !== this.value()) this.value.set(clamped);
  }
}
