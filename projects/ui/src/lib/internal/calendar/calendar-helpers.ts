import { addDays, addMonths, compareDays, isSameDay } from '../dates';

export type CalendarView = 'day' | 'month' | 'year';

export interface DisabledRules {
  min?: Date | null;
  max?: Date | null;
  disabledDates?: readonly Date[];
}

/** `2026-9-5`, the `data-date` of a day button. */
export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

/** Whether a day lies outside `min`..`max` (by day) or is one of `disabledDates`. */
export function isDateDisabled(date: Date, rules: DisabledRules): boolean {
  const { min, max, disabledDates = [] } = rules;
  return (
    (!!min && compareDays(date, min) < 0) ||
    (!!max && compareDays(date, max) > 0) ||
    disabledDates.some((d) => isSameDay(d, date))
  );
}

/** Whether a day lies strictly between the two dates of a complete range. */
export function isInRange(date: Date, selected: readonly Date[], mode: string): boolean {
  const [from, to] = selected;
  return (
    mode === 'range' && !!from && !!to && compareDays(date, from) > 0 && compareDays(date, to) < 0
  );
}

/** The focused day after the previous (`-1`) or next (`1`) button of the header: a month, a year or 12 years. */
export function stepFocus(view: CalendarView, current: Date, direction: 1 | -1): Date {
  const months = view === 'day' ? 1 : view === 'month' ? 12 : 144;
  return addMonths(current, months * direction);
}

/** The focused day after choosing a month (`0` to `11`) in the month view. */
export function focusMonth(current: Date, month: number): Date {
  return addMonths(new Date(current.getFullYear(), 0, current.getDate()), month);
}

/** The focused day after choosing a year in the year view. */
export function focusYear(current: Date, year: number): Date {
  return addMonths(new Date(year, current.getMonth(), 1), 0);
}

/** The 12 years of the page that holds `year`. */
export function decadeOf(year: number): number[] {
  const start = Math.floor(year / 12) * 12;
  return Array.from({ length: 12 }, (_, i) => start + i);
}

/** The day a key of the day grid moves the focus to, or `null` for a key that does nothing. */
export function dayKeyTarget(
  key: string,
  date: Date,
  firstDayOfWeek: number,
  shift = false,
): Date | null {
  const weekday = (date.getDay() - firstDayOfWeek + 7) % 7;
  switch (key) {
    case 'ArrowLeft':
      return addDays(date, -1);
    case 'ArrowRight':
      return addDays(date, 1);
    case 'ArrowUp':
      return addDays(date, -7);
    case 'ArrowDown':
      return addDays(date, 7);
    case 'Home':
      return addDays(date, -weekday);
    case 'End':
      return addDays(date, 6 - weekday);
    case 'PageUp':
      return addMonths(date, shift ? -12 : -1);
    case 'PageDown':
      return addMonths(date, shift ? 12 : 1);
    default:
      return null;
  }
}
