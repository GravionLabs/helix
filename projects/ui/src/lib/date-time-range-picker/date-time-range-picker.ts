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
import { HxCheckbox } from '../checkbox/checkbox';
import { HxDatePicker, type HxDatePickerValue } from '../date-picker/date-picker';
import { HxInput } from '../input/input';
import { clampTime, isSameDay, isValidDate, startOfDay, withTime } from '../internal/dates';
import { parseDateText, parseDateTimeText } from '../internal/field/date-text';
import { nextId } from '../internal/ids';
import { HxSelect } from '../select/select';
import { HxTimePicker, type HxTimePickerValue } from '../time-picker/time-picker';
import { type HxDateMathUnit, hxParseDateMath, hxRelativeRangeExpressions } from './date-math';
import {
  addRecentRange,
  DEFAULT_SIDE,
  describeRange,
  HX_QUICK_SELECT_COMMONLY_USED,
  HX_QUICK_SELECT_LABELS,
  HX_QUICK_SELECT_UNITS,
  type HxDateRangeExpression,
  type HxQuickSelectLabels,
  type HxQuickSelectRange,
  type HxQuickSelectSide,
  hxResolveRangeSide,
  readRecentRanges,
  sideExpression,
  sideFromExpression,
  writeRecentRanges,
} from './quick-select';

export interface HxDateTimeRangeValue {
  from: Date | null;
  to: Date | null;
}

/** A relative range in the popup's preset list; `from` and `to` are read when it is chosen (`now` stays current). */
export interface HxDateTimeRangePreset {
  label: string;
  /** Called with the picker's settings, so a calendar range can follow its `firstDayOfWeek`. */
  from: (context?: HxDateTimeRangePresetContext) => Date;
  to: (context?: HxDateTimeRangePresetContext) => Date;
}

export interface HxDateTimeRangePresetContext {
  firstDayOfWeek: number;
}

const EMPTY: HxDateTimeRangeValue = { from: null, to: null };
const earlier = (a: Date | null, b: Date | null) => (a && b ? (a <= b ? a : b) : (a ?? b));
const sameTime = (a: Date | null, b: Date | null) => a?.getTime() === b?.getTime();
const sameRange = (a: HxDateTimeRangeValue, b: HxDateTimeRangeValue) =>
  sameTime(a.from, b.from) && sameTime(a.to, b.to);
const later = (a: Date | null, b: Date | null) => (a && b ? (a >= b ? a : b) : (a ?? b));
type Side = 'from' | 'to';
type SideMode = HxQuickSelectSide['mode'];
const SIDE_MODES: readonly SideMode[] = ['absolute', 'relative', 'now'];
const ABSOLUTE_SIDES = { from: DEFAULT_SIDE, to: DEFAULT_SIDE };

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
 *
 * With `quickSelect` the popup also holds a Kibana-style quick select: *Last/Next N unit*, a tab list
 * *Absolute / Relative / Now* for the start and for the end, a *Commonly used* and a *Recently used* list (the last
 * five applied ranges, kept in `localStorage` under `recentStorageKey`). Date math (`now-15m`, `now/d`) is resolved
 * against the current time when the range is applied; the value stays `{ from, to }` and the expressions are in
 * the `expression` model (`null` for an absolute range).
 */
