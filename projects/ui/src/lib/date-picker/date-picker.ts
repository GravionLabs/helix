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
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import {
  addDays,
  addMonths,
  compareDays,
  isSameDay,
  isValidDate,
  monthCells,
  startOfDay,
} from '../internal/dates';
import { nextId } from '../internal/ids';

export type HxDatePickerSelectionMode = 'single' | 'range' | 'multiple';
export type HxDatePickerValue = Date | Date[] | null;
type CalendarView = 'day' | 'month' | 'year';

/**
 * A calendar to choose a day, a range or several days. Use it inline (`[inline]="true"`); month and year views
 * are one click on the title. Day, month and weekday names come from `Intl.DateTimeFormat` for the `locale`.
 *
 * ```html
 * <hx-date-picker inline ariaLabel="Arrival" [(ngModel)]="arrival" />
 * <hx-date-picker inline selectionMode="range" [minDate]="today" [firstDayOfWeek]="1" [(value)]="stay" />
 * ```
 *
 * The value is a `Date` (`single`) or a `Date[]` (`multiple`; `range`: one date while the range is open, two when
 * it is complete). It works with `ngModel`, reactive forms and signal forms (`[formField]`).
 *
 * Keyboard in the day grid: arrows move by a day or a week, Home and End to the start and end of the week,
 * Page Up and Page Down by a month (with Shift by a year), Enter or Space selects.
 */
@Component({
  selector: 'hx-date-picker',
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
  },
})
export class HxDatePicker implements ControlValueAccessor, FormValueControl<HxDatePickerValue> {
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #injector = inject(Injector);

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

  protected readonly titleId = nextId('hx-date-picker-title');
  protected readonly view = signal<CalendarView>('day');
  readonly #cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());

  /** The day with the focus in the grid, and the month the grid shows. */
  protected readonly focusedDate = signal(startOfDay(new Date()));
  protected readonly viewYear = computed(() => this.focusedDate().getFullYear());
  readonly #today = startOfDay(new Date());

  protected readonly selectedDates = computed<Date[]>(() => {
    const value = this.value();
    if (Array.isArray(value)) return value.filter(isValidDate);
    return isValidDate(value) ? [value] : [];
  });

  readonly #formats = computed(() => {
    const locale = this.locale();
    return {
      month: new Intl.DateTimeFormat(locale, { month: 'long' }),
      monthShort: new Intl.DateTimeFormat(locale, { month: 'short' }),
      weekdayShort: new Intl.DateTimeFormat(locale, { weekday: 'short' }),
      weekdayLong: new Intl.DateTimeFormat(locale, { weekday: 'long' }),
      full: new Intl.DateTimeFormat(locale, { dateStyle: 'full' }),
    };
  });

  protected readonly monthName = computed(() => this.#formats().month.format(this.focusedDate()));
  protected readonly monthNames = computed(() =>
    Array.from({ length: 12 }, (_, m) => this.#formats().monthShort.format(new Date(2026, m, 1))),
  );
  protected readonly weekdays = computed(() => {
    const first = this.firstDayOfWeek();
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(2026, 0, 4 + ((first + i) % 7)); // 4 January 2026 is a Sunday
      return {
        short: this.#formats().weekdayShort.format(day),
        long: this.#formats().weekdayLong.format(day),
      };
    });
  });
  protected readonly weeks = computed(() =>
    monthCells(
      this.focusedDate().getFullYear(),
      this.focusedDate().getMonth(),
      this.firstDayOfWeek(),
    ),
  );
  protected readonly decade = computed(() => {
    const start = Math.floor(this.focusedDate().getFullYear() / 12) * 12;
    return Array.from({ length: 12 }, (_, i) => start + i);
  });

  constructor() {
    // a value set from outside (a binding, a form) brings its month into view
    effect(() => {
      const first = this.selectedDates()[0];
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

  /** Focuses the day the grid will take the focus with (signal forms call this to focus the control). */
  focus(): void {
    this.#focusDay();
  }

  protected dateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  protected dayLabel(date: Date): string {
    return this.#formats().full.format(date);
  }

  protected isToday(date: Date): boolean {
    return isSameDay(date, this.#today);
  }

  protected isSelected(date: Date): boolean {
    return this.selectedDates().some((d) => isSameDay(d, date));
  }

  protected isInRange(date: Date): boolean {
    const [from, to] = this.selectedDates();
    return (
      this.selectionMode() === 'range' &&
      !!from &&
      !!to &&
      compareDays(date, from) > 0 &&
      compareDays(date, to) < 0
    );
  }

  protected isDateDisabled(date: Date): boolean {
    const [min, max] = [this.minDate(), this.maxDate()];
    return (
      (!!min && compareDays(date, min) < 0) ||
      (!!max && compareDays(date, max) > 0) ||
      this.disabledDates().some((d) => isSameDay(d, date))
    );
  }

  /** One day of the grid takes the tab stop: the focused day, or the first day when the focus is elsewhere. */
  protected isFocusTarget(date: Date): boolean {
    return isSameDay(date, this.focusedDate());
  }

  protected step(direction: 1 | -1): void {
    const current = this.focusedDate();
    const next =
      this.view() === 'day'
        ? addMonths(current, direction)
        : this.view() === 'month'
          ? addMonths(current, 12 * direction)
          : addMonths(current, 144 * direction);
    this.focusedDate.set(next);
  }

  protected chooseMonth(month: number): void {
    const current = this.focusedDate();
    this.focusedDate.set(addMonths(new Date(current.getFullYear(), 0, current.getDate()), month));
    this.view.set('day');
  }

  protected chooseYear(year: number): void {
    const current = this.focusedDate();
    this.focusedDate.set(addMonths(new Date(year, current.getMonth(), 1), 0));
    this.view.set('month');
  }

  protected pick(date: Date): void {
    if (this.isDisabled() || this.isDateDisabled(date)) return;
    const day = startOfDay(date);
    this.focusedDate.set(day);
    const selected = this.selectedDates();
    let next: HxDatePickerValue;
    switch (this.selectionMode()) {
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
        next = day;
    }
    this.value.set(next);
    this.#onChange(next);
  }

  protected onDayKeydown(event: KeyboardEvent, date: Date): void {
    const first = this.firstDayOfWeek();
    const weekday = (date.getDay() - first + 7) % 7;
    let target: Date | null = null;
    switch (event.key) {
      case 'ArrowLeft':
        target = addDays(date, -1);
        break;
      case 'ArrowRight':
        target = addDays(date, 1);
        break;
      case 'ArrowUp':
        target = addDays(date, -7);
        break;
      case 'ArrowDown':
        target = addDays(date, 7);
        break;
      case 'Home':
        target = addDays(date, -weekday);
        break;
      case 'End':
        target = addDays(date, 6 - weekday);
        break;
      case 'PageUp':
        target = addMonths(date, event.shiftKey ? -12 : -1);
        break;
      case 'PageDown':
        target = addMonths(date, event.shiftKey ? 12 : 1);
        break;
      default:
        return;
    }
    event.preventDefault();
    this.focusedDate.set(target);
    this.#focusDay();
  }

  #focusDay(): void {
    afterNextRender(
      () => {
        const key = this.dateKey(this.focusedDate());
        this.#host.nativeElement
          .querySelector<HTMLElement>(`.hx-date-picker-date[data-date="${key}"]`)
          ?.focus();
      },
      { injector: this.#injector },
    );
  }

  protected onFocusOut(event: FocusEvent): void {
    const host = this.#host.nativeElement;
    if (host.contains(event.relatedTarget as Node | null)) return;
    this.#onTouched();
    this.touch.emit();
  }
}
