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
import { clampTime, isValidDate, startOfDay, withTime } from '../internal/dates';
import { parseDateTimeText } from '../internal/field/date-text';
import { nextId } from '../internal/ids';
import { HxTimeRow } from '../internal/time-row/time-row';
import type { TimeOfDay } from '../internal/time-row/time-row-helpers';

const startOfDayOrNull = (date: Date | null) => (isValidDate(date) ? startOfDay(date) : null);

export type HxDateTimePickerValue = Date | null;

/**
 * A date and time field that opens a calendar with a time row under it (hour, minute, optionally second and AM/PM),
 * or with `[inline]="true"` the calendar and the time row alone. The value is one `Date`; clearing the field gives
 * `null`. Typing parses `10/09/2026, 14:30` or `10/09/2026 2:30 PM`.
 *
 * ```html
 * <hx-date-time-picker inputId="start" showIcon showButtonBar [stepMinute]="15" [(ngModel)]="start" />
 * <hx-date-time-picker inline ariaLabel="Start" [(value)]="start" />
 * ```
 *
 * It works with `ngModel`, reactive forms and signal forms (`[formField]`). Choosing a day keeps the time already set;
 * setting a time with no date takes today. `minDate` and `maxDate` are compared including the time. The popup is a
 * non-modal dialog that stays open until Escape, the focus leaves the control or a button of the button bar.
 *
 * Each time column is a `spinbutton`: Arrow Up and Down change it by the step, Page Up and Page Down by a larger step,
 * Home and End go to the first and last value. Keyboard in the day grid: arrows move by a day or a week, Home and End
 * to the start and end of the week, Page Up and Page Down by a month (with Shift by a year), Enter or Space selects.
 */