@Component({
  selector: 'hx-date-time-range-picker',
  imports: [
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    HxCheckbox,
    HxDatePicker,
    HxInput,
    HxSelect,
    HxTimePicker,
  ],
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
  /**
   * The Kibana-style quick select in the popup (Last/Next N unit, relative sides, commonly and recently used).
   * As in Kibana, the quick Apply and a click on a commonly or recently used range commit the range and close the
   * popup at once (preset buttons only fill the draft); the Start/End tabs are applied with Submit.
   */
  readonly quickSelect = input(false, { transform: booleanAttribute });
  /** The texts of the quick select; any text left out stays English. */
  readonly quickSelectLabels = input<Partial<HxQuickSelectLabels>>({});
  /** The "Commonly used" ranges of the quick select. */
  readonly commonlyUsed = input<readonly HxQuickSelectRange[]>(HX_QUICK_SELECT_COMMONLY_USED);
  /** The `localStorage` key of the "Recently used" list; `null` keeps the list only while the picker lives. */
  readonly recentStorageKey = input<string | null>('hx-date-range-recent');
  /**
   * The applied range as expressions (`{ from: 'now-15m', to: 'now' }`, an absolute side as an ISO date-time);
   * `null` once an absolute range is chosen. Setting it from outside does not change `value`: it only sets up the
   * quick select's tabs the next time the popup opens (resolve it yourself with `hxResolveRangeExpression`).
   */
  readonly expression = model<HxDateRangeExpression | null>(null);

  // The signal-forms contract (FormValueControl): value, disabled, invalid, touch.
  readonly value = model<HxDateTimeRangeValue>(EMPTY);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #injector = inject(Injector);
  readonly open = signal(false);
  /** The range being edited in the popup; Submit makes it the value, Cancel drops it. */
  protected readonly presetValue = (preset: HxDateTimeRangePreset) => preset;
  protected readonly draft = signal<HxDateTimeRangeValue>(EMPTY);
  /** The preset chosen in the select (shown until the popup opens again). */
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
  /** The quick select: Last/Next N unit, the state of each side's tabs and the recently used ranges. */
  protected readonly quickDirection = signal<'last' | 'next'>('last');
  protected readonly quickAmount = signal(15);
  protected readonly quickUnit = signal<HxDateMathUnit>('m');
  protected readonly sides = signal<Record<Side, HxQuickSelectSide>>(ABSOLUTE_SIDES);
  protected readonly recent = signal<HxDateRangeExpression[]>([]);
  /** Submit could not apply the quick select's sides; shown under the sides and named by the Submit button. */
  protected readonly quickError = signal(false);
  protected readonly quickErrorId = `${this.popupId}-error`;
  protected readonly sideModes = SIDE_MODES;
  protected readonly labels = computed<HxQuickSelectLabels>(() => ({
    ...HX_QUICK_SELECT_LABELS,
    ...this.quickSelectLabels(),
  }));
  protected readonly directionOptions = computed(() => [
    { label: this.labels().last, value: 'last' },
    { label: this.labels().next, value: 'next' },
  ]);
  protected readonly unitOptions = computed(() =>
    HX_QUICK_SELECT_UNITS.map((unit) => ({ label: this.labels().units[unit], value: unit })),
  );
  /** The unit and direction of a relative side in one select (`Minutes ago`, `Minutes from now`). */
  protected readonly relativeOptions = computed(() => {
    const l = this.labels();
    return [
      ...HX_QUICK_SELECT_UNITS.map((unit) => ({ label: l.unitsAgo[unit], value: `${unit}-ago` })),
      ...HX_QUICK_SELECT_UNITS.map((unit) => ({
        label: l.unitsFromNow[unit],
        value: `${unit}-fromNow`,
      })),
    ];
  });
  protected readonly recentItems = computed(() =>
    this.recent().map((range) => ({
      range,
      label: describeRange(
        range,
        this.labels(),
        this.commonlyUsed(),
        (d) => this.#formatDate(d),
        this.separator(),
      ),
    })),
  );
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');
  private readonly quickFirst = viewChild('quickFirst', { read: HxSelect });
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
    if (this.quickSelect()) this.#setUpQuickSelect();
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
    afterNextRender(() => (this.quickFirst() ?? this.daysPicker() ?? this.timePicker())?.focus(), {
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
      this.expression.set(null);
      // an open popup edits the typed range from now on: a later Submit keeps it
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

  protected clear(): void {
    this.#stage(EMPTY);
  }

  /** The choice in the preset select: fills the draft like a button. */
  protected selectPreset(preset: HxDateTimeRangePreset | null): void {
    this.selectedPreset.set(preset);
    if (preset) this.applyPreset(preset);
  }

  #inSelectList(target: EventTarget | null): boolean {
    return target instanceof Element && target.closest('.hx-select-overlay') !== null;
  }

  /** Puts a preset into the draft (the calendar and the time pickers show it); Submit commits it. */
  protected applyPreset(preset: HxDateTimeRangePreset): void {
    const { from: oldFrom, to: oldTo } = this.draft();
    const context = { firstDayOfWeek: this.firstDayOfWeek() };
    const from = this.#fitPreset(preset.from(context), oldFrom);
    const to = this.#fitPreset(preset.to(context), oldTo ?? oldFrom);
    // a side on a day in `disabledDates` refuses the preset, as a click or a typed day would
    if (from === undefined || to === undefined) return;
    this.#stage(from && to && to < from ? { from: to, to: from } : { from, to });
    this.#makeAbsolute('from');
    this.#makeAbsolute('to');
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
    if (this.quickSelect()) {
      const { from, to } = this.sides();
      if (from.mode !== 'absolute' || to.mode !== 'absolute') {
        const draft = this.draft();
        const side = (state: HxQuickSelectSide, date: Date | null) =>
          sideExpression(state) ?? date?.toISOString() ?? null;
        const range = { from: side(from, draft.from), to: side(to, draft.to) };
        // an empty absolute side next to a relative one is no range to apply: say so instead
        const applied =
          range.from !== null &&
          range.to !== null &&
          this.#applyRange({ from: range.from, to: range.to });
        if (!applied) this.quickError.set(true);
        return;
      }
      const { from: start, to: end } = this.draft();
      if (start && end) this.#remember({ from: start.toISOString(), to: end.toISOString() });
    }
    this.#commit(this.draft());
    this.expression.set(null);
    this.close(true);
  }

  // ---- quick select ----

  /** Opening the popup: the recently used list from storage, the tabs from the `expression` model. */
  #setUpQuickSelect(): void {
    // blocked storage (or no key) reads `null`: the in-memory list of this session stays
    const stored = readRecentRanges(this.recentStorageKey());
    if (stored) this.recent.set(stored);
    this.quickError.set(false);
    const expression = this.expression();
    this.sides.set(
      expression
        ? { from: sideFromExpression(expression.from), to: sideFromExpression(expression.to) }
        : ABSOLUTE_SIDES,
    );
  }

  protected setQuickDirection(direction: unknown): void {
    if (direction === 'last' || direction === 'next') this.quickDirection.set(direction);
  }

  protected setQuickAmount(event: Event): void {
    this.quickAmount.set(Number((event.target as HTMLInputElement).value));
  }

  protected setQuickUnit(unit: unknown): void {
    if (HX_QUICK_SELECT_UNITS.includes(unit as HxDateMathUnit)) {
      this.quickUnit.set(unit as HxDateMathUnit);
    }
  }

  /** Applies *Last/Next N unit* at once; an amount that is not a positive whole number does nothing. */
  protected applyQuick(): void {
    const range = hxRelativeRangeExpressions(
      this.quickDirection(),
      this.quickAmount(),
      this.quickUnit(),
    );
    if (range) this.#applyRange(range);
  }

  /** A commonly or recently used range is applied at once. */
  protected applyRange(range: HxDateRangeExpression): void {
    this.#applyRange(range);
  }

  protected tabId(side: Side, mode: SideMode): string {
    return `${this.popupId}-${side}-${mode}`;
  }

  protected panelId(side: Side): string {
    return `${this.popupId}-${side}-panel`;
  }

  /** A tab chosen: Relative and Now show their date in the calendar and the time pickers until it is applied. */
  protected setSideMode(side: Side, mode: SideMode): void {
    this.quickError.set(false);
    this.sides.update((s) => ({ ...s, [side]: { ...s[side], mode } }));
    this.#preview(side);
  }

  /** Arrow Left/Right move between the tabs of a side (wrapping), Home and End go to the first and last. */
  protected onTabKeydown(side: Side, event: KeyboardEvent): void {
    const index = SIDE_MODES.indexOf(this.sides()[side].mode);
    const last = SIDE_MODES.length - 1;
    const next =
      event.key === 'ArrowRight'
        ? (index + 1) % SIDE_MODES.length
        : event.key === 'ArrowLeft'
          ? (index + last) % SIDE_MODES.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : -1;
    if (next < 0) return;
    event.preventDefault();
    this.setSideMode(side, SIDE_MODES[next]);
    const tabs = (event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[role=tab]');
    tabs[next]?.focus();
  }

  protected setSideAmount(side: Side, event: Event): void {
    this.#patchSide(side, { amount: Number((event.target as HTMLInputElement).value) });
  }

  protected setSideUnit(side: Side, value: unknown): void {
    const [unit, direction] = String(value).split('-');
    if (!HX_QUICK_SELECT_UNITS.includes(unit as HxDateMathUnit)) return;
    this.#patchSide(side, {
      unit: unit as HxDateMathUnit,
      direction: direction === 'fromNow' ? 'fromNow' : 'ago',
    });
  }

  protected setSideRound(side: Side, event: Event): void {
    this.#patchSide(side, { round: (event.target as HTMLInputElement).checked });
  }

  protected sideUnitValue(side: Side): string {
    const state = this.sides()[side];
    return `${state.unit}-${state.direction}`;
  }

  protected sideRoundLabel(side: Side): string {
    return this.labels().roundTo.replace('{unit}', this.labels().unitsOne[this.sides()[side].unit]);
  }

  protected sideExpressionText(side: Side): string {
    return sideExpression(this.sides()[side]) ?? '';
  }

  protected sideText(side: Side): string {
    const date = this.draft()[side];
    return date ? this.#formatDate(date) : '';
  }

  /** The date typed on a side's Absolute tab: read like a typed side of the field, not across the other side. */
  protected setAbsoluteSide(side: Side, event: Event): void {
    const field = event.target as HTMLInputElement;
    const old = this.draft();
    const date = this.#parseSide(field.value, old[side] ?? old.from ?? old.to);
    const other = side === 'from' ? old.to : old.from;
    const crosses =
      date && other && (side === 'from' ? date.getTime() > other.getTime() : date < other);
    if (date === undefined || crosses) {
      field.value = this.sideText(side);
      return;
    }
    this.#stage({ ...old, [side]: date });
    field.value = this.sideText(side);
  }

  #patchSide(side: Side, patch: Partial<HxQuickSelectSide>): void {
    this.quickError.set(false);
    this.sides.update((s) => ({ ...s, [side]: { ...s[side], ...patch, raw: null } }));
    this.#preview(side);
  }

  /** Shows a relative side's date in the draft (resolved now); a date across the other side is not shown. */
  #preview(side: Side): void {
    const expression = sideExpression(this.sides()[side]);
    if (!expression) return;
    const old = this.draft();
    const resolved = hxResolveRangeSide(expression, {
      firstDayOfWeek: this.firstDayOfWeek(),
      roundUp: side === 'to',
    });
    const date = resolved ? this.#fitPreset(resolved, old[side] ?? old.from) : undefined;
    if (!date) return;
    const other = side === 'from' ? old.to : old.from;
    if (other && (side === 'from' ? date > other : date < other)) return;
    this.#stage({ ...old, [side]: date });
  }

  /**
   * Resolves a range against the current time and applies it as a preset would be (the day only without the time
   * pickers, refused on a day in `disabledDates` or for an unreadable side, inside `minDate`..`maxDate`), then
   * remembers it, sets the `expression` model and closes the popup.
   */
  #applyRange(range: HxDateRangeExpression): boolean {
    const now = new Date();
    const options = { now, firstDayOfWeek: this.firstDayOfWeek() };
    const resolvedFrom = hxResolveRangeSide(range.from, { ...options, roundUp: false });
    const resolvedTo = hxResolveRangeSide(range.to, { ...options, roundUp: true });
    if (!resolvedFrom || !resolvedTo) return false;
    const { from: oldFrom, to: oldTo } = this.value();
    const from = this.#fitPreset(resolvedFrom, oldFrom);
    const to = this.#fitPreset(resolvedTo, oldTo ?? oldFrom);
    if (!from || !to) return false;
    const next = this.#inside(to < from ? { from: to, to: from } : { from, to });
    const relative = hxParseDateMath(range.from) !== null || hxParseDateMath(range.to) !== null;
    this.#remember(range);
    this.#commit(next);
    this.expression.set(relative ? { from: range.from, to: range.to } : null);
    this.close(true);
    return true;
  }

  #remember(range: HxDateRangeExpression): void {
    const next = addRecentRange(this.recent(), range);
    this.recent.set(next);
    writeRecentRanges(this.recentStorageKey(), next);
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
    this.#makeAbsolute('from');
    this.#makeAbsolute('to');
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
    this.#makeAbsolute('from');
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
    this.#makeAbsolute('to');
    if (!from) this.#makeAbsolute('from');
  }

  /** A side chosen in the calendar or a time picker is absolute from now on. */
  #makeAbsolute(side: Side): void {
    if (this.sides()[side].mode === 'absolute') return;
    this.sides.update((s) => ({ ...s, [side]: { ...s[side], mode: 'absolute' } }));
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
    // a changed draft is a new attempt: the Submit error goes away
    this.quickError.set(false);
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
