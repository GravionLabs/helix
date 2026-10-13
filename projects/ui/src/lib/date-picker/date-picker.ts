import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  type ConnectedPosition,
} from '@angular/cdk/overlay';
import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  effect,
  forwardRef,
  Injector,
  inject,
  input,
  model,
  numberAttribute,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { HxCalendar } from '../internal/calendar/calendar';
import { type CalendarView, isDateDisabled } from '../internal/calendar/calendar-helpers';
import {
  clampTime,
  compareDays,
  isSameDay,
  isValidDate,
  startOfDay,
  withTime,
} from '../internal/dates';
import { parseDateText, parseDateTimeText } from '../internal/field/date-text';
import { nextId } from '../internal/ids';
import { HxTimeRow } from '../internal/time-row/time-row';
import type { TimeOfDay } from '../internal/time-row/time-row-helpers';

const startOfDayOrNull = (date: Date | null) => (isValidDate(date) ? startOfDay(date) : null);

export type HxDatePickerSelectionMode = 'single' | 'range' | 'multiple';
export type HxDatePickerValue = Date | Date[] | null;
/**
 * A date field that opens a calendar, or with `[inline]="true"` the calendar alone, to choose a day, a range or
 * several days. Typing a date in the field parses it; month and year views are one click on the title. Day, month and weekday names come from `Intl.DateTimeFormat` for the `locale`.
 *
 * ```html
 * <hx-date-picker inputId="arrival" showIcon showButtonBar [(ngModel)]="arrival" />
 * <hx-date-picker inline ariaLabel="Arrival" [(ngModel)]="arrival" />
 * <hx-date-picker inline selectionMode="range" [minDate]="today" [firstDayOfWeek]="1" [(value)]="stay" />
 * ```
 *
 * The value is a `Date` (`single`) or a `Date[]` (`multiple`; `range`: one date while the range is open, two when
 * it is complete). It works with `ngModel`, reactive forms and signal forms (`[formField]`).
 *
 * The field shows the value formatted with `Intl.DateTimeFormat` (`dateFormat` options, numeric by default so a
 * typed date parses back). The popup is a non-modal dialog: focus moves to the selected or today's day and returns
 * to the field on close; a range keeps it open until the second date.
 *
 * `showTime` adds a time row under the calendar (hour, minute, optionally second and AM/PM), `timeOnly` shows the time
 * row alone. The value stays a `Date`; choosing a day keeps the time already set, and with `showTime` the popup stays
 * open until Escape, the focus leaves the control or a button of the button bar. Time applies to `selectionMode="single"`;
 * `range` and `multiple` ignore it.
 *
 * ```html
 * <hx-date-picker showTime [stepMinute]="15" [(ngModel)]="start" />
 * <hx-date-picker timeOnly hourFormat="12" [(ngModel)]="alarm" />
 * ```
 *
 * Each time column is a `spinbutton`: Arrow Up and Down change it by the step, Page Up and Page Down by a larger step,
 * Home and End go to the first and last value.
 *
 * Keyboard in the day grid: arrows move by a day or a week, Home and End to the start and end of the week,
 * Page Up and Page Down by a month (with Shift by a year), Enter or Space selects.
 */
@Component({
  selector: 'hx-date-picker',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, NgTemplateOutlet, HxCalendar, HxTimeRow],
  templateUrl: './date-picker.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => HxDatePicker), multi: true },
  ],
  host: {
    class: 'hx-date-picker',
    '[class.hx-date-picker-inline]': 'inline()',
    '[class.hx-date-picker-disabled]': 'isDisabled()',
    '[class.hx-date-picker-invalid]': 'invalid()',
    '[class.hx-date-picker-open]': 'open()',
    '[class.hx-date-picker-has-icon]': 'showIcon() && !inline()',
    '[class.hx-filled]': '!inline() && text() !== ""',
    '(focusout)': 'onHostFocusOut($event)',
  },
})
export class HxDatePicker implements ControlValueAccessor, FormValueControl<HxDatePickerValue> {
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #injector = inject(Injector);

