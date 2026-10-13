export type TimeUnit = 'hour' | 'minute' | 'second' | 'period';

export interface TimeColumn {
  unit: TimeUnit;
  label: string;
  now: number;
  min: number;
  max: number;
  text: string;
  valueText: string;
}

export interface TimeOfDay {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface TimeColumnOptions {
  hour12: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  locale?: string;
  labels: { hour: string; minute: string; second: string; period: string };
}

export interface TimeSteps {
  hour: number;
  minute: number;
  second: number;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** The spinbutton columns of a time row: hour, minute, second, AM/PM as the options ask. */
export function buildTimeColumns(time: TimeOfDay, options: TimeColumnOptions): TimeColumn[] {
  const { hours, minutes, seconds } = time;
  const { hour12: twelve, labels } = options;
  const hourNow = twelve ? hours % 12 || 12 : hours;
  const columns: TimeColumn[] = [
    {
      unit: 'hour',
      label: labels.hour,
      now: hourNow,
      min: twelve ? 1 : 0,
      max: twelve ? 12 : 23,
      text: pad(hourNow),
      valueText: String(hourNow),
    },
  ];
  if (options.showMinutes) {
    columns.push({
      unit: 'minute',
      label: labels.minute,
      now: minutes,
      min: 0,
      max: 59,
      text: pad(minutes),
      valueText: String(minutes),
    });
  }
  if (options.showMinutes && options.showSeconds) {
    columns.push({
      unit: 'second',
      label: labels.second,
      now: seconds,
      min: 0,
      max: 59,
      text: pad(seconds),
      valueText: String(seconds),
    });
  }
  if (twelve) {
    const parts = new Intl.DateTimeFormat(options.locale, { hour: 'numeric', hourCycle: 'h12' });
    const period = (h: number) =>
      parts.formatToParts(new Date(2026, 0, 1, h)).find((p) => p.type === 'dayPeriod')?.value ??
      (h < 12 ? 'AM' : 'PM');
    const pm = hours >= 12 ? 1 : 0;
    columns.push({
      unit: 'period',
      label: labels.period,
      now: pm,
      min: 0,
      max: 1,
      text: period(pm ? 12 : 0),
      valueText: period(pm ? 12 : 0),
    });
  }
  return columns;
}

/** The values a time unit can take: from its minimum in steps, up to its maximum. */
export function unitValues(column: TimeColumn, steps: TimeSteps): number[] {
  const step =
    column.unit === 'hour'
      ? steps.hour
      : column.unit === 'minute'
        ? steps.minute
        : column.unit === 'second'
          ? steps.second
          : 1;
  const values: number[] = [];
  for (let v = column.min; v <= column.max; v += Math.max(1, step || 1)) values.push(v);
  return values;
}

/** The next (`1`) or previous (`-1`) value of a column's steps, wrapping around. */
export function nextUnitValue(column: TimeColumn, steps: TimeSteps, direction: 1 | -1): number {
  const values = unitValues(column, steps);
  return direction > 0
    ? (values.find((v) => v > column.now) ?? values[0])
    : (values.filter((v) => v < column.now).pop() ?? values[values.length - 1]);
}

/** The time with one unit set (in the units shown: 1 to 12 with AM/PM). */
export function applyUnit(
  time: TimeOfDay,
  unit: TimeUnit,
  value: number,
  hour12: boolean,
): TimeOfDay {
  const { hours } = time;
  switch (unit) {
    case 'hour':
      return { ...time, hours: hour12 ? (value % 12) + (hours >= 12 ? 12 : 0) : value };
    case 'minute':
      return { ...time, minutes: value };
    case 'second':
      return { ...time, seconds: value };
    default:
      return { ...time, hours: (hours % 12) + (value ? 12 : 0) };
  }
}

/** The value a key of a spinbutton jumps to (Page Up/Down, Home, End), or `null` for another key. */
export function jumpKeyTarget(key: string, column: TimeColumn, steps: TimeSteps): number | null {
  const values = unitValues(column, steps);
  const page = column.unit === 'hour' ? 6 : 10;
  const nearest = (target: number) =>
    values.reduce((best, v) => (Math.abs(v - target) < Math.abs(best - target) ? v : best));
  switch (key) {
    case 'PageUp':
      return nearest(Math.min(column.max, column.now + page));
    case 'PageDown':
      return nearest(Math.max(column.min, column.now - page));
    case 'Home':
      return values[0];
    case 'End':
      return values[values.length - 1];
    default:
      return null;
  }
}
