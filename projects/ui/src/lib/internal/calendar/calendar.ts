import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  Injector,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { isSameDay, monthCells } from '../dates';
import {
  type CalendarView,
  dateKey,
  dayKeyTarget,
  decadeOf,
  focusMonth,
  focusYear,
  isDateDisabled,
  isInRange,
  stepFocus,
} from './calendar-helpers';

/**
 * The calendar of `hx-date-picker`: the header with the month and year buttons, and the day, month and year views
 * with the keyboard of the day grid. It holds no value: the picker passes the selection in and takes `picked` out.
 * The markup and the `hx-date-picker-*` classes are the picker's.
 */
@Component({
  selector: 'hx-calendar',
  templateUrl: './calendar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
})
export class HxCalendar {
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #injector = inject(Injector);

  /** The day with the focus in the grid, and the month the grid shows. */
  readonly focusedDate = model.required<Date>();
  readonly view = model<CalendarView>('day');
  readonly selectedDates = input<readonly Date[]>([]);
  readonly selectionMode = input('single');
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly disabledDates = input<readonly Date[]>([]);
  readonly firstDayOfWeek = input(0);
  readonly locale = input<string>();
  readonly disabled = input(false);
  readonly titleId = input.required<string>();
  readonly today = input.required<Date>();

  /** A day button was clicked (it may be a disabled day: the owner decides). */
  readonly picked = output<Date>();

  protected readonly viewYear = computed(() => this.focusedDate().getFullYear());

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
  protected readonly decade = computed(() => decadeOf(this.focusedDate().getFullYear()));

  protected readonly dateKey = dateKey;

  protected dayLabel(date: Date): string {
    return this.#formats().full.format(date);
  }

  protected isToday(date: Date): boolean {
    return isSameDay(date, this.today());
  }

  protected isSelected(date: Date): boolean {
    return this.selectedDates().some((d) => isSameDay(d, date));
  }

  protected isInRange(date: Date): boolean {
    return isInRange(date, this.selectedDates(), this.selectionMode());
  }

  protected isDateDisabled(date: Date): boolean {
    return isDateDisabled(date, {
      min: this.minDate(),
      max: this.maxDate(),
      disabledDates: this.disabledDates(),
    });
  }

  /** One day of the grid takes the tab stop: the focused day, or the first day when the focus is elsewhere. */
  protected isFocusTarget(date: Date): boolean {
    return isSameDay(date, this.focusedDate());
  }

  protected step(direction: 1 | -1): void {
    this.focusedDate.set(stepFocus(this.view(), this.focusedDate(), direction));
  }

  protected chooseMonth(month: number): void {
    this.focusedDate.set(focusMonth(this.focusedDate(), month));
    this.view.set('day');
  }

  protected chooseYear(year: number): void {
    this.focusedDate.set(focusYear(this.focusedDate(), year));
    this.view.set('month');
  }

  protected onDayKeydown(event: KeyboardEvent, date: Date): void {
    const target = dayKeyTarget(event.key, date, this.firstDayOfWeek(), event.shiftKey);
    if (!target) return;
    event.preventDefault();
    this.focusedDate.set(target);
    afterNextRender(() => this.focusDay(), { injector: this.#injector });
  }

  /** Moves the focus to the button of the focused day, if it is in the grid. */
  focusDay(): void {
    this.#host.nativeElement
      .querySelector<HTMLElement>(
        `.hx-date-picker-date[data-date="${dateKey(this.focusedDate())}"]`,
      )
      ?.focus();
  }
}
