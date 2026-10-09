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

export type HxSliderOrientation = 'horizontal' | 'vertical';
export type HxSliderValue = number | readonly [number, number];

/**
 * A number, or with `range` a pair of numbers, chosen on a track. It is built on native
 * `<input type="range">` elements (one, or two for a range), so the keyboard (arrows, Home, End, Page Up/Down)
 * and screen readers work natively; the track and the thumbs are drawn with the Helix tokens.
 *
 * ```html
 * <hx-slider ariaLabel="Volume" [(ngModel)]="volume" />
 * <hx-slider range ariaLabelStart="Minimum price" ariaLabelEnd="Maximum price" [min]="0" [max]="500" [(value)]="price" />
 * <hx-slider orientation="vertical" ariaLabel="Gain" [(value)]="gain" />
 * ```
 *
 * It works with `ngModel`, reactive forms and signal forms (`[formField]`). A range keeps the start thumb at or
 * below the end thumb.
 */
@Component({
  selector: 'hx-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => HxSlider), multi: true }],
  host: {
    class: 'hx-slider',
    '[class.hx-slider-vertical]': "orientation() === 'vertical'",
    '[class.hx-slider-range-mode]': 'range()',
    '[class.hx-slider-invalid]': 'invalid()',
    '[class.hx-slider-disabled]': 'isDisabled()',
    '[style.--hx-slider-start]': "startPercent() + '%'",
    '[style.--hx-slider-end]': "endPercent() + '%'",
    '(focusout)': 'onFocusOut($event)',
  },
  template: `
    <div class="hx-slider-track"><div class="hx-slider-fill"></div></div>
    @if (range()) {
      <input
        type="range"
        class="hx-slider-input hx-slider-input-start"
        [style.z-index]="startPercent() > 50 ? 3 : 1"
        [min]="lower()"
        [max]="upper()"
        [step]="step()"
        [value]="start()"
        [disabled]="isDisabled()"
        [attr.aria-label]="ariaLabelStart()"
        [attr.aria-labelledby]="ariaLabelledby()"
        [attr.aria-orientation]="orientation()"
        [attr.aria-invalid]="invalid() ? 'true' : null"
        (input)="onInput($event, 0)"
      />
      <input
        type="range"
        class="hx-slider-input hx-slider-input-end"
        [style.z-index]="2"
        [min]="lower()"
        [max]="upper()"
        [step]="step()"
        [value]="end()"
        [disabled]="isDisabled()"
        [attr.aria-label]="ariaLabelEnd()"
        [attr.aria-labelledby]="ariaLabelledby()"
        [attr.aria-orientation]="orientation()"
        [attr.aria-invalid]="invalid() ? 'true' : null"
        (input)="onInput($event, 1)"
      />
    } @else {
      <input
        type="range"
        class="hx-slider-input"
        [id]="inputId()"
        [min]="lower()"
        [max]="upper()"
        [step]="step()"
        [value]="end()"
        [disabled]="isDisabled()"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-labelledby]="ariaLabelledby()"
        [attr.aria-orientation]="orientation()"
        [attr.aria-invalid]="invalid() ? 'true' : null"
        (input)="onInput($event, 1)"
      />
    }
  `,
})
// `any`: the contract types `min` and `max` like the value, which is a number or a pair here
// biome-ignore lint/suspicious/noExplicitAny: see above
export class HxSlider implements ControlValueAccessor, FormValueControl<any> {
  /** Two thumbs; the value is `[start, end]`. */
  readonly range = input(false, { transform: booleanAttribute });
  /** Lower bound (default 0). */
  readonly min = input<number | undefined>();
  /** Upper bound (default 100). */
  readonly max = input<number | undefined>();
  readonly step = input(1, { transform: numberAttribute });
  readonly orientation = input<HxSliderOrientation>('horizontal');
  /** The `id` of the thumb of a single slider, for a `<label for>`. */
  readonly inputId = input<string>();
  readonly ariaLabel = input<string>();
  readonly ariaLabelStart = input<string>();
  readonly ariaLabelEnd = input<string>();
  readonly ariaLabelledby = input<string>();

  // The signal-forms contract (FormValueControl): value, disabled, invalid, touch.
  readonly value = model<HxSliderValue>(0);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  readonly #cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());

  /** The start thumb: the first of a range, the minimum for a single slider (it has no start thumb). */
  protected readonly lower = computed(() => this.min() ?? 0);
  protected readonly upper = computed(() => this.max() ?? 100);

  protected readonly start = computed(() => {
    const value = this.value();
    return this.range() && Array.isArray(value) ? value[0] : this.lower();
  });
  protected readonly end = computed(() => {
    const value = this.value();
    if (Array.isArray(value)) return value[this.range() ? 1 : 0];
    return typeof value === 'number' ? value : this.upper();
  });

  protected readonly startPercent = computed(() => this.#percent(this.start()));
  protected readonly endPercent = computed(() => this.#percent(this.end()));

  #onChange: (value: HxSliderValue) => void = () => {};
  #onTouched: () => void = () => {};

  writeValue(value: HxSliderValue | null): void {
    this.value.set(value ?? (this.range() ? [this.lower(), this.upper()] : this.lower()));
  }
  registerOnChange(fn: (value: HxSliderValue) => void): void {
    this.#onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.#cvaDisabled.set(disabled);
  }

  #percent(value: number): number {
    const span = this.upper() - this.lower();
    return span <= 0 ? 0 : Math.min(100, Math.max(0, ((value - this.lower()) / span) * 100));
  }

  protected onInput(event: Event, thumb: 0 | 1): void {
    const field = event.target as HTMLInputElement;
    let next = field.valueAsNumber;
    if (this.range()) {
      // the thumbs may touch but not cross; show the clamped value in the field
      next = thumb === 0 ? Math.min(next, this.end()) : Math.max(next, this.start());
      field.value = String(next);
      this.#commit(thumb === 0 ? [next, this.end()] : [this.start(), next]);
    } else {
      this.#commit(next);
    }
  }

  protected onFocusOut(event: FocusEvent): void {
    const host = event.currentTarget as HTMLElement;
    if (host.contains(event.relatedTarget as Node | null)) return;
    this.#onTouched();
    this.touch.emit();
  }

  #commit(next: HxSliderValue): void {
    this.value.set(next);
    this.#onChange(next);
  }
}
