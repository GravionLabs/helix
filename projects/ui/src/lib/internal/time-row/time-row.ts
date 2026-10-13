import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import {
  applyUnit,
  buildTimeColumns,
  jumpKeyTarget,
  nextUnitValue,
  type TimeColumn,
  type TimeOfDay,
} from './time-row-helpers';

/**
 * The time row of `hx-date-picker`: one spinbutton column per unit (hour, minute, second, AM/PM) with the arrow
 * buttons and the keys. It holds no value: the picker passes the time in and takes `timeChange` out.
 */
@Component({
  selector: 'hx-time-row',
  templateUrl: './time-row.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
})
export class HxTimeRow {
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** The time of day shown. */
  readonly time = input.required<TimeOfDay>();
  readonly hour12 = input(false);
  readonly showMinutes = input(true);
  readonly showSeconds = input(false);
  readonly stepHour = input(1);
  readonly stepMinute = input(1);
  readonly stepSecond = input(1);
  readonly locale = input<string>();
  readonly disabled = input(false);
  readonly timeLabel = input('Time');
  readonly hourLabel = input('Hour');
  readonly minuteLabel = input('Minute');
  readonly secondLabel = input('Second');
  readonly periodLabel = input('AM/PM');

  /** A column changed: the whole time of day with the new unit. */
  readonly timeChange = output<TimeOfDay>();

  readonly #steps = computed(() => ({
    hour: this.stepHour(),
    minute: this.stepMinute(),
    second: this.stepSecond(),
  }));

  protected readonly columns = computed<TimeColumn[]>(() =>
    buildTimeColumns(this.time(), {
      hour12: this.hour12(),
      showMinutes: this.showMinutes(),
      showSeconds: this.showSeconds(),
      locale: this.locale(),
      labels: {
        hour: this.hourLabel(),
        minute: this.minuteLabel(),
        second: this.secondLabel(),
        period: this.periodLabel(),
      },
    }),
  );

  /** Moves the focus to the first spinbutton. */
  focus(): void {
    this.#host.nativeElement.querySelector<HTMLElement>('.hx-date-picker-time-spin')?.focus();
  }

  #set(column: TimeColumn, value: number): void {
    if (this.disabled()) return;
    this.timeChange.emit(applyUnit(this.time(), column.unit, value, this.hour12()));
  }

  /** Moves a column to the next (`1`) or previous (`-1`) value of its steps, wrapping around. */
  protected stepTime(column: TimeColumn, direction: 1 | -1): void {
    this.#set(column, nextUnitValue(column, this.#steps(), direction));
  }

  protected onTimeKeydown(event: KeyboardEvent, column: TimeColumn): void {
    if (this.disabled()) return;
    if (event.key === 'ArrowUp') this.stepTime(column, 1);
    else if (event.key === 'ArrowDown') this.stepTime(column, -1);
    else {
      const target = jumpKeyTarget(event.key, column, this.#steps());
      if (target === null) return;
      this.#set(column, target);
    }
    event.preventDefault();
  }
}
