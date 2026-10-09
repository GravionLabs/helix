import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { nextId } from '../internal/ids';

/**
 * A star rating: pick 1 to `stars`. It is the radio group pattern: each star is a visually hidden
 * `input type="radio"` labelled "n stars", so the arrow keys change the value. With `readonly` it is a plain image
 * with the label "n of 5 stars".
 *
 * ```html
 * <hx-rating ariaLabel="Quality" [(ngModel)]="score" />
 * <hx-rating readonly [stars]="10" [value]="7" />
 * ```
 *
 * It works with `ngModel`, reactive forms and signal forms (`[formField]`). The value is `null` until a star is
 * chosen.
 */
@Component({
  selector: 'hx-rating',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => HxRating), multi: true }],
  host: {
    class: 'hx-rating',
    '[attr.role]': "readonly() ? 'img' : 'radiogroup'",
    '[attr.aria-label]': 'groupLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledby()',
    '[attr.aria-invalid]': "invalid() ? 'true' : null",
    '[class.hx-rating-readonly]': 'readonly()',
    '[class.hx-rating-disabled]': 'isDisabled()',
    '[class.hx-rating-invalid]': 'invalid()',
    '(focusout)': 'onFocusOut($event)',
  },
  template: `
    @for (n of items(); track n) {
      @if (readonly()) {
        <span class="hx-rating-star" [class.hx-rating-star-active]="n <= current()"><span class="hx-rating-icon"></span></span>
      } @else {
        <label class="hx-rating-star" [class.hx-rating-star-active]="n <= current()">
          <input
            type="radio"
            class="hx-rating-input"
            [name]="groupName"
            [value]="n"
            [checked]="n === value()"
            [disabled]="isDisabled()"
            [attr.aria-label]="n === 1 ? '1 star' : n + ' stars'"
            (change)="select(n)"
          />
          <span class="hx-rating-icon"></span>
        </label>
      }
    }
  `,
})
export class HxRating implements ControlValueAccessor, FormValueControl<number | null> {
  /** The number of stars. */
  readonly stars = input(5, { transform: numberAttribute });
  /** Shows the value without a way to change it. */
  readonly readonly = input(false, { transform: booleanAttribute });
  /** The name of the group (not used when read only). */
  readonly ariaLabel = input('Rating');
  readonly ariaLabelledby = input<string>();

  // The signal-forms contract (FormValueControl): value, disabled, invalid, touch.
  readonly value = model<number | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  protected readonly groupName = nextId('hx-rating');
  readonly #cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());
  protected readonly items = computed(() =>
    Array.from({ length: Math.max(0, Math.floor(this.stars())) }, (_, i) => i + 1),
  );
  protected readonly current = computed(() => this.value() ?? 0);
  protected readonly groupLabel = computed(() =>
    this.readonly() ? `${this.current()} of ${this.stars()} stars` : this.ariaLabel(),
  );

  #onChange: (value: number | null) => void = () => {};
  #onTouched: () => void = () => {};

  writeValue(value: number | null): void {
    this.value.set(value ?? null);
  }
  registerOnChange(fn: (value: number | null) => void): void {
    this.#onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.#cvaDisabled.set(disabled);
  }

  protected select(n: number): void {
    this.value.set(n);
    this.#onChange(n);
  }

  protected onFocusOut(event: FocusEvent): void {
    const host = event.currentTarget as HTMLElement;
    if (host.contains(event.relatedTarget as Node | null)) return;
    this.#onTouched();
    this.touch.emit();
  }
}
