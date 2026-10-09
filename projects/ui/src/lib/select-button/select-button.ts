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
import { type Accessor, type HxOption, resolveOptions } from '../internal/options';

export type HxSelectButtonSize = 'small' | 'medium' | 'large';

/**
 * A choice among a few options shown as a joined group of toggle buttons. Single choice by default,
 * `multiple` for a list of values. The buttons are native buttons with `aria-pressed`.
 *
 * ```html
 * <hx-select-button [options]="['Left', 'Center', 'Right']" [(ngModel)]="align" [allowEmpty]="false" />
 * ```
 */
@Component({
  selector: 'hx-select-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => HxSelectButton), multi: true },
  ],
  host: {
    class: 'hx-select-button',
    role: 'group',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledby()',
    '[class.hx-select-button-sm]': "size() === 'small'",
    '[class.hx-select-button-lg]': "size() === 'large'",
    '[class.hx-select-button-fluid]': 'fluid()',
    '[class.hx-select-button-invalid]': 'invalid()',
    '[class.hx-select-button-disabled]': 'isDisabled()',
  },
  template: `
    @for (item of items(); track $index) {
      <button
        type="button"
        class="hx-select-button-option"
        [class.hx-select-button-option-checked]="isChecked(item)"
        [attr.aria-pressed]="isChecked(item)"
        [disabled]="isDisabled() || item.disabled"
        (click)="toggle(item)"
        (blur)="onBlur()"
      >
        <span class="hx-select-button-content">{{ item.label }}</span>
      </button>
    }
  `,
})
export class HxSelectButton implements ControlValueAccessor, FormValueControl<unknown> {
  readonly options = input<readonly unknown[]>([]);
  readonly optionLabel = input<Accessor<never, string>>('label');
  readonly optionValue = input<Accessor<never, unknown>>('value');
  readonly optionDisabled = input<Accessor<never, boolean>>('disabled');
  /** Several options can be chosen; the value is then an array. */
  readonly multiple = input(false, { transform: booleanAttribute });
  /** Whether the chosen option can be switched off again (single choice). */
  readonly allowEmpty = input(true, { transform: booleanAttribute });
  readonly size = input<HxSelectButtonSize>('medium');
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();

  // The signal-forms contract (FormValueControl): value, disabled, invalid, touch.
  readonly value = model<unknown>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  readonly #cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());

  protected readonly items = computed<HxOption[]>(() =>
    resolveOptions(this.options(), this.optionLabel(), this.optionValue(), this.optionDisabled()),
  );

  #onChange: (value: unknown) => void = () => {};
  #onTouched: () => void = () => {};

  writeValue(value: unknown): void {
    this.value.set(value ?? (this.multiple() ? [] : null));
  }
  registerOnChange(fn: (value: unknown) => void): void {
    this.#onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.#cvaDisabled.set(disabled);
  }

  protected isChecked(item: HxOption): boolean {
    const current = this.value();
    return this.multiple()
      ? Array.isArray(current) && current.some((v) => Object.is(v, item.value))
      : Object.is(current, item.value);
  }

  protected toggle(item: HxOption): void {
    const checked = this.isChecked(item);
    let next: unknown;
    if (this.multiple()) {
      const current = Array.isArray(this.value()) ? (this.value() as unknown[]) : [];
      next = checked ? current.filter((v) => !Object.is(v, item.value)) : [...current, item.value];
    } else if (checked) {
      if (!this.allowEmpty()) return;
      next = null;
    } else {
      next = item.value;
    }
    this.value.set(next);
    this.#onChange(next);
  }

  protected onBlur(): void {
    this.#onTouched();
    this.touch.emit();
  }
}
