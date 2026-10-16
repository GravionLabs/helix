import { addDays, startOfDay } from '../internal/dates';

/** A relative range in the popup's preset list; `from` and `to` are read when it is chosen (`now` stays current). */
export interface HxDateTimeRangePreset {
  label: string;
  /** Called with the picker's settings, so a calendar range can follow its `firstDayOfWeek`. */
  from: (context?: HxDateTimeRangePresetContext) => Date;
  to: (context?: HxDateTimeRangePresetContext) => Date;
}

export interface HxDateTimeRangePresetContext {
  firstDayOfWeek: number;
}

/** The ends of a preset as a picker takes them: `null` for an empty end, `undefined` when the picker refuses one. */
export type PresetFit = (date: Date, side: 'from' | 'to') => Date | null | undefined;

/**
 * Reads a preset against the current time and fits each end with `fit` (the day only without a time, refused on a
 * disabled day, ...); ends that come out reversed are ordered. `undefined` when `fit` refuses an end.
 */
export function resolvePreset(
  preset: HxDateTimeRangePreset,
  context: HxDateTimeRangePresetContext,
  fit: PresetFit,
): { from: Date | null; to: Date | null } | undefined {
  const from = fit(preset.from(context), 'from');
  const to = fit(preset.to(context), 'to');
  if (from === undefined || to === undefined) return undefined;
  return from && to && to < from ? { from: to, to: from } : { from, to };
}

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
/** The last millisecond of the day, as the date math `roundUp` of `/d` (`now/d` as an end). */
const endOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
/** The week starts on `firstDayOfWeek` (0 = Sunday, the picker's default). */
const startOfWeek = (date: Date, firstDayOfWeek = 0) =>
  addDays(startOfDay(date), -((date.getDay() - firstDayOfWeek + 7) % 7));

/** The built-in ranges by id, in the order of the list. */
const RANGES: Record<HxDateRangePresetId, Pick<HxDateTimeRangePreset, 'from' | 'to'>> = {
  last15Minutes: { from: minutesAgo(15), to: now },
  last1Hour: { from: minutesAgo(60), to: now },
  last6Hours: { from: minutesAgo(360), to: now },
  last24Hours: { from: minutesAgo(1440), to: now },
  last7Days: { from: () => addDays(startOfDay(new Date()), -6), to: now },
  last30Days: { from: () => addDays(startOfDay(new Date()), -29), to: now },
  today: { from: () => startOfDay(new Date()), to: now },
  yesterday: {
    from: () => addDays(startOfDay(new Date()), -1),
    to: () => endOfDay(addDays(new Date(), -1)),
  },
  thisWeek: {
    from: (c) => startOfWeek(new Date(), c?.firstDayOfWeek),
    to: (c) => endOfDay(addDays(startOfWeek(new Date(), c?.firstDayOfWeek), 6)),
  },
  thisMonth: {
    from: () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: () => endOfDay(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)),
  },
};

const DAY_IDS: readonly HxDateRangePresetId[] = ['today', 'last7Days', 'thisMonth'];

const build = (
  ids: readonly HxDateRangePresetId[],
  labels: Partial<Record<HxDateRangePresetId, string>>,
): HxDateTimeRangePreset[] =>
  ids.map((id) => ({ label: labels[id] ?? ENGLISH[id], ...RANGES[id] }));

/**
 * The built-in presets with `labels` in place of the English ones (any id may be left out). `Today`, `Yesterday`,
 * `This week`, `This month` and the day-based `Last 7 days` / `Last 30 days` (calendar days: they start at midnight
 * of the first day, not 7 x 24 hours ago) start at midnight, so they also fit a picker without time pickers;
 * `today` and `Last N days` end now, `yesterday` and the `this ...` ranges end at 23:59:59.999 of their last day.
 */
export function hxDateRangePresets(
  labels: Partial<Record<HxDateRangePresetId, string>> = {},
): HxDateTimeRangePreset[] {
  return build(Object.keys(RANGES) as HxDateRangePresetId[], labels);
}

/** All built-in presets with English labels (a fresh list per call is `hxDateRangePresets()`). */
export const HX_DATE_RANGE_PRESETS: readonly HxDateTimeRangePreset[] = hxDateRangePresets();

/** The day-based built-in presets (no time of day) for a picker without time pickers: Today, Last 7 days, This month. */
export const HX_DATE_RANGE_DAY_PRESETS: readonly HxDateTimeRangePreset[] = build(DAY_IDS, {});
