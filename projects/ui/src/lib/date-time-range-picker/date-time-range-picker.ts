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
  viewChild,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { HxDatePicker, type HxDatePickerValue } from '../date-picker/date-picker';
import { isValidDate } from '../internal/dates';

export interface HxDateTimeRangeValue {
  from: Date | null;
  to: Date | null;
}

const EMPTY: HxDateTimeRangeValue = { from: null, to: null };
const single = (value: HxDatePickerValue): Date | null =>
  (Array.isArray(value) ? value[0] : value) ?? null;
const earlier = (a: Date | null, b: Date | null) => (a && b ? (a <= b ? a : b) : (a ?? b));
const later = (a: Date | null, b: Date | null) => (a && b ? (a >= b ? a : b) : (a ?? b));

/**
 * A from and a to date-time field in one control, built from two `hx-date-picker` with `showTime`. The value is
 * `{ from, to }` (`null` while a side is empty); `to` is never before `from`: the `to` calendar starts at `from`
 * (including the time), the `from` calendar ends at `to`, and a choice that crosses the other side moves it.
 *
 * ```html
 * <hx-date-time-range-picker [stepMinute]="15" [(ngModel)]="shift" />
 * <hx-date-time-range-picker timeOnly [showMinutes]="false" [(value)]="opening" />
 * ```
 *
 * It works with `ngModel`, reactive forms and signal forms (`[formField]`). The time options are those of
 * `hx-date-picker`. The two fields are a `role="group"` named by `ariaLabel` / `ariaLabelledby`, labelled
 * `fromLabel` / `toLabel`.
 */
@Component({
  selector: 'hx-date-time-range-picker',
  imports: [HxDatePicker],
  templateUrl: './date-time-range-picker.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HxDateTimeRangePicker),
      multi: true,
    },
  ],
  host: {
    class: 'hx-date-time-range-picker',
    '[class.hx-date-time-range-picker-disabled]': 'isDisabled()',
    '[class.hx-date-time-range-picker-invalid]': 'invalid()',
  },
})
export class HxDateTimeRangePicker
  implements ControlValueAccessor, FormValueControl<HxDateTimeRangeValue>
{
  /** Accessible names and placeholders of the two fields. */
  readonly fromLabel = input('From');
  readonly toLabel = input('To');
  /** The text between the fields. */
  readonly separator = input('–');
  /** The `id` of the from field, for a `<label for>`. */
  readonly inputId = input<string>();

  /** The options of `hx-date-picker`, passed to both fields. */
  readonly showTime = input(true, { transform: booleanAttribute });
  readonly timeOnly = input(false, { transform: booleanAttribute });
  readonly hourFormat = input<'24' | '12'>('24');
  readonly showMinutes = input(true, { transform: booleanAttribute });
  readonly showSeconds = input(false, { transform: booleanAttribute });
  readonly stepHour = input(1, { transform: numberAttribute });
  readonly stepMinute = input(1, { transform: numberAttribute });
  readonly stepSecond = input(1, { transform: numberAttribute });
  readonly dateFormat = input<Intl.DateTimeFormatOptions>();
  readonly locale = input<string>();
  readonly firstDayOfWeek = input(0, { transform: numberAttribute });
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly disabledDates = input<readonly Date[]>([]);
  readonly showIcon = input(false, { transform: booleanAttribute });
  readonly showButtonBar = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();

  // The signal-forms contract (FormValueControl): value, disabled, invalid, touch.
  readonly value = model<HxDateTimeRangeValue>(EMPTY);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  private readonly fromPicker = viewChild(HxDatePicker);
  readonly #cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());
  /** `from` ends at `to`, `to` starts at `from`, each inside `minDate`..`maxDate`. */
  protected readonly fromMax = computed(() => earlier(this.value().to, this.maxDate()));
  protected readonly toMin = computed(() => later(this.value().from, this.minDate()));

  #onChange: (value: HxDateTimeRangeValue) => void = () => {};
  #onTouched: () => void = () => {};

  writeValue(value: HxDateTimeRangeValue | null): void {
    this.value.set({ from: value?.from ?? null, to: value?.to ?? null });
  }
  registerOnChange(fn: (value: HxDateTimeRangeValue) => void): void {
    this.#onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.#cvaDisabled.set(disabled);
  }

  /** Focuses the from field (signal forms call this to focus the control). */
  focus(): void {
    this.fromPicker()?.focus();
  }

  protected setFrom(picked: HxDatePickerValue): void {
    const from = single(picked);
    const { to } = this.value();
    this.#commit({ from, to: from && to && to < from ? from : to });
  }

  protected setTo(picked: HxDatePickerValue): void {
    const { from } = this.value();
    const to = single(picked);
    this.#commit({ from, to: from && to && to < from ? from : to });
  }

  protected markTouched(): void {
    this.#onTouched();
    this.touch.emit();
  }

  #commit(next: HxDateTimeRangeValue): void {
    const clean = {
      from: isValidDate(next.from) ? next.from : null,
      to: isValidDate(next.to) ? next.to : null,
    };
    this.value.set(clean);
    this.#onChange(clean);
  }
}
