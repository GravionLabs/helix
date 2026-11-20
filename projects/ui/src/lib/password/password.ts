import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  type ElementRef,
  forwardRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { HxInput, type HxInputSize, type HxInputVariant } from '../input/input';
import { nextId } from '../internal/ids';

/**
 * A password field with a button that shows or hides the text. Works with `ngModel`, reactive forms and
 * signal forms (`[formField]`).
 *
 * ```html
 * <label for="pw">Password</label>
 * <hx-password inputId="pw" [(ngModel)]="password" toggleMask fluid />
 * ```
 */
@Component({
  selector: 'hx-password',
  imports: [HxInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => HxPassword), multi: true },
  ],
  host: {
    class: 'hx-password',
    '[class.hx-password-fluid]': 'fluid()',
    '[class.hx-password-has-toggle]': 'toggleMask()',
    '[class.hx-filled]': "value() !== ''",
  },
  templateUrl: './password.html',
})
export class HxPassword implements ControlValueAccessor, FormValueControl<string> {
  readonly placeholder = input('');
  readonly inputId = input<string>();
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();
  readonly autocomplete = input('current-password');
  readonly size = input<HxInputSize>('medium');
  readonly variant = input<HxInputVariant>('outlined');
  readonly fluid = input(false, { transform: booleanAttribute });
  /** Shows the button that reveals the text. */
  readonly toggleMask = input(false, { transform: booleanAttribute });
  readonly showLabel = input('Show password');
  readonly hideLabel = input('Hide password');

  // The signal-forms contract (FormValueControl): value, disabled, invalid, touch.
  readonly value = model('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  protected readonly defaultId = nextId('hx-password');
  protected readonly visible = signal(false);
  readonly #cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());
  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('field');

  #onChange: (value: string) => void = () => {};
  #onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }
  registerOnChange(fn: (value: string) => void): void {
    this.#onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.#cvaDisabled.set(disabled);
  }

  focus(options?: FocusOptions): void {
    this.field().nativeElement.focus(options);
  }

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.#onChange(value);
  }

  protected onBlur(): void {
    this.#onTouched();
    this.touch.emit();
  }
}
