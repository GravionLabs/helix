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
  forwardRef,
  Injector,
  inject,
  input,
  model,
  numberAttribute,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { clampTime, isValidDate, withTime } from '../internal/dates';
import { parseDateTimeText } from '../internal/field/date-text';
import { nextId } from '../internal/ids';
import { HxTimeRow } from '../internal/time-row/time-row';
import type { TimeOfDay } from '../internal/time-row/time-row-helpers';

export type HxTimePickerValue = Date | null;

/**
 * A time field that opens a time row (hour, minute, optionally second and AM/PM), or with `[inline]="true"` the
 * time row alone. The value is a `Date` that is today at the chosen time; clearing the field gives `null`. Typing
 * parses `14:30`, `2:30 PM` and, with `[showMinutes]="false"`, `14`.
 *
 * ```html
 * <hx-time-picker inputId="alarm" hourFormat="12" showIcon [(ngModel)]="alarm" />
 * <hx-time-picker [showMinutes]="false" [(value)]="opens" />
 * <hx-time-picker inline [stepMinute]="15" ariaLabel="Start" [(value)]="start" />
 * ```
 *
 * It works with `ngModel`, reactive forms and signal forms (`[formField]`). Each column is a `spinbutton`: Arrow Up
 * and Down change it by the step, Page Up and Page Down by a larger step, Home and End go to the first and last
 * value. `minTime` and `maxTime` limit the time of day (only the time of the dates counts). The popup is a non-modal
 * dialog that stays open until Escape, the focus leaves the control or a button of the button bar.
 */
@Component({
  selector: 'hx-time-picker',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, NgTemplateOutlet, HxTimeRow],
  templateUrl: './time-picker.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => HxTimePicker), multi: true },
  ],
  host: {
    class: 'hx-time-picker',
    '[class.hx-time-picker-inline]': 'inline()',
    '[class.hx-time-picker-disabled]': 'isDisabled()',
    '[class.hx-time-picker-invalid]': 'invalid()',
    '[class.hx-time-picker-open]': 'open()',
    '[class.hx-time-picker-has-icon]': 'showIcon() && !inline()',
    '[class.hx-filled]': '!inline() && text() !== ""',
    '(focusout)': 'onHostFocusOut($event)',
  },
})
export class HxTimePicker implements ControlValueAccessor, FormValueControl<HxTimePickerValue> {
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #injector = inject(Injector);

  /** The text field's placeholder. */
  readonly placeholder = input('');
  /** A clock button at the end of the field. */
  readonly showIcon = input(false, { transform: booleanAttribute });
  /** Now and Clear buttons under the time row of the popup. */
  readonly showButtonBar = input(false, { transform: booleanAttribute });
  /** `Intl.DateTimeFormat` options of the text in the field (default: numeric hour, minute, second with the `hourCycle`). */
  readonly dateFormat = input<Intl.DateTimeFormatOptions>();
  readonly nowLabel = input('Now');
  readonly clearLabel = input('Clear');
  readonly chooseLabel = input('Choose time');
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
  readonly stepHour = input(1, { transform: numberAttribute });
  readonly stepMinute = input(1, { transform: numberAttribute });
  readonly stepSecond = input(1, { transform: numberAttribute });
  /** The earliest and latest time of day; only the time of the dates counts. */
  readonly minTime = input<Date | null>(null);
  readonly maxTime = input<Date | null>(null);

  /** Shows the time row in the page. */
  readonly inline = input(false, { transform: booleanAttribute });
  /** A BCP 47 tag for the format and the AM/PM names (default: the browser's). */
  readonly locale = input<string>();
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();

