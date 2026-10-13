import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  type ConnectedPosition,
} from '@angular/cdk/overlay';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  Injector,
  inject,
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
import { clampTime, isSameDay, isValidDate, startOfDay, withTime } from '../internal/dates';
import { nextId } from '../internal/ids';
import { HxTimePicker, type HxTimePickerValue } from '../time-picker/time-picker';

export interface HxDateTimeRangeValue {
  from: Date | null;
  to: Date | null;
}

const EMPTY: HxDateTimeRangeValue = { from: null, to: null };
const earlier = (a: Date | null, b: Date | null) => (a && b ? (a <= b ? a : b) : (a ?? b));
const later = (a: Date | null, b: Date | null) => (a && b ? (a >= b ? a : b) : (a ?? b));

/**
 * A from and a to date-time range in one field with one button. The field shows the range as one text
 * (`1/1/2026 00:00 - 1/2/2026 00:15`); the popup holds one calendar (an inline range `hx-date-picker`) and a time picker for each end,
 * from and to. The value is `{ from, to }` (`null` while a side is empty); `to` is never before `from`: the `to`
 * time row starts at `from` (including the time), the `from` time row ends at `to`, and a choice that crosses the
 * other side moves it. The field is read-only; the popup stays open until Escape, an outside click or the focus
 * leaving it.
 *
 * ```html
 * <hx-date-time-range-picker [stepMinute]="15" [(ngModel)]="shift" />
 * <hx-date-time-range-picker timeOnly [showMinutes]="false" [(value)]="opening" />
 * ```
 *
 * It works with `ngModel`, reactive forms and signal forms (`[formField]`). The time options are those of
 * `hx-time-picker`. The popup is a dialog named by `ariaLabel` / `ariaLabelledby`; its time rows are named
 * `fromLabel` / `toLabel`.
 */
