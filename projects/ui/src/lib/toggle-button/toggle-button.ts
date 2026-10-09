import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';

export type HxToggleButtonSize = 'small' | 'medium' | 'large';

/**
 * A two-state button with its own labels for on and off. It is a native `<button>` with `aria-pressed`, and
 * works with `ngModel`, reactive forms and signal forms (`[formField]`) like `hx-select`.
 *
 * ```html
 * <hx-toggle-button onLabel="Subscribed" offLabel="Subscribe" onIcon="pi pi-check" [(ngModel)]="subscribed" />
 * <hx-toggle-button ariaLabel="Bold" onIcon="pi pi-bold" offIcon="pi pi-bold" onLabel="" offLabel="" [(value)]="bold" />
 * ```
 *
 * With only icons, give `ariaLabel`. An `ariaLabel` is also the stable name when the labels change with the
 * state: `aria-pressed` already tells the state.
 */
@Component({
  selector: 'hx-toggle-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => HxToggleButton), multi: true },
  ],
  host: {
    class: 'hx-toggle-button',
    '[class.hx-toggle-button-sm]': "size() === 'small'",
    '[class.hx-toggle-button-lg]': "size() === 'large'",
    '[class.hx-toggle-button-fluid]': 'fluid()',
    '[class.hx-toggle-button-checked]': 'value()',
    '[class.hx-toggle-button-invalid]': 'invalid()',
    '[class.hx-toggle-button-disabled]': 'isDisabled()',
  },
  template: `
    <button
      type="button"
      class="hx-toggle-button-control"
      [id]="inputId()"
      [attr.aria-pressed]="value()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-labelledby]="ariaLabelledby()"
      [disabled]="isDisabled()"
      (click)="toggle()"
      (blur)="onBlur()"
    >
      <span class="hx-toggle-button-content">
        @if (icon(); as icon) {
          <i class="hx-toggle-button-icon" [class]="icon" aria-hidden="true"></i>
        }
        @if (label(); as label) {
          <span class="hx-toggle-button-label">{{ label }}</span>
        }
      </span>
    </button>
  `,
})
export class HxToggleButton implements ControlValueAccessor, FormValueControl<boolean> {
  readonly onLabel = input('Yes');
  readonly offLabel = input('No');
  /** Icon classes (for example `pi pi-check`) shown while on or off. */
  readonly onIcon = input('');
  readonly offIcon = input('');
  readonly size = input<HxToggleButtonSize>('medium');
  readonly fluid = input(false, { transform: booleanAttribute });
  /** The `id` of the button, for a `<label for>`. */
  readonly inputId = input<string>();
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();

  // The signal-forms contract (FormValueControl): value, disabled, invalid, touch.
  readonly value = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  readonly #cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());
  protected readonly label = computed(() => (this.value() ? this.onLabel() : this.offLabel()));
  protected readonly icon = computed(() => (this.value() ? this.onIcon() : this.offIcon()));

  #onChange: (value: boolean) => void = () => {};
  #onTouched: () => void = () => {};

  writeValue(value: boolean | null): void {
    this.value.set(!!value);
  }
  registerOnChange(fn: (value: boolean) => void): void {
    this.#onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.#cvaDisabled.set(disabled);
  }

  protected toggle(): void {
    const next = !this.value();
    this.value.set(next);
    this.#onChange(next);
  }

  protected onBlur(): void {
    this.#onTouched();
    this.touch.emit();
  }
}