  // The signal-forms contract (FormValueControl): value, disabled, invalid, touch.
  readonly value = model<HxTimePickerValue>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  readonly open = signal(false);
  protected readonly popupId = nextId('hx-time-picker-popup');
  protected readonly positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 2 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -2 },
  ];
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');
  private readonly timeRow = viewChild(HxTimeRow);
  /** The text typed and not yet committed; `null` while the field shows the value. */
  readonly #typed = signal<string | null>(null);
  readonly #cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());
  protected readonly hour12 = computed(() => this.hourFormat() === '12');

  readonly #format = computed(() => {
    const custom = this.dateFormat();
    if (custom) return new Intl.DateTimeFormat(this.locale(), custom);
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      hourCycle: this.hour12() ? 'h12' : 'h23',
    };
    if (this.showMinutes()) options.minute = '2-digit';
    if (this.showMinutes() && this.showSeconds()) options.second = '2-digit';
    return new Intl.DateTimeFormat(this.locale(), options);
  });

  /** The time of day shown in the time row: the value's, or midnight while there is none. */
  protected readonly time = computed<TimeOfDay>(() => {
    const value = this.value();
    const date = isValidDate(value) ? value : null;
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
    const value = this.value();
    return isValidDate(value) ? this.#format().format(value) : '';
  });

  #onChange: (value: HxTimePickerValue) => void = () => {};
  #onTouched: () => void = () => {};

  writeValue(value: HxTimePickerValue): void {
    this.#typed.set(null);
    this.value.set(value ?? null);
  }
  registerOnChange(fn: (value: HxTimePickerValue) => void): void {
    this.#onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.#cvaDisabled.set(disabled);
  }

  /** Focuses the text field, or the first column of an inline time row (signal forms call this to focus the control). */
  focus(): void {
    const field = this.field();
    if (field) field.nativeElement.focus();
    else this.#focusRow();
  }

  /** `date` moved into `minTime`..`maxTime`, comparing only the time of day. */
  #clamp(date: Date): Date {
    const onDay = (limit: Date | null) =>
      isValidDate(limit)
        ? withTime(date, limit.getHours(), limit.getMinutes(), limit.getSeconds())
        : null;
    return clampTime(date, onDay(this.minTime()), onDay(this.maxTime()));
  }

  #outsideRange(date: Date): boolean {
    return this.#clamp(date).getTime() !== date.getTime();
  }

  /** The time row changed a unit: today at that time. */
  protected setTime(time: TimeOfDay): void {
    if (this.isDisabled()) return;
    this.#typed.set(null);
    this.#commit(this.#clamp(withTime(new Date(), time.hours, time.minutes, time.seconds)));
  }

  #commit(next: HxTimePickerValue): void {
    this.value.set(next);
    this.#onChange(next);
  }

  #focusRow(): void {
    afterNextRender(() => this.timeRow()?.focus(), { injector: this.#injector });
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
    this.#focusRow();
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

  /** Parses the typed text; an unreadable time or one outside `minTime`..`maxTime` puts the value back. */
  protected commitTyping(): void {
    const typed = this.#typed();
    if (typed === null) return;
    this.#typed.set(null);
    const text = typed.trim();
    if (text === '') {
      this.#commit(null);
    } else {
      const parsed = parseDateTimeText(text, {
        locale: this.locale(),
        showMinutes: this.showMinutes(),
        timeOnly: true,
        fallbackDay: new Date(),
      });
      if (parsed && !this.#outsideRange(parsed)) this.#commit(parsed);
    }
    // the binding does not change when the value stays: put the field's text back by hand
    const field = this.field();
    if (field) field.nativeElement.value = this.text();
  }

  protected selectNow(): void {
    const now = new Date();
    this.setTime({
      hours: now.getHours(),
      minutes: this.showMinutes() ? now.getMinutes() : 0,
      seconds: this.showMinutes() ? now.getSeconds() : 0,
    });
    this.close(true);
  }

  protected clear(): void {
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
    if (next?.closest('.hx-time-picker-popup') || this.#host.nativeElement.contains(next)) return;
    // an open popup stays open while the focus is on nothing (a click on its padding); leaving for another element closes it
    if (this.open() && !next) return;
    this.#leave();
  }

  /** The focus left an inline time row for something outside the control. */
  protected onInlineFocusOut(event: FocusEvent): void {
    if (!this.inline() || this.#host.nativeElement.contains(event.relatedTarget as Node | null))
      return;
    this.#onTouched();
    this.touch.emit();
  }

  /** The focus left the popup for something outside the control. */
  protected onPopupFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as HTMLElement | null;
    if (!next || next.closest('.hx-time-picker-popup') || this.#host.nativeElement.contains(next))
      return;
    this.#leave();
  }
}