@Component({
  selector: 'hx-date-time-range-picker',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, HxDatePicker, HxTimePicker],
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
    '(focusout)': 'onHostFocusOut($event)',
  },
})
export class HxDateTimeRangePicker
  implements ControlValueAccessor, FormValueControl<HxDateTimeRangeValue>
{
  /** The names of the two time rows in the popup. */
  readonly fromLabel = input('From');
  readonly toLabel = input('To');
  /** The text between the two dates in the field. */
  readonly separator = input('-');
  readonly placeholder = input('');
  readonly clearLabel = input('Clear');
  readonly cancelLabel = input('Cancel');
  readonly submitLabel = input('Submit');
  readonly chooseLabel = input('Choose date range');
  /** The `id` of the text field, for a `<label for>`. */
  readonly inputId = input<string>();

  /** The time row options, for both ends. */
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
  /** A Clear button next to Cancel and Submit. */
  readonly showButtonBar = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();

  // The signal-forms contract (FormValueControl): value, disabled, invalid, touch.
  readonly value = model<HxDateTimeRangeValue>(EMPTY);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #injector = inject(Injector);
  readonly open = signal(false);
  /** The range being edited in the popup; Submit makes it the value, Cancel drops it. */
  protected readonly draft = signal<HxDateTimeRangeValue>(EMPTY);
  protected readonly popupId = nextId('hx-date-time-range-picker-popup');
  protected readonly positions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 2,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -2,
    },
  ];
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');
  private readonly daysPicker = viewChild(HxDatePicker);
  private readonly timeRow = viewChild(HxTimePicker);
  /** The times of the last complete sides, kept while a side is empty (a range being chosen in the calendar). */
  #lastFrom: Date | null = null;
  #lastTo: Date | null = null;
  readonly #cvaDisabled = signal(false);
  readonly #format = computed(() => {
    const custom = this.dateFormat();
    if (custom) return new Intl.DateTimeFormat(this.locale(), custom);
    const options: Intl.DateTimeFormatOptions = this.timeOnly()
      ? {}
      : { day: 'numeric', month: 'numeric', year: 'numeric' };
    if (this.showTime() || this.timeOnly()) {
      options.hour = 'numeric';
      if (this.showMinutes()) options.minute = '2-digit';
      if (this.showMinutes() && this.showSeconds()) options.second = '2-digit';
      options.hourCycle = this.hourFormat() === '12' ? 'h12' : 'h23';
    }
    return new Intl.DateTimeFormat(this.locale(), options);
  });
  /** `1/1/2026 00:00 - 1/2/2026 00:15`: the date and the time are separated by a space, not a comma. */
  protected readonly text = computed(() => {
    const { from, to } = this.value();
    if (!from && !to) return '';
    const fmt = this.#format();
    const one = (d: Date | null) => (d ? fmt.format(d).replace(/,\s*/, ' ') : '');
    return `${one(from)} ${this.separator()} ${one(to)}`.trim();
  });
  protected readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());
  /** `from` ends at `to`, `to` starts at `from`, each inside `minDate`..`maxDate`. */
  protected readonly fromMax = computed(() => earlier(this.draft().to, this.maxDate()));
  protected readonly toMin = computed(() => later(this.draft().from, this.minDate()));

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

  /** Focuses the text field (signal forms call this to focus the control). */
  focus(): void {
    this.field()?.nativeElement.focus();
  }

  protected show(): void {
    if (this.isDisabled() || this.open()) return;
    this.#stage(this.value());
    this.open.set(true);
  }

  protected toggle(): void {
    if (this.open()) this.close(true);
    else this.show();
  }

  protected close(refocus = false): void {
    if (!this.open()) return;
    this.open.set(false);
    if (refocus) this.field()?.nativeElement.focus();
  }

  protected onAttach(): void {
    afterNextRender(() => (this.daysPicker() ?? this.timeRow())?.focus(), {
      injector: this.#injector,
    });
  }

  protected onFieldKeydown(event: KeyboardEvent): void {
    if (
      event.key === 'ArrowDown' ||
      event.key === 'Enter' ||
      event.key === ' ' ||
      (event.altKey && event.key === 'ArrowUp')
    ) {
      event.preventDefault();
      this.show();
    }
  }

  protected onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close(true);
    }
  }

  protected onOutsideClick(event: MouseEvent): void {
    if (!this.#host.nativeElement.contains(event.target as Node)) this.close();
  }

  protected clear(): void {
    this.#stage(EMPTY);
  }

  protected submit(): void {
    this.#commit(this.draft());
    this.close(true);
  }

  /** The focus left the control (field, button and popup): the popup closes and the control is touched. */
  protected onHostFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as HTMLElement | null;
    if (
      next?.closest('.hx-date-time-range-picker-popup') ||
      this.#host.nativeElement.contains(next)
    )
      return;
    // a click on the popup's own non-focusable area has no related target: stay open
    if (this.open() && !next) return;
    this.close();
    this.markTouched();
  }

  protected onPopupFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as HTMLElement | null;
    if (
      !next ||
      next.closest('.hx-date-time-range-picker-popup') ||
      this.#host.nativeElement.contains(next)
    )
      return;
    this.close();
    this.markTouched();
  }

  /** The days of the calendar: `[from]` while the range is open, `[from, to]` when complete. */
  protected readonly days = computed<Date[]>(() => {
    const { from, to } = this.draft();
    return [from, to].filter((d): d is Date => d !== null);
  });

  /** A choice in the calendar sets the days and keeps the times already chosen (midnight while there is none). */
  protected setDays(picked: HxDatePickerValue): void {
    const [first, second] = (Array.isArray(picked) ? [...picked] : [picked])
      .filter(isValidDate)
      .sort((a, b) => a.getTime() - b.getTime());
    const old = this.draft();
    const [fromTime, toTime] = [old.from ?? this.#lastFrom, old.to ?? this.#lastTo ?? old.from];
    const at = (day: Date | undefined, time: Date | null) =>
      day
        ? withTime(
            startOfDay(day),
            time?.getHours() ?? 0,
            time?.getMinutes() ?? 0,
            time?.getSeconds() ?? 0,
          )
        : null;
    const from = at(first, fromTime);
    const to = at(second, toTime);
    this.#stage({ from, to: from && to && to < from ? from : to });
  }

  /** The values of the two time pickers: a fresh `Date` per draft change, so a clamped time is shown again. */
  protected readonly fromValue = computed<HxTimePickerValue>(() => {
    const { from } = this.draft();
    return from ? new Date(from) : null;
  });
  protected readonly toValue = computed<HxTimePickerValue>(() => {
    const { to } = this.draft();
    return to ? new Date(to) : null;
  });

  /** The `from` picker changed: the day of `from` (else of `to`, else today) at the new time, not after `to`. */
  protected setFromTime(picked: HxTimePickerValue): void {
    if (!picked) return;
    const { from, to } = this.draft();
    const day = from ?? to ?? new Date();
    if (this.#isBlocked(day)) {
      this.#restage();
      return;
    }
    const next = clampTime(this.#atTime(day, picked), this.minDate(), this.fromMax());
    this.#stage({ from: next, to });
  }

  /** The `to` picker changed: the day of `to` (else of `from`, else today) at the new time, not before `from`. */
  protected setToTime(picked: HxTimePickerValue): void {
    if (!picked) return;
    const { from, to } = this.draft();
    const day = to ?? from ?? new Date();
    if (this.#isBlocked(day)) {
      this.#restage();
      return;
    }
    const next = clampTime(this.#atTime(day, picked), this.toMin(), this.maxDate());
    // a `to` chosen while `from` is empty starts the range at midnight of that day (what the `from` picker shows)
    this.#stage({ from: from ?? startOfDay(next), to: next });
  }

  /** Puts the draft back into the pickers after a time they changed was refused. */
  #restage(): void {
    this.draft.update((d) => ({ ...d }));
  }

  /** A time is not set on a day in `disabledDates`. */
  #isBlocked(day: Date): boolean {
    return this.disabledDates().some((d) => isSameDay(d, day));
  }

  #atTime(day: Date, time: Date): Date {
    return withTime(startOfDay(day), time.getHours(), time.getMinutes(), time.getSeconds());
  }

  protected markTouched(): void {
    this.#onTouched();
    this.touch.emit();
  }

  /** Sets the draft; a side is moved into `minDate`..`maxDate` including the time. */
  #stage(next: HxDateTimeRangeValue): void {
    const inside = (d: Date | null) =>
      isValidDate(d) ? clampTime(d, this.minDate(), this.maxDate()) : null;
    const clean = { from: inside(next.from), to: inside(next.to) };
    if (clean.from) this.#lastFrom = clean.from;
    if (clean.to) this.#lastTo = clean.to;
    this.draft.set(clean);
  }

  #commit(next: HxDateTimeRangeValue): void {
    this.value.set(next);
    this.#onChange(next);
  }
}
