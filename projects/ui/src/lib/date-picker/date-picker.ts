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
  type HxDateTimeRangePreset,
  hxResolvePreset,
} from '../date-range-presets/date-range-presets';
import { HxCalendar } from '../internal/calendar/calendar';
import { type CalendarView, isDateDisabled } from '../internal/calendar/calendar-helpers';
import { clampTime, compareDays, isSameDay, isValidDate, startOfDay } from '../internal/dates';
import { parseDateText } from '../internal/field/date-text';
import { nextId } from '../internal/ids';
import { HxRangePresets } from '../internal/range-presets/range-presets';
import { isInSelectOverlay } from '../select/select';

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
 * Keyboard in the day grid: arrows move by a day or a week, Home and End to the start and end of the week,
 * Page Up and Page Down by a month (with Shift by a year), Enter or Space selects.
 *
 * With `selectionMode="range"`, `presets` lists ready-made ranges above the calendar (as buttons, or with
 * `presetDisplay="select"` in a select), for example `HX_DATE_RANGE_DAY_PRESETS` (Today, Last 7 days, This month).
 * Choosing one sets the value at once to the days of its ends (midnight, in order; moved into `minDate`..`maxDate`)
 * and closes the popup. A preset with an end on a disabled day, or one that lies wholly outside
 * `minDate`..`maxDate`, is refused with an inline message (`presetRefusedLabel`, `role="alert"`).
 *
 * ```html
 * <hx-date-picker selectionMode="range" [presets]="dayPresets" presetDisplay="select" [(ngModel)]="stay" />
 * ```
 */
@Component({
  selector: 'hx-date-picker',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, NgTemplateOutlet, HxCalendar, HxRangePresets],
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
   * `Intl.DateTimeFormat` options of the text in the field. By default numeric, so a typed date parses back.
   */
  readonly dateFormat = input<Intl.DateTimeFormatOptions>();
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
  /** Ready-made ranges above the calendar, only with `selectionMode="range"`; choosing one sets the value. */
  readonly presets = input<readonly HxDateTimeRangePreset[]>([]);
  /** The presets as a row of `buttons` (default) or in a compact `select`. */
  readonly presetDisplay = input<'buttons' | 'select'>('buttons');
  /** The name of the group of preset buttons, and of the preset select. */
  readonly presetsLabel = input('Presets');
  /** The message shown when a preset cannot be chosen (a disabled day, outside `minDate`..`maxDate`). */
  readonly presetRefusedLabel = input('This range cannot be chosen.');

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
  /** The presets shown: range mode only. */
  protected readonly shownPresets = computed(() =>
    this.selectionMode() === 'range' ? this.presets() : [],
  );
  /** The last preset chosen and the value it made. */
  readonly #chosen = signal<{ preset: HxDateTimeRangePreset; from: Date; to: Date } | null>(null);
  /**
   * The preset the select shows: the chosen one while the value still holds its days, looked up by label in the
   * current list (a new `presets` array with the same entries keeps it).
   */
  protected readonly selectedPreset = computed(() => {
    const chosen = this.#chosen();
    if (!chosen) return null;
    const days = this.selectedDates();
    const same =
      days.length === 2 && isSameDay(days[0], chosen.from) && isSameDay(days[1], chosen.to);
    if (!same) return null;
    const list = this.shownPresets();
    return (
      list.find((p) => p === chosen.preset) ??
      list.find((p) => p.label === chosen.preset.label) ??
      null
    );
  });
  /** A preset was refused: the message under the presets, until the next choice or edit. */
  protected readonly presetError = signal(false);
  protected readonly presetErrorId = nextId('hx-date-picker-preset-error');
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

  readonly #format = computed(
    () =>
      new Intl.DateTimeFormat(
        this.locale(),
        this.dateFormat() ?? { day: '2-digit', month: '2-digit', year: 'numeric' },
      ),
  );

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
    this.presetError.set(false);
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

  /**
   * Sets the value to the days of a preset (midnight, in order, inside `minDate`..`maxDate`) and closes the popup.
   * A preset with an end on a disabled day, or wholly outside `minDate`..`maxDate` (both ends before `minDate` or
   * both after `maxDate`), changes nothing and shows the inline message; one that overlaps the limits is cut to them.
   */
  protected applyPreset(preset: HxDateTimeRangePreset): void {
    if (this.isDisabled()) return;
    const range = hxResolvePreset(preset, { firstDayOfWeek: this.firstDayOfWeek() }, (date) =>
      this.#presetDay(date),
    );
    const [min, max] = [this.minDate(), this.maxDate()];
    const outside =
      !range?.from ||
      !range.to ||
      (isValidDate(min) && compareDays(range.to, min) < 0) ||
      (isValidDate(max) && compareDays(range.from, max) > 0);
    const from = range?.from && this.#inLimits(range.from);
    const to = range?.to && this.#inLimits(range.to);
    if (outside || !from || !to || this.isDateDisabled(from) || this.isDateDisabled(to)) {
      this.presetError.set(true);
      return;
    }
    const next = [from, to];
    this.#typed.set(null);
    this.focusedDate.set(from);
    this.#commit(next);
    this.#chosen.set({ preset, from, to });
    if (this.inline() || !this.open()) return;
    this.close();
    // after the render: the preset select puts the focus back on itself first, then the popup is gone
    afterNextRender(() => this.field()?.nativeElement.focus(), { injector: this.#injector });
  }

  /** An end of a preset as a day: midnight; `undefined` on a day in `disabledDates`, `null` for an invalid date. */
  #presetDay(date: Date): Date | null | undefined {
    if (!isValidDate(date)) return null;
    const day = startOfDay(date);
    return this.disabledDates().some((d) => isSameDay(d, day)) ? undefined : day;
  }

  /** A day moved into the days `minDate`..`maxDate`. */
  #inLimits(day: Date): Date {
    const max = this.maxDate();
    return clampTime(
      day,
      startOfDayOrNull(this.minDate()),
      isValidDate(max) ? startOfDay(max) : null,
    );
  }

  #commit(next: HxDatePickerValue): void {
    this.presetError.set(false);
    this.value.set(next);
    this.#onChange(next);
  }

  #focusDay(): void {
    afterNextRender(
      () => {
        this.calendar()?.focusDay();
      },
      { injector: this.#injector },
    );
  }

  protected show(): void {
    if (this.isDisabled() || this.inline() || this.open()) return;
    this.presetError.set(false);
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
    // the list of the preset select is its own overlay
    if (isInSelectOverlay(event.target)) return;
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

  #parse(text: string): Date | null {
    return parseDateText(text, this.locale());
  }

  protected selectToday(): void {
    this.pick(this.today);
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
    if (this.open()) return;
    this.close();
    this.commitTyping();
    this.#onTouched();
    this.touch.emit();
  }

  protected onFocusOut(event: FocusEvent): void {
    if (!this.inline()) return;
    const host = this.#host.nativeElement;
    const next = event.relatedTarget as Node | null;
    if (host.contains(next) || isInSelectOverlay(next)) return;
    this.#onTouched();
    this.touch.emit();
  }
}
