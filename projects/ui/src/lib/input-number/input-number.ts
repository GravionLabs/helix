import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
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

export type HxInputNumberMode = 'decimal' | 'currency';
export type HxInputNumberButtonLayout = 'stacked' | 'horizontal';
export type HxInputNumberSize = HxInputSize;
export type HxInputNumberVariant = HxInputVariant;

/** Delay before a held step button starts to repeat, and the pause between repeats (ms). */
const REPEAT_DELAY = 400;
const REPEAT_INTERVAL = 60;

/**
 * A numeric field with locale formatting and optional step buttons. The value is a `number | null`; the text
 * is formatted with `Intl.NumberFormat` when the field loses focus and parsed in the same locale while the
 * user types. Works with `ngModel`, reactive forms and signal forms (`[formField]`).
 *
 * ```html
 * <label for="qty">Quantity</label>
 * <hx-input-number inputId="qty" [(ngModel)]="qty" [min]="0" [max]="99" showButtons />
 * <hx-input-number ariaLabel="Price" mode="currency" currency="EUR" locale="de-DE" [formField]="form.price" />
 * ```
 *
 * Fractions are rounded to `maxFractionDigits` (3 for decimals, 2 for most currencies), so set it to match
 * `step` when the step is finer than that. Give the field a visible `<label for>` (with `inputId`) or an
 * `ariaLabel`.
 */
