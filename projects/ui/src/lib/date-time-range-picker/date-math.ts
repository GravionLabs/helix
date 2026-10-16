import { addMonths } from '../internal/dates';

/** A date math unit: second, minute, hour, day, week, Month (capital M, as in Kibana), year. */
export type HxDateMathUnit = 's' | 'm' | 'h' | 'd' | 'w' | 'M' | 'y';

/** Options for {@link hxParseDateMath}. */
export interface HxDateMathOptions {
  /** The instant `now` resolves to. Defaults to the current time. */
  now?: Date;
  /** The weekday a week starts on for `/w` (0 = Sunday, the default; 1 = Monday). */
  firstDayOfWeek?: number;
  /** Round `/unit` up to the last millisecond of the unit instead of down to its start (use for a range's end). */
  roundUp?: boolean;
}

const EXPRESSION = /^now((?:[+-]\d+[smhdwMy]|\/[smhdwMy])*)$/;
const TOKEN = /([+-])(\d+)([smhdwMy])|\/([smhdwMy])/g;
const MS: Record<'s' | 'm' | 'h', number> = { s: 1000, m: 60_000, h: 3_600_000 };

function add(date: Date, amount: number, unit: HxDateMathUnit): Date {
  switch (unit) {
    case 's':
    case 'm':
    case 'h':
      return new Date(date.getTime() + amount * MS[unit]);
    case 'd':
    case 'w': {
      // Calendar days, so the wall-clock time survives a DST change.
      const result = new Date(date);
      result.setDate(result.getDate() + amount * (unit === 'w' ? 7 : 1));
      return result;
    }
    case 'M':
      return addMonthsKeepingTime(date, amount);
    case 'y':
      return addMonthsKeepingTime(date, amount * 12);
  }
}

/** Like `addMonths` (clamps the day) but keeps the time of day. */
function addMonthsKeepingTime(date: Date, months: number): Date {
  const day = addMonths(date, months);
  day.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
  return day;
}

function startOf(date: Date, unit: HxDateMathUnit, firstDayOfWeek: number): Date {
  const [y, mo, d, h, mi, s] = [
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];
  switch (unit) {
    case 's':
      return new Date(y, mo, d, h, mi, s);
    case 'm':
      return new Date(y, mo, d, h, mi);
    case 'h':
      return new Date(y, mo, d, h);
    case 'd':
      return new Date(y, mo, d);
    case 'w':
      return new Date(y, mo, d - ((date.getDay() - firstDayOfWeek + 7) % 7));
    case 'M':
      return new Date(y, mo, 1);
    case 'y':
      return new Date(y, 0, 1);
  }
}

function round(date: Date, unit: HxDateMathUnit, options: HxDateMathOptions): Date {
  const start = startOf(date, unit, options.firstDayOfWeek ?? 0);
  if (!options.roundUp) return start;
  return new Date(add(start, 1, unit).getTime() - 1);
}

/**
 * Resolves a Kibana-style date math expression to a Date, or returns `null` when it is invalid (never throws).
 *
 * The expression is `now` followed by any number of adjustments: `+N<unit>` / `-N<unit>` shift by N units and
 * `/<unit>` rounds down to the start of the unit (or up to its last millisecond with `roundUp`). Units are
 * `s m h d w M y`, case-sensitive (`m` is minutes, `M` is months). Examples: `now`, `now-15m`, `now+2d`, `now/d`,
 * `now/w`, `now-1d/d`. Surrounding whitespace is ignored; the anchor must be `now`, amounts are non-negative
 * integers. Day, week, month and year shifts are calendar based (DST-safe); a month shift that overshoots clamps to
 * the last day of the target month (31 Mar - 1M = 28/29 Feb). `/w` honors `firstDayOfWeek`.
 */
export function hxParseDateMath(expression: string, options: HxDateMathOptions = {}): Date | null {
  const match = typeof expression === 'string' ? EXPRESSION.exec(expression.trim()) : null;
  const now = options.now ?? new Date();
  if (!match || Number.isNaN(now.getTime())) return null;

  let result = new Date(now);
  for (const token of match[1].matchAll(TOKEN)) {
    const [, sign, amount, shiftUnit, roundUnit] = token;
    result = roundUnit
      ? round(result, roundUnit as HxDateMathUnit, options)
      : add(result, (sign === '-' ? -1 : 1) * Number(amount), shiftUnit as HxDateMathUnit);
    if (Number.isNaN(result.getTime())) return null;
  }
  return result;
}

/**
 * The from/to expressions of a "Last N" or "Next N" range: `{ from: 'now-15m', to: 'now' }` for
 * `('last', 15, 'm')`, `{ from: 'now', to: 'now+2d' }` for `('next', 2, 'd')`. The amount must be a positive
 * integer, otherwise `null` is returned.
 */
export function hxRelativeRangeExpressions(
  direction: 'last' | 'next',
  amount: number,
  unit: HxDateMathUnit,
): { from: string; to: string } | null {
  if (!Number.isInteger(amount) || amount < 1) return null;
  return direction === 'last'
    ? { from: `now-${amount}${unit}`, to: 'now' }
    : { from: 'now', to: `now+${amount}${unit}` };
}
