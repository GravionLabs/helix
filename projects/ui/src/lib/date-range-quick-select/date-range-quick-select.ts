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
import { HxInput } from '../input/input';
import { HxCalendar } from '../internal/calendar/calendar';
import { type CalendarView, isDateDisabled } from '../internal/calendar/calendar-helpers';
import {
  type HxDateMathUnit,
  hxParseDateMath,
  hxRelativeRangeExpressions,
} from '../internal/date-math/date-math';
import { clampTime, isValidDate, startOfDay } from '../internal/dates';
import { parseDateText, parseDateTimeText } from '../internal/field/date-text';
import { nextId } from '../internal/ids';
import {
  ABSOLUTE_SIDES,
  addRecentRange,
  describeRange,
  describeSide,
  HX_QUICK_SELECT_COMMONLY_USED,
  HX_QUICK_SELECT_LABELS,
  type HxDateRangeExpression,
  type HxQuickSelectLabels,
  type HxQuickSelectRange,
  hxResolveRangeSide,
  QUICK_SELECT_UNITS,
  type QuickSelectSide,
  readRecentRanges,
  SIDE_MODES,
  type Side,
  type SideMode,
  sideExpression,
  sideFromExpression,
  writeRecentRanges,
} from '../internal/quick-select/quick-select';
import { HxSelect, isInSelectOverlay } from '../select/select';

/** The value of `hx-date-range-quick-select`: the resolved start and end (`null` while a side is empty). */
export interface HxDateRangeQuickSelectValue {
  from: Date | null;
  to: Date | null;
}

const EMPTY: HxDateRangeQuickSelectValue = { from: null, to: null };
const SIDE_KEYS: readonly Side[] = ['from', 'to'];

/** The tabs of both sides for an expression (`null`: both absolute). */
const sidesFrom = (expression: HxDateRangeExpression | null): Record<Side, QuickSelectSide> =>
  expression
    ? { from: sideFromExpression(expression.from), to: sideFromExpression(expression.to) }
    : ABSOLUTE_SIDES;

/**
 * A Kibana-style quick select for a date range: one read-only field with a button that opens a compact popup with
 * *Quick select* (Last/Next N unit, Apply), *Commonly used*, *Recently used* (the last five applied ranges, kept in
 * `localStorage` under `recentStorageKey`) and one summary line each for the start and the end.
 *
 * ```html
 * <hx-date-range-quick-select [(ngModel)]="range" [(expression)]="expression" />
 * ```
 *
 * A click on the start or the end opens the editor of that side alone: the tabs *Absolute* (a typed date and the
 * calendar), *Relative* (amount, unit, round to the unit, the resolved date) and *Now*. Escape closes the innermost
 * open layer: the side editor first, then the popup.
 *
 * Apply and a click on a commonly or recently used range commit the range at once and close the popup; an edit in
 * the side editor commits that side at once and keeps the popup open (the range is added to *Recently used* when
 * the popup closes). An edit that cannot be applied (an empty amount, a start after the end, an unreadable date)
 * keeps the last applied range and shows the inline message until the side changes or its editor closes. Date math
 * (`now-15m`, `now/d`) is resolved against the current time when the range is applied; the value is
 * `{ from, to }` (moved into `minDate`..`maxDate`) and the expressions are in the `expression` model (`null` for an
 * absolute range). A range that cannot be applied (an amount out of range, an unreadable side) keeps the popup open
 * with an inline message. It works with `ngModel`, reactive forms and signal forms (`[formField]`).
 */
