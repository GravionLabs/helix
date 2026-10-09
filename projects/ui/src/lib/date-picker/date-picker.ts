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
 * Keyboard in the day grid: arrows move by a day or a week, Home and End to the start and end of the week,
 * Page Up and Page Down by a month (with Shift by a year), Enter or Space selects.
 */
@Component({
  selector: 'hx-date-picker',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, NgTemplateOutlet],
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
  /** `Intl.DateTimeFormat` options of the text in the field (numeric by default, so a typed date parses back). */
  readonly dateFormat = input<Intl.DateTimeFormatOptions>({
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  readonly todayLabel = input('Today');
  readonly clearLabel = input('Clear');
  readonly chooseLabel = input('Choose date');
  /** The `id` of the text field, for a `<label for>`. */
  readonly inputId = input<string>();

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
  /** The text typed and not yet committed; `null` while the field shows the value. */
  readonly #typed = signal<string | null>(null);
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

  readonly #format = computed(() => new Intl.DateTimeFormat(this.locale(), this.dateFormat()));
  protected readonly text = computed(() => {
    const typed = this.#typed();
    if (typed !== null) return typed;
    const dates = this.selectedDates();
    const fmt = this.#format();
    if (this.selectionMode() === 'range') return dates.map((d) => fmt.format(d)).join(' – ');
    return dates.map((d) => fmt.format(d)).join(', ');
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
        next = day;
    }
    this.#typed.set(null);
    this.#commit(next);
    if (!this.inline()) {
      const done =
        mode === 'single' || (mode === 'range' && Array.isArray(next) && next.length === 2);
      if (done) this.close(true);
    }
  }

  #commit(next: HxDatePickerValue): void {
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
        // the popup lives in the overlay, outside the host
        const root = this.inline()
          ? this.#host.nativeElement
          : document.getElementById(this.popupId);
        root?.querySelector<HTMLElement>(`.hx-date-picker-date[data-date="${key}"]`)?.focus();
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
    // the day to take the focus: the first selected day, or today
    const first = this.selectedDates()[0];
    this.view.set('day');
    this.focusedDate.set(first ? startOfDay(first) : this.#today);
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
    const dates = parts.map((part) => this.#parse(part));
    if (dates.some((d) => d === null || this.isDateDisabled(d))) return;
    const valid = dates as Date[];
    if (this.selectionMode() === 'range' && valid.length > 2) return;
    this.#commit(this.selectionMode() === 'single' ? valid[0] : valid);
    if (valid[0]) this.focusedDate.set(startOfDay(valid[0]));
  }

  /** A date from the text: numbers in the order the locale writes them, or `yyyy-mm-dd`. */
  #parse(text: string): Date | null {
    const numbers = text.match(/\d+/g)?.map(Number);
    if (!numbers || numbers.length !== 3) return null;
    let [year, month, day] = [0, 0, 0];
    if (/^\d{4}\D/.test(text.trim())) {
      [year, month, day] = numbers;
    } else {
      const order = new Intl.DateTimeFormat(this.locale(), {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      })
        .formatToParts(new Date(2000, 10, 22))
        .filter((p) => ['day', 'month', 'year'].includes(p.type))
        .map((p) => p.type);
      const byType = Object.fromEntries(order.map((type, i) => [type, numbers[i]]));
      [year, month, day] = [byType['year'], byType['month'], byType['day']];
    }
    if (year < 100) year += 2000;
    const date = new Date(year, month - 1, day);
    const sane =
      date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    return sane ? date : null;
  }

  protected selectToday(): void {
    this.pick(this.#today);
  }

  protected clear(): void {
    this.#typed.set(null);
    this.#commit(this.selectionMode() === 'single' ? null : []);
    this.close(true);
  }

  protected onHostFocusOut(event: FocusEvent): void {
    if (this.inline()) return;
    const next = event.relatedTarget as HTMLElement | null;
    if (
      this.open() ||
      next?.closest('.hx-date-picker-popup') ||
      this.#host.nativeElement.contains(next)
    )
      return;
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
