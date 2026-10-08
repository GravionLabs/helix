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

let nextId = 0;

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
  },
  template: `
    <input
      #field
      hx-input
      [id]="inputId() ?? defaultId"
      [type]="visible() ? 'text' : 'password'"
      [value]="value()"
      [placeholder]="placeholder()"
      [attr.autocomplete]="autocomplete()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-labelledby]="ariaLabelledby()"
      [attr.aria-invalid]="invalid() ? 'true' : null"
      [disabled]="isDisabled()"
      [variant]="variant()"
      [size]="size()"
      [fluid]="true"
      (input)="onInput($event)"
      (blur)="onBlur()"
    />
    @if (toggleMask()) {
      <button
        type="button"
        class="hx-password-toggle"
        [disabled]="isDisabled()"
        [attr.aria-label]="visible() ? hideLabel() : showLabel()"
        [attr.aria-pressed]="visible()"
        (click)="visible.set(!visible())"
      >
        <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          @if (visible()) {
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <path d="m1 1 22 22" />
          } @else {
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          }
        </svg>
      </button>
    }
  `,
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

  protected readonly defaultId = `hx-password-${nextId++}`;
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
