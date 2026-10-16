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
import {
  type HxDateMathUnit,
  hxParseDateMath,
  hxRelativeRangeExpressions,
} from '../date-time-range-picker/date-math';
import { HxInput } from '../input/input';
import { clampTime, isValidDate } from '../internal/dates';
import { nextId } from '../internal/ids';
import {
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
  readRecentRanges,
  type Side,
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

/**
 * A Kibana-style quick select for a date range: one read-only field with a button that opens a compact popup with
 * *Quick select* (Last/Next N unit, Apply), *Commonly used*, *Recently used* (the last five applied ranges, kept in
 * `localStorage` under `recentStorageKey`) and one summary line each for the start and the end.
 *
 * ```html
 * <hx-date-range-quick-select [(ngModel)]="range" [(expression)]="expression" />
 * ```
 *
 * Apply and a click on a commonly or recently used range commit the range at once and close the popup. Date math
 * (`now-15m`, `now/d`) is resolved against the current time when the range is applied; the value is
 * `{ from, to }` (moved into `minDate`..`maxDate`) and the expressions are in the `expression` model (`null` for an
 * absolute range). A range that cannot be applied (an amount out of range, an unreadable side) keeps the popup open
 * with an inline message. It works with `ngModel`, reactive forms and signal forms (`[formField]`).
 */
@Component({
  selector: 'hx-date-range-quick-select',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, HxInput, HxSelect],
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
  protected readonly sideKeys: readonly Side[] = ['from', 'to'];
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

  /** Escape closes the innermost open layer (in the compact view: the popup). */
  protected onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close(true);
    }
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
   * The summary line of a side: the relative side of the expression (`~ 15 minutes ago`, `now`), else the date of
   * the value, else `Not set`.
   */
  protected sideSummary(side: Side): string {
    const expression = this.expression();
    const relative = expression
      ? describeSide(sideFromExpression(expression[side]), this.texts())
      : null;
    if (relative !== null) return relative;
    const date = this.value()[side];
    return date ? this.#formatDate(date) : this.texts().emptySide;
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
