/** Date helpers of the date picker: they work on local calendar days; only `withTime` and `clampTime` look at the time of day. */

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Moves by whole months and clamps the day (31 January + 1 month is the last day of February). */
export function addMonths(date: Date, months: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const last = daysInMonth(target.getFullYear(), target.getMonth());
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), last));
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return (
    !!a &&
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Negative when `a` is before `b`, by day. */
export function compareDays(a: Date, b: Date): number {
  return startOfDay(a).getTime() - startOfDay(b).getTime();
}

/** The same day at the given local time. */
export function withTime(date: Date, hours: number, minutes: number, seconds = 0): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, seconds);
}

/** `date` moved into `min`..`max` (either may be missing), compared including the time of day. */
export function clampTime(date: Date, min?: Date | null, max?: Date | null): Date {
  if (isValidDate(min) && date.getTime() < min.getTime()) return new Date(min);
  if (isValidDate(max) && date.getTime() > max.getTime()) return new Date(max);
  return date;
}

export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

/** The 7 × n cells of a month: `null` before the first and after the last day, a day otherwise. */
export function monthCells(year: number, month: number, firstDayOfWeek: number): (Date | null)[][] {
  const lead = (new Date(year, month, 1).getDay() - firstDayOfWeek + 7) % 7;
  const cells: (Date | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= daysInMonth(year, month); d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const rows: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}
