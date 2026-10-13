import { startOfDay, withTime } from '../dates';

/** A date from the text: numbers in the order the locale writes them, or `yyyy-mm-dd`. */
export function parseDateText(text: string, locale?: string): Date | null {
  const numbers = text.match(/\d+/g)?.map(Number);
  if (!numbers || numbers.length !== 3) return null;
  let [year, month, day] = [0, 0, 0];
  if (/^\d{4}\D/.test(text.trim())) {
    [year, month, day] = numbers;
  } else {
    const order = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    })
      .formatToParts(new Date(2000, 10, 22))
      .filter((p) => ['day', 'month', 'year'].includes(p.type))
      .map((p) => p.type);
    const byType = Object.fromEntries(order.map((type, i) => [type, numbers[i]]));
    [year, month, day] = [byType['year'], byType['month'], byType['day']];
  }
  if (year < 100) year += 2000;
  const date = new Date(year, month - 1, day);
  const sane =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return sane ? date : null;
}

export interface DateTimeTextOptions {
  locale?: string;
  showMinutes: boolean;
  /** The text is only a time: the day is `fallbackDay`. */
  timeOnly: boolean;
  fallbackDay: Date;
}

/** A date and a time from the text (`10/09/2026, 3:45 PM`), or only a time for `timeOnly`. */
export function parseDateTimeText(text: string, options: DateTimeTextOptions): Date | null {
  const period12 = '(?:\\s*([ap])\\.?\\s*m\\.?)?';
  // hour only: `14` or `2 PM` at the end (with a date before it), else `14:30` or `14:30:05`
  const match = options.showMinutes
    ? new RegExp(`(\\d{1,2}):(\\d{2})(?::(\\d{2}))?${period12}`, 'i').exec(text)
    : new RegExp(`(?:^|[\\s,;T])(\\d{1,2})(?::00(?::00)?)?${period12}\\s*$`, 'i').exec(text);
  if (!match) return null;
  let hours = Number(match[1]);
  const hourOnly = !options.showMinutes;
  const [minutes, seconds] = hourOnly ? [0, 0] : [Number(match[2]), Number(match[3] ?? 0)];
  const period = (hourOnly ? match[2] : match[4])?.toLowerCase();
  if (period) {
    if (hours < 1 || hours > 12) return null;
    hours = (hours % 12) + (period === 'p' ? 12 : 0);
  }
  if (hours > 23 || minutes > 59 || seconds > 59) return null;
  const rest = text.replace(match[0], hourOnly ? ' ' : '').replace(/^[\s,;T]+|[\s,;T]+$/g, '');
  if (/\p{L}/u.test(rest)) return null;
  const day =
    options.timeOnly && rest === ''
      ? startOfDay(options.fallbackDay)
      : parseDateText(rest, options.locale);
  return day && withTime(day, hours, minutes, seconds);
}
