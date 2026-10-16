import { addDays, startOfDay } from '../internal/dates';
import type { HxDateTimeRangePreset } from './date-time-range-picker';

/** The ids of the built-in presets; `hxDateRangePresets` takes a label per id. */
export type HxDateRangePresetId =
  | 'last15Minutes'
  | 'last1Hour'
  | 'last6Hours'
  | 'last24Hours'
  | 'last7Days'
  | 'last30Days'
  | 'today'
  | 'yesterday'
  | 'thisWeek'
  | 'thisMonth';

const ENGLISH: Record<HxDateRangePresetId, string> = {
  last15Minutes: 'Last 15 minutes',
  last1Hour: 'Last 1 hour',
  last6Hours: 'Last 6 hours',
  last24Hours: 'Last 24 hours',
  last7Days: 'Last 7 days',
  last30Days: 'Last 30 days',
  today: 'Today',
  yesterday: 'Yesterday',
  thisWeek: 'This week',
  thisMonth: 'This month',
};

const minutesAgo = (minutes: number) => () => new Date(Date.now() - minutes * 60_000);
const now = () => new Date();
const endOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
/** The week starts on `firstDayOfWeek` (0 = Sunday, the picker's default). */
const startOfWeek = (date: Date, firstDayOfWeek = 0) =>
  addDays(startOfDay(date), -((date.getDay() - firstDayOfWeek + 7) % 7));

/**
 * The built-in presets with `labels` in place of the English ones (any id may be left out). `Today`, `Yesterday`,
 * `This week`, `This month` and the day-based `Last N days` start at midnight, so they also fit a picker without
 * time pickers; `today` ends now, `yesterday` and the `this ...` ranges end at 23:59:59 of their last day.
 */
export function hxDateRangePresets(
  labels: Partial<Record<HxDateRangePresetId, string>> = {},
): HxDateTimeRangePreset[] {
  const label = (id: HxDateRangePresetId) => labels[id] ?? ENGLISH[id];
  return [
    { label: label('last15Minutes'), from: minutesAgo(15), to: now },
    { label: label('last1Hour'), from: minutesAgo(60), to: now },
    { label: label('last6Hours'), from: minutesAgo(360), to: now },
    { label: label('last24Hours'), from: minutesAgo(1440), to: now },
    { label: label('last7Days'), from: () => addDays(startOfDay(new Date()), -6), to: now },
    { label: label('last30Days'), from: () => addDays(startOfDay(new Date()), -29), to: now },
    { label: label('today'), from: () => startOfDay(new Date()), to: now },
    {
      label: label('yesterday'),
      from: () => addDays(startOfDay(new Date()), -1),
      to: () => endOfDay(addDays(new Date(), -1)),
    },
    {
      label: label('thisWeek'),
      from: (c) => startOfWeek(new Date(), c?.firstDayOfWeek),
      to: (c) => endOfDay(addDays(startOfWeek(new Date(), c?.firstDayOfWeek), 6)),
    },
    {
      label: label('thisMonth'),
      from: () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: () => endOfDay(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)),
    },
  ];
}

/** All built-in presets with English labels (a fresh list per call is `hxDateRangePresets()`). */
export const HX_DATE_RANGE_PRESETS: readonly HxDateTimeRangePreset[] = hxDateRangePresets();

/** The day-based built-in presets (no time of day) for a picker without time pickers: Today, Last 7 days, This month. */
export const HX_DATE_RANGE_DAY_PRESETS: readonly HxDateTimeRangePreset[] =
  HX_DATE_RANGE_PRESETS.filter((p) => ['Today', 'Last 7 days', 'This month'].includes(p.label));