@Component({
  selector: 'hx-date-range-quick-select',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, HxCalendar, HxCheckbox, HxInput, HxSelect],
  templateUrl: './date-range-quick-select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HxDateRangeQuickSelect),
      multi: true,
    },
  ],
  host: {
    class: 'hx-date-range-quick-select',
    '(focusout)': 'onHostFocusOut($event)',
  },
})
export class HxDateRangeQuickSelect
  implements ControlValueAccessor, FormValueControl<HxDateRangeQuickSelectValue>
{
  /** The texts of the quick select; any text left out stays English. */
  readonly labels = input<Partial<HxQuickSelectLabels>>({});
  /** The "Commonly used" ranges. */
  readonly commonlyUsed = input<readonly HxQuickSelectRange[]>(HX_QUICK_SELECT_COMMONLY_USED);
  /** The `localStorage` key of the "Recently used" list; `null` keeps the list only while the control lives. */
  readonly recentStorageKey = input<string | null>('hx-date-range-recent');
  /**
   * The applied range as expressions (`{ from: 'now-15m', to: 'now' }`, an absolute side as an ISO date-time);
   * `null` for an absolute range, and when `value` is set from outside (`writeValue`, a form's `setValue`/`reset`, a
   * new `[value]`) without a new expression with it. Setting it from outside does not change `value` (resolve it
   * yourself with `hxResolveRangeExpression`); it changes the field's text and the summary. When the resolved ends
   * come out reversed (`now+1d` to `now`), the value is ordered and the expression is swapped with it.
   */
  readonly expression = model<HxDateRangeExpression | null>(null);
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly firstDayOfWeek = input(0, { transform: numberAttribute });
  readonly locale = input<string>();
  /** The format of absolute dates in the field, the summary and the Recently used list. */
  readonly dateFormat = input<Intl.DateTimeFormatOptions>();
  /** The text between the two dates. */
  readonly separator = input('-');
  readonly placeholder = input('');
  readonly chooseLabel = input('Choose date range');
  /** The `id` of the text field, for a `<label for>`. */
  readonly inputId = input<string>();
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();

  // The signal-forms contract (FormValueControl): value, disabled, invalid, touch.
  readonly value = model<HxDateRangeQuickSelectValue>(EMPTY);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #injector = inject(Injector);
  readonly open = signal(false);
  protected readonly popupId = nextId('hx-date-range-quick-select-popup');
  protected readonly positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 2 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -2 },
  ];
  /** Last/Next N unit. */
  protected readonly quickDirection = signal<'last' | 'next'>('last');
  protected readonly quickAmount = signal(15);
  protected readonly quickUnit = signal<HxDateMathUnit>('m');
  protected readonly recent = signal<HxDateRangeExpression[]>([]);
  /** A range could not be applied; shown under the lists and named by the Apply button. */
  protected readonly quickError = signal(false);
  protected readonly quickErrorId = `${this.popupId}-error`;
  /** The two sides of the summary, Start then End. */
  protected readonly sideKeys = SIDE_KEYS;
  protected readonly sideModes = SIDE_MODES;
  /** The side whose editor (tabs Absolute / Relative / Now) is open under the summary; one at a time. */
  protected readonly openSide = signal<Side | null>(null);
  /** The tab and the Relative fields of each side as edited; may hold an edit that was refused. */
  protected readonly sides = signal<Record<Side, QuickSelectSide>>(ABSOLUTE_SIDES);
  /** The sides as last applied (or set from outside): the summary shows them, a refused edit goes back to them. */
  readonly #appliedSides = signal<Record<Side, QuickSelectSide>>(ABSOLUTE_SIDES);
  /** An edit in the side editor was refused; the same message as `quickError`, named by the edited side. */
  protected readonly sideError = signal(false);
  /** The calendar of the Absolute tab: the focused day, the view and today. */
  protected readonly calendarFocus = signal(startOfDay(new Date()));
  protected readonly calendarView = signal<CalendarView>('day');
  protected readonly today = signal(startOfDay(new Date()));
  protected readonly calendarTitleId = `${this.popupId}-calendar-title`;
  protected readonly texts = computed<HxQuickSelectLabels>(() => ({
    ...HX_QUICK_SELECT_LABELS,
    ...this.labels(),
  }));
  protected readonly directionOptions = computed(() => [
    { label: this.texts().last, value: 'last' },
    { label: this.texts().next, value: 'next' },
  ]);
  protected readonly unitOptions = computed(() =>
    QUICK_SELECT_UNITS.map((unit) => ({ label: this.texts().units[unit], value: unit })),
  );
  /** The unit and direction of a relative side in one select (`Minutes ago`, `Minutes from now`). */
  protected readonly relativeOptions = computed(() => {
    const l = this.texts();
    return [
      ...QUICK_SELECT_UNITS.map((unit) => ({ label: l.unitsAgo[unit], value: `${unit}-ago` })),
      ...QUICK_SELECT_UNITS.map((unit) => ({
        label: l.unitsFromNow[unit],
        value: `${unit}-fromNow`,
      })),
    ];
  });
  protected readonly recentItems = computed(() =>
    this.recent().map((range) => ({ range, label: this.#describe(range) })),
  );
  protected readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());
  /** The field: the label of the expression (`Last 15 minutes`), else the two dates. */
  protected readonly text = computed(() => {
    const expression = this.expression();
    if (expression) return this.#describe(expression);
    const { from, to } = this.value();
    if (!from && !to) return '';
    const one = (d: Date | null) => (d ? this.#formatDate(d) : '');
    return `${one(from)} ${this.separator()} ${one(to)}`.trim();
  });

  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');
  private readonly quickFirst = viewChild('quickFirst', { read: HxSelect });
  readonly #cvaDisabled = signal(false);
  readonly #format = computed(
    () =>
      new Intl.DateTimeFormat(
        this.locale(),
        this.dateFormat() ?? {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hourCycle: 'h23',
        },
      ),
  );

  #onChange: (value: HxDateRangeQuickSelectValue) => void = () => {};
  #onTouched: () => void = () => {};

  /** The last `expression` seen and the value it belongs to (see the effect in the constructor). */
  #seenExpression: HxDateRangeExpression | null = null;
  #expressionValue: HxDateRangeQuickSelectValue | null = null;
  /** The value and expression the side editor committed last; anything else came from outside. */
  #editedValue: HxDateRangeQuickSelectValue | null = null;
  #editedExpression: HxDateRangeExpression | null = null;
  /** The range the side editor applied, added to Recently used when the popup closes. */
  #editedRange: HxDateRangeExpression | null = null;

  constructor() {
    // A new expression (the control's own apply or one set from outside) belongs to the value of that moment. A value
    // that changes without a new expression (writeValue, setValue, reset, [value]) makes it stale: it is dropped.
    effect(() => {
      const value = this.value();
      const expression = this.expression();
      untracked(() => {
        if (expression !== this.#seenExpression) {
          this.#seenExpression = expression;
          this.#expressionValue = value;
        } else if (expression !== null && value !== this.#expressionValue) {
          this.expression.set(null);
        }
        // a value or an expression that the side editor did not set (Apply, a list entry, a form, a binding) sets the
        // tabs of both sides again
        if (value !== this.#editedValue || this.expression() !== this.#editedExpression) {
          this.#editedValue = null;
          this.#editedExpression = null;
          this.#editedRange = null;
          this.sideError.set(false);
          const sides = sidesFrom(this.expression());
          this.sides.set(sides);
          this.#appliedSides.set(sides);
        }
      });
    });
  }

  writeValue(value: HxDateRangeQuickSelectValue | null): void {
    this.value.set({ from: value?.from ?? null, to: value?.to ?? null });
  }
  registerOnChange(fn: (value: HxDateRangeQuickSelectValue) => void): void {
    this.#onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.#cvaDisabled.set(disabled);
  }

  /** Focuses the field (signal forms call this to focus the control). */
  focus(): void {
    this.field()?.nativeElement.focus();
  }

  /** Opening the popup: the recently used list from storage, no message. */
  protected show(): void {
    if (this.isDisabled() || this.open()) return;
    // blocked storage (or no key) reads `null`: the in-memory list of this session stays
    const stored = readRecentRanges(this.recentStorageKey());
    if (stored) this.recent.set(stored);
    this.quickError.set(false);
    this.openSide.set(null);
    this.open.set(true);
  }

  protected toggle(): void {
    if (this.open()) this.close(true);
    else this.show();
  }

  protected close(refocus = false): void {
    if (!this.open()) return;
    this.#dropRefusedEdit();
    this.openSide.set(null);
    if (this.#editedRange) this.#remember(this.#editedRange);
    this.#editedRange = null;
    this.open.set(false);
    if (refocus) this.field()?.nativeElement.focus();
  }

  protected onAttach(): void {
    afterNextRender(() => this.quickFirst()?.focus(), { injector: this.#injector });
  }

  /** The read-only field opens with Enter, Space, Arrow Down or Alt+Arrow Up. */
  protected onFieldKeydown(event: KeyboardEvent): void {
    if (
      event.key === 'ArrowDown' ||
      (event.altKey && event.key === 'ArrowUp') ||
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault();
      this.show();
    }
  }

  /** Escape closes the innermost open layer: the side editor first, then the popup. */
  protected onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    if (this.openSide()) this.closeSide();
    else this.close(true);
  }

  protected onOutsideClick(event: MouseEvent): void {
    // the lists of the selects are their own overlays
    if (isInSelectOverlay(event.target)) return;
    if (!this.#host.nativeElement.contains(event.target as Node)) this.close();
  }

  protected setQuickDirection(direction: unknown): void {
    if (direction === 'last' || direction === 'next') this.quickDirection.set(direction);
  }

  protected setQuickAmount(event: Event): void {
    this.quickError.set(false);
    this.quickAmount.set(Number((event.target as HTMLInputElement).value));
  }

  protected setQuickUnit(unit: unknown): void {
    if (QUICK_SELECT_UNITS.includes(unit as HxDateMathUnit)) {
      this.quickUnit.set(unit as HxDateMathUnit);
    }
  }

  /**
   * Applies *Last/Next N unit* at once; an amount that is not a positive safe integer, or one whose date is out of
   * the range of `Date`, shows the inline message instead.
   */
  protected applyQuick(): void {
    const range = hxRelativeRangeExpressions(
      this.quickDirection(),
      this.quickAmount(),
      this.quickUnit(),
    );
    if (!range || !this.#applyRange(range)) this.quickError.set(true);
  }

  /** A commonly or recently used range is applied at once; a refused one shows the inline message. */
  protected applyRange(range: HxDateRangeExpression): void {
    if (!this.#applyRange(range)) this.quickError.set(true);
  }

  /**
   * The summary line of a side as applied: a relative or now side (`~ 15 minutes ago`, `now`), else the date of the
   * value, else `Not set`.
   */
  protected sideSummary(side: Side): string {
    const relative = describeSide(this.#appliedSides()[side], this.texts());
    if (relative !== null) return relative;
    const date = this.value()[side];
    return date ? this.#formatDate(date) : this.texts().emptySide;
  }

  protected sideButtonId(side: Side): string {
    return `${this.popupId}-${side}-button`;
  }

  protected editorId(side: Side): string {
    return `${this.popupId}-${side}-editor`;
  }

  protected tabId(side: Side, mode: SideMode): string {
    return `${this.popupId}-${side}-${mode}`;
  }

  protected panelId(side: Side): string {
    return `${this.popupId}-${side}-panel`;
  }

  /** A click on the start or the end opens the editor of that side and focuses its tab; a second click closes it. */
  protected toggleSide(side: Side): void {
    if (this.openSide() === side) {
      this.closeSide();
      return;
    }
    this.#dropRefusedEdit();
    this.openSide.set(side);
    this.#showDay(side);
    afterNextRender(
      () => document.getElementById(this.tabId(side, this.sides()[side].mode))?.focus(),
      { injector: this.#injector },
    );
  }

  /** Closes the side editor (a refused edit goes back to the applied side) and focuses its summary button. */
  protected closeSide(): void {
    const side = this.openSide();
    if (!side) return;
    this.#dropRefusedEdit();
    this.openSide.set(null);
    document.getElementById(this.sideButtonId(side))?.focus();
  }

  /** A tab chosen: the side becomes absolute (its current date), relative or now, and is applied at once. */
  protected setSideMode(side: Side, mode: SideMode): void {
    const sides = this.sides();
    if (sides[side].mode === mode) return;
    this.#editSides({ ...sides, [side]: { ...sides[side], mode } });
    if (mode === 'absolute') this.#showDay(side);
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

  /** The amount of a Relative tab; an emptied field is `NaN` (refused), not `0` (`now`). */
  protected setSideAmount(side: Side, event: Event): void {
    const text = (event.target as HTMLInputElement).value.trim();
    this.#patchSide(side, { amount: text === '' ? Number.NaN : Number(text) });
  }

  protected setSideUnit(side: Side, value: unknown): void {
    const [unit, direction] = String(value).split('-');
    if (!QUICK_SELECT_UNITS.includes(unit as HxDateMathUnit)) return;
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
    return this.texts().roundTo.replace('{unit}', this.texts().unitsOne[this.sides()[side].unit]);
  }

  protected sideExpressionText(side: Side): string {
    return sideExpression(this.sides()[side]) ?? '';
  }

  /** `Resolves to <date>`: a relative or now side as it would be applied at this moment (inside the limits). */
  protected sideResolvedText(side: Side): string {
    const expression = sideExpression(this.sides()[side]);
    const resolved = expression
      ? hxResolveRangeSide(expression, {
          firstDayOfWeek: this.firstDayOfWeek(),
          roundUp: side === 'to',
        })
      : null;
    if (!isValidDate(resolved)) return '';
    const date = clampTime(resolved, this.minDate(), this.maxDate());
    return this.texts().resolvesTo.replace('{date}', this.#formatDate(date));
  }

  /** The date of an absolute side in its text field. */
  protected sideText(side: Side): string {
    const date = this.value()[side];
    return date ? this.#formatDate(date) : '';
  }

  /** The days of the calendar that are selected: the date of the side. */
  protected sideDays(side: Side): Date[] {
    const date = this.value()[side];
    return date ? [date] : [];
  }

  /**
   * The date typed on an Absolute tab (a date with a time, or a date at midnight; empty clears the side); an
   * unreadable date or one outside `minDate`..`maxDate` is refused with the inline message. Enter and the `change`
   * that follows it commit once: a text that shows the applied date is no edit.
   */
  protected setAbsoluteSide(side: Side, event: Event): void {
    const field = event.target as HTMLInputElement;
    const text = field.value.trim();
    if (text === this.sideText(side)) {
      this.#dropRefusedEdit();
      return;
    }
    let date: Date | null = null;
    if (text !== '') {
      date =
        parseDateTimeText(text, {
          locale: this.locale(),
          showMinutes: true,
          timeOnly: false,
          fallbackDay: this.value()[side] ?? new Date(),
        }) ?? parseDateText(text, this.locale());
      const [min, max] = [this.minDate(), this.maxDate()];
      if (!date || (min && date < min) || (max && date > max)) {
        this.sideError.set(true);
        return;
      }
    }
    if (!this.#editSides(this.sides(), { [side]: date })) return;
    if (date) this.calendarFocus.set(startOfDay(date));
    field.value = this.sideText(side);
  }

  /**
   * A day picked in the calendar of an Absolute tab keeps the side's time (an empty start takes 00:00, an empty end
   * 23:59:59.999), inside `minDate`..`maxDate`; a disabled day is ignored.
   */
  protected pickDay(side: Side, day: Date): void {
    const [min, max] = [this.minDate(), this.maxDate()];
    if (this.isDisabled() || isDateDisabled(day, { min, max })) return;
    const old = this.value()[side];
    const date = startOfDay(day);
    if (old)
      date.setHours(old.getHours(), old.getMinutes(), old.getSeconds(), old.getMilliseconds());
    else if (side === 'to') date.setHours(23, 59, 59, 999);
    this.calendarFocus.set(startOfDay(day));
    this.#editSides(this.sides(), { [side]: clampTime(date, min, max) });
  }

  #patchSide(side: Side, patch: Partial<QuickSelectSide>): void {
    const sides = this.sides();
    this.#editSides({ ...sides, [side]: { ...sides[side], ...patch, raw: null } });
  }

  /** Takes an edit of the side editor and applies it; a refused edit stays in the fields with the message. */
  #editSides(
    sides: Record<Side, QuickSelectSide>,
    dates: Partial<Record<Side, Date | null>> = {},
  ): boolean {
    this.sides.set(sides);
    const applied = this.#applySides(sides, dates);
    this.sideError.set(!applied);
    return applied;
  }

  /**
   * Applies the sides as edited: an absolute side keeps its date (or takes the one of `dates`), a relative or now
   * side is resolved against the current time (`to` rounds up) and moved into `minDate`..`maxDate`. Refused for a
   * relative side that gives no expression or no date, and for a start after the end. An empty side is allowed
   * (the other side is set alone); the expression model holds both sides only when both are set and one of them is
   * relative.
   */
  #applySides(
    sides: Record<Side, QuickSelectSide>,
    dates: Partial<Record<Side, Date | null>>,
  ): boolean {
    const options = { now: new Date(), firstDayOfWeek: this.firstDayOfWeek() };
    const resolved: Record<Side, Date | null> = { from: null, to: null };
    const texts: Record<Side, string | null> = { from: null, to: null };
    for (const side of SIDE_KEYS) {
      const state = sides[side];
      if (state.mode === 'absolute') {
        const date = side in dates ? (dates[side] ?? null) : this.value()[side];
        resolved[side] = date;
        texts[side] = date?.toISOString() ?? null;
        continue;
      }
      const expression = sideExpression(state);
      const date = expression
        ? hxResolveRangeSide(expression, { ...options, roundUp: side === 'to' })
        : null;
      if (!expression || !isValidDate(date)) return false;
      resolved[side] = date;
      texts[side] = expression;
    }
    if (resolved.from && resolved.to && resolved.from > resolved.to) return false;
    const inside = (d: Date | null) => d && clampTime(d, this.minDate(), this.maxDate());
    const next = { from: inside(resolved.from), to: inside(resolved.to) };
    const range =
      texts.from !== null && texts.to !== null ? { from: texts.from, to: texts.to } : null;
    const relative = sides.from.mode !== 'absolute' || sides.to.mode !== 'absolute';
    const expression = relative ? range : null;
    this.#editedValue = next;
    this.#editedExpression = expression;
    this.#editedRange = range;
    this.#appliedSides.set(sides);
    this.#commit(next);
    this.expression.set(expression);
    return true;
  }

  /** A refused edit goes back to the sides as applied. */
  #dropRefusedEdit(): void {
    if (!this.sideError()) return;
    this.sideError.set(false);
    this.sides.set(this.#appliedSides());
  }

  /** The calendar shows the month of the side's date, else today (inside the limits). */
  #showDay(side: Side): void {
    const today = startOfDay(new Date());
    this.today.set(today);
    const min = this.minDate();
    const date = this.value()[side] ?? clampTime(today, min && startOfDay(min), this.maxDate());
    this.calendarFocus.set(startOfDay(date));
    this.calendarView.set('day');
  }

  /**
   * Resolves a range against the current time (`to` rounds up), refused for an unreadable side; each side is moved
   * into `minDate`..`maxDate`. Then remembers it, sets the value and the `expression` model and closes the popup.
   */
  #applyRange(range: HxDateRangeExpression): boolean {
    const options = { now: new Date(), firstDayOfWeek: this.firstDayOfWeek() };
    const from = hxResolveRangeSide(range.from, { ...options, roundUp: false });
    const to = hxResolveRangeSide(range.to, { ...options, roundUp: true });
    if (!isValidDate(from) || !isValidDate(to)) return false;
    // reversed ends are ordered; the expression is swapped with them, so it stays the source of the value
    const swapped = to < from;
    const stored = swapped
      ? { from: range.to, to: range.from }
      : { from: range.from, to: range.to };
    const inside = (d: Date) => clampTime(d, this.minDate(), this.maxDate());
    const next = swapped
      ? { from: inside(to), to: inside(from) }
      : { from: inside(from), to: inside(to) };
    const relative = hxParseDateMath(range.from) !== null || hxParseDateMath(range.to) !== null;
    // this range is remembered instead of the one of the side editor
    this.#editedRange = null;
    this.#remember(stored);
    this.#commit(next);
    this.expression.set(relative ? stored : null);
    this.close(true);
    return true;
  }

  #remember(range: HxDateRangeExpression): void {
    const next = addRecentRange(this.recent(), range);
    this.recent.set(next);
    writeRecentRanges(this.recentStorageKey(), next);
  }

  #describe(range: HxDateRangeExpression): string {
    return describeRange(
      range,
      this.texts(),
      this.commonlyUsed(),
      (d) => this.#formatDate(d),
      this.separator(),
    );
  }

  #formatDate(date: Date): string {
    return this.#format().format(date).replace(/,\s*/, ' ');
  }

  /** The focus left the control (field, button and popup): the popup closes and the control is touched. */
  protected onHostFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as HTMLElement | null;
    if (
      isInSelectOverlay(next) ||
      next?.closest('.hx-date-range-quick-select-popup') ||
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
      isInSelectOverlay(next) ||
      next.closest('.hx-date-range-quick-select-popup') ||
      this.#host.nativeElement.contains(next)
    )
      return;
    this.close();
    this.markTouched();
  }

  protected markTouched(): void {
    this.#onTouched();
    this.touch.emit();
  }

  #commit(next: HxDateRangeQuickSelectValue): void {
    this.value.set(next);
    this.#onChange(next);
  }
}