@Component({
  selector: 'hx-date-time-picker',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, NgTemplateOutlet, HxCalendar, HxTimeRow],
  templateUrl: './date-time-picker.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => HxDateTimePicker), multi: true },
  ],
  host: {
    class: 'hx-date-time-picker',
    '[class.hx-date-time-picker-inline]': 'inline()',
    '[class.hx-date-time-picker-disabled]': 'isDisabled()',
    '[class.hx-date-time-picker-invalid]': 'invalid()',
    '[class.hx-date-time-picker-open]': 'open()',
    '[class.hx-date-time-picker-has-icon]': 'showIcon() && !inline()',
    '[class.hx-filled]': '!inline() && text() !== ""',
    '(focusout)': 'onHostFocusOut($event)',
  },
})
export class HxDateTimePicker
  implements ControlValueAccessor, FormValueControl<HxDateTimePickerValue>
{
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #injector = inject(Injector);

  /** The text field's placeholder. */
  readonly placeholder = input('');
  /** A calendar button at the end of the field. */
  readonly showIcon = input(false, { transform: booleanAttribute });
  /** Today and Clear buttons under the time row of the popup. */
  readonly showButtonBar = input(false, { transform: booleanAttribute });
  /**
   * `Intl.DateTimeFormat` options of the text in the field. By default numeric, so a typed date parses back: day,
   * month and year, plus hour and minute (and second), with the `hourCycle` of `hourFormat`.
   */
  readonly dateFormat = input<Intl.DateTimeFormatOptions>();
  readonly todayLabel = input('Today');
  readonly clearLabel = input('Clear');
  readonly chooseLabel = input('Choose date and time');
  /** Accessible names of the time row and its columns. */
  readonly timeLabel = input('Time');
  readonly hourLabel = input('Hour');
  readonly minuteLabel = input('Minute');
  readonly secondLabel = input('Second');
  readonly periodLabel = input('AM/PM');
  /** The `id` of the text field, for a `<label for>`. */
  readonly inputId = input<string>();

  /** `'12'` shows hours from 1 to 12 and an AM/PM column. */
  readonly hourFormat = input<'24' | '12'>('24');
  /** A minutes column; `false` picks the hour only (minutes and seconds are `0`, `showSeconds` is ignored). */
  readonly showMinutes = input(true, { transform: booleanAttribute });
  /** A seconds column. */
  readonly showSeconds = input(false, { transform: booleanAttribute });
  /** Step of the arrow keys and buttons of the hour column. */
  readonly stepHour = input(1, { transform: numberAttribute });
  /** Step of the minute column. */
  readonly stepMinute = input(1, { transform: numberAttribute });
  /** Step of the second column. */
  readonly stepSecond = input(1, { transform: numberAttribute });

  /** Shows the calendar and the time row in the page. */
  readonly inline = input(false, { transform: booleanAttribute });
  /** The earliest and latest moment that can be chosen, compared including the time. */
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
  readonly value = model<HxDateTimePickerValue>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  readonly open = signal(false);
  protected readonly titleId = nextId('hx-date-time-picker-title');
  protected readonly popupId = nextId('hx-date-time-picker-popup');
  protected readonly positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 2 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -2 },
  ];
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');
  private readonly calendar = viewChild(HxCalendar);
  /** The text typed and not yet committed; `null` while the field shows the value. */
  readonly #typed = signal<string | null>(null);
  protected readonly view = signal<CalendarView>('day');
  readonly #cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());

  /** The day with the focus in the grid, and the month the grid shows. */
  protected readonly focusedDate = signal(startOfDay(new Date()));
  protected readonly today = startOfDay(new Date());

  protected readonly selectedDate = computed<Date | null>(() => {
    const value = this.value();
    return isValidDate(value) ? value : null;
  });
  protected readonly selectedDates = computed<Date[]>(() => {
    const date = this.selectedDate();
    return date ? [date] : [];
  });
  protected readonly hour12 = computed(() => this.hourFormat() === '12');

  readonly #format = computed(() => {
    const custom = this.dateFormat();
    if (custom) return new Intl.DateTimeFormat(this.locale(), custom);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      hourCycle: this.hour12() ? 'h12' : 'h23',
    };
    if (this.showMinutes()) options.minute = '2-digit';
    if (this.showMinutes() && this.showSeconds()) options.second = '2-digit';
    return new Intl.DateTimeFormat(this.locale(), options);
  });

  /** The time of day shown in the time row: the value's, or midnight while there is none. */
  protected readonly time = computed<TimeOfDay>(() => {
    const date = this.selectedDate();
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
    const date = this.selectedDate();
    return date ? this.#format().format(date) : '';
  });

  constructor() {
    // a value set from outside drops the text typed and not yet committed (as `writeValue` does)
    effect(() => {
      this.value();
      untracked(() => this.#typed.set(null));
    });
    // a control that becomes disabled closes its popup
    effect(() => {
      if (this.isDisabled()) untracked(() => this.open.set(false));
    });
    // a value set from outside (a binding, a form) brings its month into view; without a value, today moved into
    // `minDate`..`maxDate` does
    effect(() => {
      const first =
        this.selectedDate() ??
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

  #onChange: (value: HxDateTimePickerValue) => void = () => {};
  #onTouched: () => void = () => {};

  writeValue(value: HxDateTimePickerValue): void {
    this.#typed.set(null);
    this.value.set(value ?? null);
  }
  registerOnChange(fn: (value: HxDateTimePickerValue) => void): void {
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

  /** Whether a date with a time lies outside `minDate`..`maxDate`, compared including the time. */
  #outsideTimeRange(date: Date): boolean {
    return clampTime(date, this.minDate(), this.maxDate()).getTime() !== date.getTime();
  }

  /** Chooses a day, keeping the time; `false` when the day is not accepted. */
  protected pick(date: Date): boolean {
    if (this.isDisabled() || this.isDateDisabled(date)) return false;
    const day = startOfDay(date);
    this.focusedDate.set(day);
    this.#typed.set(null);
    this.#commit(this.#atTime(day, this.time()));
    return true;
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
    const day = this.selectedDate() ?? this.today;
    if (this.isDateDisabled(day)) return;
    this.#typed.set(null);
    this.#commit(this.#atTime(day, time));
  }

  #commit(next: HxDateTimePickerValue): void {
    this.value.set(next);
    this.#onChange(next);
  }

  #focusDay(): void {
    afterNextRender(() => this.calendar()?.focusDay(), { injector: this.#injector });
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
    // the day to take the focus: the selected day, or today moved into `minDate`..`maxDate`
    this.view.set('day');
    this.focusedDate.set(
      startOfDay(
        this.selectedDate() ??
          clampTime(this.today, startOfDayOrNull(this.minDate()), this.maxDate()),
      ),
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
    if (this.isDisabled()) return;
    this.#typed.set((event.target as HTMLInputElement).value);
  }

  /** Parses the typed text; an unreadable, disabled or out of range date and time puts the value back. */
  protected commitTyping(): void {
    const typed = this.#typed();
    if (typed === null || this.isDisabled()) return;
    this.#typed.set(null);
    const text = typed.trim();
    if (text === '') {
      if (this.value() !== null) this.#commit(null);
    } else {
      const parsed = parseDateTimeText(text, {
        locale: this.locale(),
        showMinutes: this.showMinutes(),
        timeOnly: false,
        fallbackDay: this.selectedDate() ?? this.today,
      });
      if (parsed && !this.isDateDisabled(parsed) && !this.#outsideTimeRange(parsed)) {
        this.#commit(parsed);
        this.focusedDate.set(startOfDay(parsed));
      }
    }
    // the binding does not change when the value stays: put the field's text back by hand
    const field = this.field();
    if (field) field.nativeElement.value = this.text();
  }

  protected selectToday(): void {
    // the time row keeps the popup open on a day: the button bar closes it
    if (this.pick(this.today)) this.close(true);
  }

  protected clear(): void {
    if (this.isDisabled()) return;
    this.#typed.set(null);
    this.#commit(null);
    this.close(true);
  }

  #leave(): void {
    this.close();
    this.commitTyping();
    this.#onTouched();
    this.touch.emit();
  }

  protected onHostFocusOut(event: FocusEvent): void {
    if (this.inline()) return;
    const next = event.relatedTarget as HTMLElement | null;
    if (next?.closest('.hx-date-time-picker-popup') || this.#host.nativeElement.contains(next))
      return;
    // an open popup stays open while the focus is on nothing (a click on its padding); leaving for another element closes it
    if (this.open() && !next) return;
    this.#leave();
  }

  /** The focus left the popup for something outside the control. */
  protected onPopupFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as HTMLElement | null;
    if (
      !next ||
      next.closest('.hx-date-time-picker-popup') ||
      this.#host.nativeElement.contains(next)
    )
      return;
    this.#leave();
  }

  /** The focus left an inline calendar and time row for something outside the control. */
  protected onInlineFocusOut(event: FocusEvent): void {
    if (!this.inline() || this.#host.nativeElement.contains(event.relatedTarget as Node | null))
      return;
    this.#onTouched();
    this.touch.emit();
  }
}