  /** The text field's placeholder. */
  readonly placeholder = input('');
  /** A calendar button at the end of the field. */
  readonly showIcon = input(false, { transform: booleanAttribute });
  /** Today and Clear buttons under the calendar of the popup. */
  readonly showButtonBar = input(false, { transform: booleanAttribute });
  /**
   * `Intl.DateTimeFormat` options of the text in the field. By default numeric, so a typed date parses back: day,
   * month and year, plus hour and minute (and second) with the time, with the `hourCycle` of `hourFormat`.
   */
  readonly dateFormat = input<Intl.DateTimeFormatOptions>();
  readonly todayLabel = input('Today');
  readonly clearLabel = input('Clear');
  readonly chooseLabel = input('Choose date');
  /** Accessible names of the time row and its columns. */
  readonly timeLabel = input('Time');
  readonly hourLabel = input('Hour');
  readonly minuteLabel = input('Minute');
  readonly secondLabel = input('Second');
  readonly periodLabel = input('AM/PM');
  /** The `id` of the text field, for a `<label for>`. */
  readonly inputId = input<string>();

  /** A time row under the calendar (`single` only). */
  readonly showTime = input(false, { transform: booleanAttribute });
  /** The time row without the calendar (`single` only). */
  readonly timeOnly = input(false, { transform: booleanAttribute });
  /** `'12'` shows hours from 1 to 12 and an AM/PM column. */
  readonly hourFormat = input<'24' | '12'>('24');
  /** A minutes column in the time row; `false` picks the hour only (minutes and seconds are `0`, `showSeconds` is ignored). */
  readonly showMinutes = input(true, { transform: booleanAttribute });
  /** A seconds column in the time row. */
  readonly showSeconds = input(false, { transform: booleanAttribute });
  /** Step of the arrow keys and buttons of the hour column. */
  readonly stepHour = input(1, { transform: numberAttribute });
  /** Step of the minute column. */
  readonly stepMinute = input(1, { transform: numberAttribute });
  /** Step of the second column. */
  readonly stepSecond = input(1, { transform: numberAttribute });

  /** Shows the calendar in the page. */
  readonly inline = input(false, { transform: booleanAttribute });
  readonly selectionMode = input<HxDatePickerSelectionMode>('single');
  /** The earliest and latest day that can be chosen. */
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  /** Days that cannot be chosen. */
  readonly disabledDates = input<readonly Date[]>([]);
  /** `0` Sunday … `6` Saturday. */
  readonly firstDayOfWeek = input(0, { transform: numberAttribute });
  /** A BCP 47 tag for the names (default: the browser's). */
  readonly locale = input<string>();
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();

