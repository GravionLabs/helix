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
import { HxDatePicker, type HxDatePickerValue } from '../date-picker/date-picker';
import {
  type HxDateTimeRangePreset,
  hxResolvePreset,
} from '../date-range-presets/date-range-presets';
import { clampTime, isSameDay, isValidDate, startOfDay, withTime } from '../internal/dates';
import { parseDateText, parseDateTimeText } from '../internal/field/date-text';
import { nextId } from '../internal/ids';
import { HxRangePresets } from '../internal/range-presets/range-presets';
import { isInSelectOverlay } from '../select/select';
import { HxTimePicker, type HxTimePickerValue } from '../time-picker/time-picker';

export interface HxDateTimeRangeValue {
  from: Date | null;
  to: Date | null;
}

const EMPTY: HxDateTimeRangeValue = { from: null, to: null };
const earlier = (a: Date | null, b: Date | null) => (a && b ? (a <= b ? a : b) : (a ?? b));
const sameTime = (a: Date | null, b: Date | null) => a?.getTime() === b?.getTime();
const sameRange = (a: HxDateTimeRangeValue, b: HxDateTimeRangeValue) =>
  sameTime(a.from, b.from) && sameTime(a.to, b.to);
const later = (a: Date | null, b: Date | null) => (a && b ? (a >= b ? a : b) : (a ?? b));

/**
 * A from and a to date-time range in one field with one button. The field shows the range as one text
 * (`1/1/2026 00:00 - 1/2/2026 00:15`); the popup holds one calendar (an inline range `hx-date-picker`) and a time picker for each end,
 * from and to. The value is `{ from, to }` (`null` while a side is empty); `to` is never before `from`: the `to`
 * time picker starts at `from` (including the time), the `from` time picker ends at `to`, and a choice that crosses the
 * other side moves it. The field is read-only unless `typeable`, which lets the range be typed in the field's
 * format (Enter or leaving the field commits it, an unreadable range puts the value back); the popup stays open
 * until Escape, an outside click or the focus leaving it.
 *
 * ```html
 * <hx-date-time-range-picker [stepMinute]="15" [(ngModel)]="shift" />
 * <hx-date-time-range-picker timeOnly [showMinutes]="false" [(value)]="opening" />
 * ```
 *
 * It works with `ngModel`, reactive forms and signal forms (`[formField]`). The time options are those of
 * `hx-time-picker`. The popup is a dialog named by `ariaLabel` / `ariaLabelledby`; its time pickers are named
 * `fromLabel` / `toLabel`.
 */