@Component({
  selector: 'hx-input-number',
  imports: [HxInput],
  templateUrl: './input-number.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => HxInputNumber), multi: true },
  ],
  host: {
    class: 'hx-input-number',
    '[class.hx-input-number-fluid]': 'fluid()',
    '[class.hx-input-number-stacked]': "showButtons() && buttonLayout() === 'stacked'",
    '[class.hx-input-number-horizontal]': "showButtons() && buttonLayout() === 'horizontal'",
    '[class.hx-input-number-disabled]': 'isDisabled()',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class HxInputNumber implements ControlValueAccessor, FormValueControl<number | null> {
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #destroyRef = inject(DestroyRef);

  readonly min = input<number>();
  readonly max = input<number>();
  readonly step = input(1);
  readonly minFractionDigits = input<number>();
  readonly maxFractionDigits = input<number>();
  /** A BCP 47 tag; the browser's locale when not set. */
  readonly locale = input<string>();
  readonly useGrouping = input(true, { transform: booleanAttribute });
  readonly mode = input<HxInputNumberMode>('decimal');
  /** ISO 4217 code for `mode="currency"` (default `USD`). */
  readonly currency = input<string>();
  readonly prefix = input('');
  readonly suffix = input('');
  readonly showButtons = input(false, { transform: booleanAttribute });
  readonly buttonLayout = input<HxInputNumberButtonLayout>('stacked');
  readonly incrementLabel = input('Increment');
  readonly decrementLabel = input('Decrement');
  readonly placeholder = input('');
  readonly size = input<HxInputNumberSize>('medium');
  readonly variant = input<HxInputNumberVariant>('outlined');
  readonly fluid = input(false, { transform: booleanAttribute });
  /** The `id` of the field, for a `<label for>`. */
  readonly inputId = input<string>();
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();

  // The signal-forms contract (FormValueControl): value, disabled, invalid, touch.
  readonly value = model<number | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  protected readonly defaultId = nextId('hx-input-number');
  /** The text the user is typing; `null` while the field shows the formatted value. */
  protected readonly editing = signal<string | null>(null);
  readonly #cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());

  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('field');

  readonly #formatter = computed(
    () =>
      new Intl.NumberFormat(this.locale(), {
        style: this.mode() === 'currency' ? 'currency' : 'decimal',
        currency: this.mode() === 'currency' ? (this.currency() ?? 'USD') : undefined,
        minimumFractionDigits: this.minFractionDigits(),
        maximumFractionDigits: this.maxFractionDigits(),
        useGrouping: this.useGrouping(),
      }),
  );

  /** The characters of the locale that the parser must understand. */
  readonly #symbols = computed(() => {
    const locale = this.#formatter().resolvedOptions().locale;
    const part = (parts: Intl.NumberFormatPart[], type: string) =>
      parts.find((p) => p.type === type)?.value;
    const decimal = part(
      new Intl.NumberFormat(locale, { minimumFractionDigits: 1 }).formatToParts(1.1),
      'decimal',
    );
    const group = part(new Intl.NumberFormat(locale).formatToParts(11111), 'group');
    const minus = part(new Intl.NumberFormat(locale).formatToParts(-1), 'minusSign');
    const digits = new Intl.NumberFormat(locale, { useGrouping: false });
    return {
      decimal: decimal ?? '.',
      group,
      minus: minus ?? '-',
      digits: [...Array(10).keys()].map((i) => digits.format(i)),
    };
  });

  protected readonly displayText = computed(() => this.editing() ?? this.#format(this.value()));
  protected readonly ariaValueText = computed(() => {
    const value = this.value();
    return value === null ? null : this.#format(value);
  });
  protected readonly canIncrement = computed(() => {
    const [value, max] = [this.value(), this.max()];
    return !this.isDisabled() && (value === null || max === undefined || value < max);
  });
  protected readonly canDecrement = computed(() => {
    const [value, min] = [this.value(), this.min()];
    return !this.isDisabled() && (value === null || min === undefined || value > min);
  });

  #onChange: (value: number | null) => void = () => {};
  #onTouched: () => void = () => {};
  #repeat: ReturnType<typeof setTimeout> | undefined;
  #holding = false;
  #pointerStepped = false;

  constructor() {
    this.#destroyRef.onDestroy(() => this.#stopRepeat());
  }

  // ControlValueAccessor (template-driven and reactive forms)
  writeValue(value: number | null): void {
    this.value.set(value ?? null);
    this.editing.set(null);
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

  /** Focuses the field (signal forms call this to focus the control). */
  focus(options?: FocusOptions): void {
    this.field().nativeElement.focus(options);
  }

  protected onInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.editing.set(text);
    const parsed = this.#parse(text);
    // an unparsable text ("-", "1.2.3") keeps the last value; the field is reformatted on blur
    if (parsed !== undefined) this.#commit(parsed === null ? null : this.#normalize(parsed));
  }

  protected onKeydown(event: KeyboardEvent): void {
    const { key } = event;
    if (key === 'ArrowUp' || key === 'ArrowDown') {
      event.preventDefault();
      this.#stepBy(key === 'ArrowUp' ? 1 : -1);
    } else if (key === 'Home' && this.min() !== undefined) {
      event.preventDefault();
      this.#setNumber(this.min() as number);
    } else if (key === 'End' && this.max() !== undefined) {
      event.preventDefault();
      this.#setNumber(this.max() as number);
    } else if (key === 'Enter') {
      this.editing.set(null);
    }
  }

  protected onBlur(): void {
    this.editing.set(null);
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && this.#host.nativeElement.contains(next)) return;
    this.#onTouched();
    this.touch.emit();
  }

  /** Pointer down on a step button: one step now, then repeat while it is held. */
  protected onPress(event: PointerEvent, direction: 1 | -1): void {
    if (event.button > 0) return;
    this.#pointerStepped = true;
    this.#stopRepeat();
    this.#holding = true;
    this.#stepBy(direction); // stops the repeat when a limit is reached
    const tick = () => {
      this.#stepBy(direction);
      if (this.#holding) this.#repeat = setTimeout(tick, REPEAT_INTERVAL);
    };
    if (this.#holding) this.#repeat = setTimeout(tick, REPEAT_DELAY);
  }

  protected onRelease(): void {
    this.#stopRepeat();
  }

  /** A click that did not come from a pointer press (assistive technology, `button.click()`) steps once. */
  protected onClick(direction: 1 | -1): void {
    if (this.#pointerStepped) this.#pointerStepped = false;
    else this.#stepBy(direction);
  }

  #stopRepeat(): void {
    this.#holding = false;
    clearTimeout(this.#repeat);
    this.#repeat = undefined;
  }

  #stepBy(direction: 1 | -1): void {
    if (this.isDisabled()) return;
    const typed = this.editing();
    const current = (typed === null ? undefined : this.#parse(typed)) ?? this.value() ?? 0;
    this.#setNumber(current + direction * this.step());
  }

  #setNumber(next: number): void {
    const value = this.#normalize(next);
    const changed = value !== this.value();
    this.editing.set(null);
    if (changed) this.#commit(value);
    else this.#stopRepeat(); // at a limit
  }

  #commit(value: number | null): void {
    this.value.set(value);
    this.#onChange(value);
  }

  /** Clamps to `min`/`max` and rounds to the fraction digits the field shows. */
  #normalize(value: number): number {
    const min = this.min();
    const max = this.max();
    let result = value;
    if (min !== undefined) result = Math.max(min, result);
    if (max !== undefined) result = Math.min(max, result);
    const digits = this.#formatter().resolvedOptions().maximumFractionDigits ?? 3;
    return Number(result.toFixed(digits));
  }

  #format(value: number | null): string {
    return value === null
      ? ''
      : `${this.prefix()}${this.#formatter().format(value)}${this.suffix()}`;
  }

  /** The number in `text`, `null` for an empty text, `undefined` when it is not a number. */
  #parse(text: string): number | null | undefined {
    const { decimal, group, minus, digits } = this.#symbols();
    let s = text.trim();
    if (!s) return null;
    for (const affix of [this.prefix(), this.suffix()]) if (affix) s = s.replace(affix, '');
    digits.forEach((local, i) => {
      if (local !== String(i)) s = s.replaceAll(local, String(i));
    });
    s = s.replaceAll(minus, '-').replaceAll('−', '-');
    if (group) s = /\s/.test(group) ? s.replace(/\s/g, '') : s.replaceAll(group, '');
    s = s.replaceAll(decimal, '.').replace(/[^0-9.-]/g, '');
    if (!/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return undefined;
    return Number(s);
  }
}