  // The signal-forms contract (FormValueControl): value, disabled, invalid, touch.
  readonly value = model<HxDatePickerValue>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  readonly open = signal(false);
  protected readonly titleId = nextId('hx-date-picker-title');
  protected readonly popupId = nextId('hx-date-picker-popup');
  protected readonly positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 2 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -2 },
  ];
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');
  private readonly calendar = viewChild(HxCalendar);
  private readonly timeRow = viewChild(HxTimeRow);
  /** The text typed and not yet committed; `null` while the field shows the value. */
  readonly #typed = signal<string | null>(null);
  protected readonly view = signal<CalendarView>('day');
  readonly #cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());

  /** The day with the focus in the grid, and the month the grid shows. */
  protected readonly focusedDate = signal(startOfDay(new Date()));
  protected readonly today = startOfDay(new Date());

  protected readonly selectedDates = computed<Date[]>(() => {
    const value = this.value();
    if (Array.isArray(value)) return value.filter(isValidDate);
    return isValidDate(value) ? [value] : [];
  });

  /** Whether the value carries a time chosen here: only `single` has one. */
  protected readonly timeEnabled = computed(
    () => (this.showTime() || this.timeOnly()) && this.selectionMode() === 'single',
  );
  protected readonly calendarShown = computed(() => !(this.timeOnly() && this.timeEnabled()));
  protected readonly hour12 = computed(() => this.hourFormat() === '12');

  readonly #format = computed(() => {
    const custom = this.dateFormat();
    if (custom) return new Intl.DateTimeFormat(this.locale(), custom);
    const options: Intl.DateTimeFormatOptions = this.calendarShown()
      ? { day: '2-digit', month: '2-digit', year: 'numeric' }
      : {};
    if (this.timeEnabled()) {
      options.hour = '2-digit';
      if (this.showMinutes()) options.minute = '2-digit';
      if (this.showMinutes() && this.showSeconds()) options.second = '2-digit';
      options.hourCycle = this.hour12() ? 'h12' : 'h23';
    }
    return new Intl.DateTimeFormat(this.locale(), options);
  });

  /** The time of day shown in the time row: the value's, or midnight while there is none. */
  protected readonly time = computed<TimeOfDay>(() => {
    const date = this.selectedDates()[0];
    const minutes = this.showMinutes();
    return {
      hours: date?.getHours() ?? 0,
      minutes: minutes ? (date?.getMinutes() ?? 0) : 0,
      seconds: minutes ? (date?.getSeconds() ?? 0) : 0,
    };
  });
  protected readonly text = computed(() => {
    const typed = this.#typed();
    if (typed !== null) return typed;
    const dates = this.selectedDates();
    const fmt = this.#format();
    if (this.selectionMode() === 'range') return dates.map((d) => fmt.format(d)).join(' – ');
    return dates.map((d) => fmt.format(d)).join(', ');
  });

  constructor() {
    // a value set from outside (a binding, a form) brings its month into view; without a value, today moved into
    // `minDate`..`maxDate` does
    effect(() => {
      const first =
        this.selectedDates()[0] ??
        clampTime(this.today, startOfDayOrNull(this.minDate()), this.maxDate());
      const shown = untracked(() => this.focusedDate());
      if (
        first &&
        (first.getFullYear() !== shown.getFullYear() || first.getMonth() !== shown.getMonth())
      ) {
        this.focusedDate.set(startOfDay(first));
      }
    });
  }

  #onChange: (value: HxDatePickerValue) => void = () => {};
  #onTouched: () => void = () => {};

  writeValue(value: HxDatePickerValue): void {
    this.#typed.set(null);
    this.value.set(value ?? null);
  }
  registerOnChange(fn: (value: HxDatePickerValue) => void): void {
    this.#onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.#cvaDisabled.set(disabled);
  }

  /** Focuses the text field, or the day of an inline calendar (signal forms call this to focus the control). */
  focus(): void {
    const field = this.field();
    if (field) field.nativeElement.focus();
    else this.#focusDay();
  }

  protected isDateDisabled(date: Date): boolean {
    return isDateDisabled(date, {
      min: this.minDate(),
      max: this.maxDate(),
      disabledDates: this.disabledDates(),
    });
  }

  protected isSelected(date: Date): boolean {
    return this.selectedDates().some((d) => isSameDay(d, date));
  }

  /** Whether a date with a time lies outside `minDate`..`maxDate`, compared including the time. */
  #outsideTimeRange(date: Date): boolean {
    return clampTime(date, this.minDate(), this.maxDate()).getTime() !== date.getTime();
  }

  protected pick(date: Date): void {
    if (this.isDisabled() || this.isDateDisabled(date)) return;
    const day = startOfDay(date);
    this.focusedDate.set(day);
    const selected = this.selectedDates();
    let next: HxDatePickerValue;
    const mode = this.selectionMode();
    switch (mode) {
      case 'multiple':
        next = this.isSelected(day)
          ? selected.filter((d) => !isSameDay(d, day))
          : [...selected, day];
        break;
      case 'range': {
        if (selected.length !== 1) {
          next = [day];
        } else {
          next = compareDays(day, selected[0]) < 0 ? [day, selected[0]] : [selected[0], day];
        }
        break;
      }
      default:
        next = this.timeEnabled() ? this.#atTime(day, this.time()) : day;
    }
    this.#typed.set(null);
    this.#commit(next);
    if (!this.inline()) {
      const done =
        (mode === 'single' && !this.timeEnabled()) ||
        (mode === 'range' && Array.isArray(next) && next.length === 2);
      if (done) this.close(true);
    }
  }

  /** `day` at a time of day, moved into `minDate`..`maxDate` including their times. */
  #atTime(day: Date, time: TimeOfDay): Date {
    return clampTime(
      withTime(day, time.hours, time.minutes, time.seconds),
      this.minDate(),
      this.maxDate(),
    );
  }

  /** The time row changed a unit: keep the day, or take today. */
  protected setTime(time: TimeOfDay): void {
    if (this.isDisabled()) return;
    const day = this.selectedDates()[0] ?? this.today;
    if (this.isDateDisabled(day)) return;
    this.#typed.set(null);
    this.#commit(this.#atTime(day, time));
  }

  #commit(next: HxDatePickerValue): void {
    this.value.set(next);
    this.#onChange(next);
  }

  #focusDay(): void {
    afterNextRender(
      () => {
        if (this.calendarShown()) {
          this.calendar()?.focusDay();
          return;
        }
        this.timeRow()?.focus();
      },
      { injector: this.#injector },
    );
  }

  protected show(): void {
    if (this.isDisabled() || this.inline() || this.open()) return;
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
    // the day to take the focus: the first selected day, or today moved into `minDate`..`maxDate`
    const first = this.selectedDates()[0];
    this.view.set('day');
    this.focusedDate.set(
      startOfDay(first ?? clampTime(this.today, startOfDayOrNull(this.minDate()), this.maxDate())),
    );
    this.#focusDay();
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

  protected onFieldKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || (event.altKey && event.key === 'ArrowUp')) {
      event.preventDefault();
      this.show();
    } else if (event.key === 'Enter') {
      this.commitTyping();
    }
  }

  protected onTyping(event: Event): void {
    this.#typed.set((event.target as HTMLInputElement).value);
  }

  /** Parses the typed text; an unreadable or disabled date puts the value back. */
  protected commitTyping(): void {
    const typed = this.#typed();
    if (typed === null) return;
    this.#typed.set(null);
    this.#parseAndCommit(typed);
    // the binding does not change when the value stays: put the field's text back by hand
    const field = this.field();
    if (field) field.nativeElement.value = this.text();
  }

  #parseAndCommit(typed: string): void {
    const text = typed.trim();
    if (text === '') {
      this.#commit(this.selectionMode() === 'single' ? null : []);
      return;
    }
    const parts = this.selectionMode() === 'single' ? [text] : text.split(/\s*(?:,|–)\s*/);
    const dates = parts.map((part) =>
      this.timeEnabled() ? this.#parseWithTime(part) : this.#parse(part),
    );
    if (dates.some((d) => d === null || this.isDateDisabled(d))) return;
    if (this.timeEnabled() && this.#outsideTimeRange(dates[0] as Date)) return;
    const valid = dates as Date[];
    if (this.selectionMode() === 'range' && valid.length > 2) return;
    this.#commit(this.selectionMode() === 'single' ? valid[0] : valid);
    if (valid[0]) this.focusedDate.set(startOfDay(valid[0]));
  }

  #parseWithTime(text: string): Date | null {
    return parseDateTimeText(text, {
      locale: this.locale(),
      showMinutes: this.showMinutes(),
      timeOnly: this.timeOnly(),
      fallbackDay: this.selectedDates()[0] ?? this.today,
    });
  }

  #parse(text: string): Date | null {
    return parseDateText(text, this.locale());
  }

  protected selectToday(): void {
    this.pick(this.today);
    // a time row keeps the popup open on a day: the button bar closes it
    if (this.timeEnabled()) this.close(true);
  }

  protected clear(): void {
    this.#typed.set(null);
    this.#commit(this.selectionMode() === 'single' ? null : []);
    this.close(true);
  }

  protected onHostFocusOut(event: FocusEvent): void {
    if (this.inline()) return;
    const next = event.relatedTarget as HTMLElement | null;
    if (next?.closest('.hx-date-picker-popup') || this.#host.nativeElement.contains(next)) return;
    // with a time row the popup does not close on a day, so the focus leaving the control closes it
    if (this.open() && !(this.timeEnabled() && next)) return;
    this.close();
    this.commitTyping();
    this.#onTouched();
    this.touch.emit();
  }

  /** The focus left the popup for something outside the control: a popup with a time row closes. */
  protected onPopupFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as HTMLElement | null;
    if (
      !this.timeEnabled() ||
      !next ||
      next.closest('.hx-date-picker-popup') ||
      this.#host.nativeElement.contains(next)
    )
      return;
    this.close();
    this.commitTyping();
    this.#onTouched();
    this.touch.emit();
  }

  protected onFocusOut(event: FocusEvent): void {
    if (!this.inline()) return;
    const host = this.#host.nativeElement;
    if (host.contains(event.relatedTarget as Node | null)) return;
    this.#onTouched();
    this.touch.emit();
  }
}