@Component({
  selector: 'hx-date-time-range-picker',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, HxDatePicker, HxRangePresets, HxTimePicker],
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
  /** The names of the two time pickers in the popup. */
  readonly fromLabel = input('From');
  readonly toLabel = input('To');
  /** The text between the two dates in the field. */
  readonly separator = input('-');
  readonly placeholder = input('');
  /** The name of the group of preset buttons. */
  readonly presetsLabel = input('Presets');
  /** Ready-made ranges listed in the popup; choosing one fills the draft, Submit applies it. */
  readonly presets = input<readonly HxDateTimeRangePreset[]>([]);
  /** The presets as a row of `buttons` (default) or in a compact `select`. */
  readonly presetDisplay = input<'buttons' | 'select'>('buttons');
  readonly clearLabel = input('Clear');
  readonly cancelLabel = input('Cancel');
  readonly submitLabel = input('Submit');
  readonly chooseLabel = input('Choose date range');
  /** The `id` of the text field, for a `<label for>`. */
  readonly inputId = input<string>();
  /** The range can be typed into the field (`from separator to`); otherwise the field is read-only. */
  readonly typeable = input(false, { transform: booleanAttribute });

  /** The time picker options, for both ends. */
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
  /** The preset chosen in the select (shown until the draft changes otherwise or the popup opens again). */
  protected readonly selectedPreset = signal<HxDateTimeRangePreset | null>(null);
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
  private readonly timePicker = viewChild(HxTimePicker);
  /** The times of the last complete sides, kept while a side is empty (a range being chosen in the calendar). */
  #lastFrom: Date | null = null;
  #lastTo: Date | null = null;
  readonly #cvaDisabled = signal(false);
  /** The text typed and not yet committed; `null` while the field shows the value. */
  readonly #typed = signal<string | null>(null);
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
    const typed = this.#typed();
    if (typed !== null) return typed;
    const { from, to } = this.value();
    if (!from && !to) return '';
    const one = (d: Date | null) => (d ? this.#formatDate(d) : '');
    return `${one(from)} ${this.separator()} ${one(to)}`.trim();
  });
  protected readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());
  /** `from` ends at `to`, `to` starts at `from`, each inside `minDate`..`maxDate`. */
  protected readonly fromMax = computed(() => earlier(this.draft().to, this.maxDate()));
  protected readonly toMin = computed(() => later(this.draft().from, this.minDate()));
  /** Counts the refused changes of a time picker; the pickers' values depend on it, so they show the draft again. */
  readonly #refused = signal(0);
  /** The values of the two time pickers: a fresh `Date` per draft change (midnight while a side is empty). */
  protected readonly fromValue = computed<HxTimePickerValue>(() =>
    this.#pickerValue(this.draft().from),
  );
  protected readonly toValue = computed<HxTimePickerValue>(() =>
    this.#pickerValue(this.draft().to),
  );

  #onChange: (value: HxDateTimeRangeValue) => void = () => {};
  #onTouched: () => void = () => {};

  constructor() {
    // a value set from outside drops the text typed and not yet committed (as `writeValue` does)
    effect(() => {
      this.value();
      untracked(() => this.#typed.set(null));
    });
  }

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
    this.selectedPreset.set(null);
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
    afterNextRender(() => (this.daysPicker() ?? this.timePicker())?.focus(), {
      injector: this.#injector,
    });
  }

  /** A typeable field opens with the button, Arrow Down or Alt+Arrow Up (click, Enter and Space are for typing). */
  protected onFieldClick(): void {
    if (!this.typeable()) this.show();
  }

  protected onFieldKeydown(event: KeyboardEvent): void {
    if (this.typeable() && event.key === 'Enter') {
      // a surrounding form is not submitted: Enter commits the typed text
      event.preventDefault();
      this.commitTyping();
    } else if (this.typeable() && event.key === 'Escape' && this.#typed() !== null) {
      event.preventDefault();
      this.#revertTyping();
    } else if (
      event.key === 'ArrowDown' ||
      (event.altKey && event.key === 'ArrowUp') ||
      (!this.typeable() && (event.key === 'Enter' || event.key === ' '))
    ) {
      event.preventDefault();
      this.show();
    }
  }

  protected onTyping(event: Event): void {
    if (!this.typeable() || this.isDisabled()) return;
    this.#typed.set((event.target as HTMLInputElement).value);
  }

  /** Parses the typed range; an unreadable side, a disabled day or a time outside the limits puts the value back. */
  protected commitTyping(): void {
    const typed = this.#typed();
    if (typed === null || this.isDisabled()) return;
    this.#typed.set(null);
    const next = this.#parseRange(typed);
    if (next && !sameRange(next, this.value())) {
      this.#commit(next);
      // an open popup edits the typed range from now on
      if (this.open()) this.#stage(next);
    }
    this.#showValue();
  }

  /** Escape drops the typed text and shows the value again. */
  #revertTyping(): void {
    this.#typed.set(null);
    this.#showValue();
  }

  /** The binding does not change when the value stays: puts the field's text back by hand. */
  #showValue(): void {
    const field = this.field();
    if (field) field.nativeElement.value = this.text();
  }

  /** `from separator to`; either side may be empty (`10/9/2026 09:00 -`), a text without the separator is `from`. */
  #parseRange(typed: string): HxDateTimeRangeValue | null {
    const text = typed.trim();
    if (text === '') return EMPTY;
    const separator = this.separator()
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // the separator stands alone: the `-` of `2026-10-09` is not one
    const parts = separator ? text.split(new RegExp(`(?:^|\\s+)${separator}(?:\\s+|$)`)) : [text];
    if (parts.length > 2) return null;
    const { from: oldFrom, to: oldTo } = this.value();
    const from = this.#parseSide(parts[0], oldFrom);
    const to = this.#parseSide(parts[1] ?? '', oldTo ?? oldFrom);
    if (from === undefined || to === undefined) return null;
    return from && to && to < from ? { from: to, to: from } : { from, to };
  }

  /** `null` for an empty side, `undefined` for one that is unreadable, on a disabled day or outside the limits. */
  #parseSide(part: string, old: Date | null): Date | null | undefined {
    const text = part.trim();
    if (text === '') return null;
    const date = this.#timed()
      ? parseDateTimeText(text, {
          locale: this.locale(),
          showMinutes: this.showMinutes(),
          timeOnly: this.timeOnly(),
          fallbackDay: old ?? new Date(),
        })
      : parseDateText(text, this.locale());
    if (!date || this.#isBlocked(date)) return undefined;
    const [min, max] = [this.minDate(), this.maxDate()];
    if ((min && date < min) || (max && date > max)) return undefined;
    return date;
  }

  protected onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close(true);
    }
  }

  protected onOutsideClick(event: MouseEvent): void {
    // the list of the preset select is its own overlay
    if (this.#inSelectList(event.target)) return;
    if (!this.#host.nativeElement.contains(event.target as Node)) this.close();
  }

  /** Empties the draft; Submit applies the empty range. */
  protected clear(): void {
    this.#stage(EMPTY);
  }

  /** A preset chosen (a button or the select): fills the draft; the select shows it (staging resets it, so set after). */
  protected selectPreset(preset: HxDateTimeRangePreset): void {
    if (this.applyPreset(preset)) this.selectedPreset.set(preset);
  }

  #inSelectList(target: EventTarget | null): boolean {
    return isInSelectOverlay(target);
  }

  /** Puts a preset into the draft (the calendar and the time pickers show it); Submit commits it. */
  protected applyPreset(preset: HxDateTimeRangePreset): boolean {
    const { from: oldFrom, to: oldTo } = this.draft();
    const range = hxResolvePreset(preset, { firstDayOfWeek: this.firstDayOfWeek() }, (date, side) =>
      this.#fitPreset(date, side === 'from' ? oldFrom : (oldTo ?? oldFrom)),
    );
    // a side on a day in `disabledDates` refuses the preset, as a click or a typed day would
    if (!range) return false;
    this.#stage(range);
    return true;
  }

  /**
   * A preset side as the picker can show it (as a typed side is read): the day only without the time pickers, the
   * time only on the day of the draft (or today) with `timeOnly`; `undefined` on a disabled day.
   */
  #fitPreset(date: Date, old: Date | null): Date | null | undefined {
    if (!isValidDate(date)) return null;
    const fitted = this.timeOnly()
      ? this.#atTime(old ?? new Date(), date)
      : this.#timed()
        ? date
        : startOfDay(date);
    return this.#isBlocked(fitted) ? undefined : fitted;
  }

  /** The value has a time (the time pickers are shown). */
  #timed(): boolean {
    return this.showTime() || this.timeOnly();
  }

  protected submit(): void {
    this.#commit(this.draft());
    this.close(true);
  }

  #formatDate(date: Date): string {
    return this.#format().format(date).replace(/,\s*/, ' ');
  }

  /** The focus left the control (field, button and popup): the popup closes and the control is touched. */
  protected onHostFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as HTMLElement | null;
    if (
      this.#inSelectList(next) ||
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
      this.#inSelectList(next) ||
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

  /** The `from` picker changed: the day of `from` (else of `to`, else today) at the new time, not after `to`. */
  protected setFromTime(picked: HxTimePickerValue): void {
    if (!picked) {
      this.#restage();
      return;
    }
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
    if (!picked) {
      this.#restage();
      return;
    }
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

  #pickerValue(side: Date | null): Date {
    this.#refused();
    return side ? new Date(side) : startOfDay(new Date());
  }

  /** Puts the draft back into the pickers after a time they changed was refused. */
  #restage(): void {
    this.#refused.update((n) => n + 1);
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
    const clean = this.#inside(next);
    // a changed draft is a new attempt: the preset select can take any preset again
    this.selectedPreset.set(null);
    if (clean.from) this.#lastFrom = clean.from;
    if (clean.to) this.#lastTo = clean.to;
    this.draft.set(clean);
  }

  /** A range with each side moved into `minDate`..`maxDate` including the time (an invalid side is empty). */
  #inside(next: HxDateTimeRangeValue): HxDateTimeRangeValue {
    const inside = (d: Date | null) =>
      isValidDate(d) ? clampTime(d, this.minDate(), this.maxDate()) : null;
    return { from: inside(next.from), to: inside(next.to) };
  }

  #commit(next: HxDateTimeRangeValue): void {
    this.value.set(next);
    this.#onChange(next);
  }
}
