import { type HxDateMathUnit, hxParseDateMath } from '../../date-time-range-picker/date-math';

/** A range as two expressions: date math (`now-15m`, `now/d`) or an ISO date-time for an absolute side. */
export interface HxDateRangeExpression {
  from: string;
  to: string;
}

/** An entry of the quick select's "Commonly used" list. */
export interface HxQuickSelectRange extends HxDateRangeExpression {
  label: string;
}

/** The texts of the quick select; `{n}` and `{unit}` are replaced where a text names them. */
export interface HxQuickSelectLabels {
  quickSelect: string;
  last: string;
  next: string;
  amount: string;
  unit: string;
  direction: string;
  apply: string;
  commonlyUsed: string;
  recentlyUsed: string;
  start: string;
  end: string;
  absolute: string;
  relative: string;
  now: string;
  /** The text of the Now tab. */
  nowHint: string;
  /**
   * Shown when Submit cannot apply the range (a relative side next to an empty absolute side, a Relative tab with an
   * empty or invalid amount, a refused day).
   */
  incompleteRange: string;
  /** The label of the typed date on the Absolute tab. */
  date: string;
  /** `Round to the {unit}` (with the singular unit name). */
  roundTo: string;
  /** `Last {n} {unit}` / `Next {n} {unit}` in the Recently used list. */
  lastRange: string;
  nextRange: string;
  /** The plural unit names (`minutes`) and the singular ones (`minute`, for `{n}` = 1 and `roundTo`). */
  units: Record<HxDateMathUnit, string>;
  unitsOne: Record<HxDateMathUnit, string>;
  /** The unit options of the Relative tab: `Minutes ago`, `Minutes from now`. */
  unitsAgo: Record<HxDateMathUnit, string>;
  unitsFromNow: Record<HxDateMathUnit, string>;
}

// Internal: the helpers without the `hx` prefix are shared with the picker but are not part of the public API.

export const QUICK_SELECT_UNITS: readonly HxDateMathUnit[] = ['s', 'm', 'h', 'd', 'w', 'M', 'y'];

/** The English texts of the quick select (the default of `quickSelectLabels`). */
export const HX_QUICK_SELECT_LABELS: HxQuickSelectLabels = {
  quickSelect: 'Quick select',
  last: 'Last',
  next: 'Next',
  amount: 'Amount',
  unit: 'Unit',
  direction: 'Direction',
  apply: 'Apply',
  commonlyUsed: 'Commonly used',
  recentlyUsed: 'Recently used',
  start: 'Start',
  end: 'End',
  absolute: 'Absolute',
  relative: 'Relative',
  now: 'Now',
  nowHint: 'Set to the current time when the range is applied.',
  incompleteRange: 'Choose a start and an end that can be applied.',
  date: 'Date',
  roundTo: 'Round to the {unit}',
  lastRange: 'Last {n} {unit}',
  nextRange: 'Next {n} {unit}',
  units: {
    s: 'seconds',
    m: 'minutes',
    h: 'hours',
    d: 'days',
    w: 'weeks',
    M: 'months',
    y: 'years',
  },
  unitsOne: { s: 'second', m: 'minute', h: 'hour', d: 'day', w: 'week', M: 'month', y: 'year' },
  unitsAgo: {
    s: 'Seconds ago',
    m: 'Minutes ago',
    h: 'Hours ago',
    d: 'Days ago',
    w: 'Weeks ago',
    M: 'Months ago',
    y: 'Years ago',
  },
  unitsFromNow: {
    s: 'Seconds from now',
    m: 'Minutes from now',
    h: 'Hours from now',
    d: 'Days from now',
    w: 'Weeks from now',
    M: 'Months from now',
    y: 'Years from now',
  },
};

/** The default "Commonly used" list (as in Kibana). */
export const HX_QUICK_SELECT_COMMONLY_USED: readonly HxQuickSelectRange[] = [
  { label: 'Today', from: 'now/d', to: 'now/d' },
  { label: 'This week', from: 'now/w', to: 'now/w' },
  { label: 'Last 15 minutes', from: 'now-15m', to: 'now' },
  { label: 'Last 30 minutes', from: 'now-30m', to: 'now' },
  { label: 'Last 1 hour', from: 'now-1h', to: 'now' },
  { label: 'Last 24 hours', from: 'now-24h', to: 'now' },
  { label: 'Last 7 days', from: 'now-7d', to: 'now' },
  { label: 'Last 30 days', from: 'now-30d', to: 'now' },
  { label: 'Last 90 days', from: 'now-90d', to: 'now' },
  { label: 'Last 1 year', from: 'now-1y', to: 'now' },
];

/** How many ranges the "Recently used" list keeps. */
export const RECENT_MAX = 5;

/** The state of one side (start or end) in the quick select: its tab and the fields of the Relative tab. */
export interface QuickSelectSide {
  mode: 'absolute' | 'relative' | 'now';
  amount: number;
  unit: HxDateMathUnit;
  /** `ago` subtracts the amount (`now-15m`), `fromNow` adds it (`now+15m`). */
  direction: 'ago' | 'fromNow';
  /** Rounds to the unit (`now-15m/m`). */
  round: boolean;
  /** An expression from outside that the fields cannot show (`now-1d/d+2h`); used as is until a field changes. */
  raw: string | null;
}

export const DEFAULT_SIDE: QuickSelectSide = {
  mode: 'absolute',
  amount: 15,
  unit: 'm',
  direction: 'ago',
  round: false,
  raw: null,
};

/** A side of the range: `from` (Start) or `to` (End). */
export type Side = 'from' | 'to';
export type SideMode = QuickSelectSide['mode'];
/** The tabs of a side, in their order. */
export const SIDE_MODES: readonly SideMode[] = ['absolute', 'relative', 'now'];
export const ABSOLUTE_SIDES: Readonly<Record<Side, QuickSelectSide>> = {
  from: DEFAULT_SIDE,
  to: DEFAULT_SIDE,
};

const SIMPLE = /^now(?:([+-])(\d+)([smhdwMy]))?(?:\/([smhdwMy]))?$/;

/**
 * The side state for an expression: `now` is the Now tab, `now-15m`, `now+2d/d` or `now/w` the Relative tab,
 * another valid date math expression the Relative tab with `raw`; anything else (an ISO date) is absolute.
 */
export function sideFromExpression(expression: string): QuickSelectSide {
  const text = expression.trim();
  if (text === 'now') return { ...DEFAULT_SIDE, mode: 'now' };
  const match = SIMPLE.exec(text);
  if (match) {
    const [, sign, amount, shiftUnit, roundUnit] = match;
    // a shift and a rounding in different units (`now-1h/d`) cannot be shown by the fields
    if (!shiftUnit || !roundUnit || shiftUnit === roundUnit) {
      return {
        mode: 'relative',
        amount: amount ? Number(amount) : 0,
        unit: (shiftUnit ?? roundUnit) as HxDateMathUnit,
        direction: sign === '+' ? 'fromNow' : 'ago',
        round: !!roundUnit,
        raw: null,
      };
    }
  }
  if (hxParseDateMath(text)) return { ...DEFAULT_SIDE, mode: 'relative', raw: text };
  return { ...DEFAULT_SIDE };
}

/**
 * The date math expression of a relative or now side (`now-15m`, `now+2d/d`); `null` for an absolute side and for
 * a relative side whose amount is empty, not a number or negative (it is not taken as `now`).
 */
export function sideExpression(side: QuickSelectSide): string | null {
  if (side.mode === 'now') return 'now';
  if (side.mode === 'absolute') return null;
  if (side.raw) return side.raw;
  if (!Number.isFinite(side.amount) || side.amount < 0) return null;
  // an amount too big for a plain integer text (1e21) stays in the text, so it is refused when resolved
  const amount = Math.floor(side.amount);
  const shift = amount > 0 ? `${side.direction === 'ago' ? '-' : '+'}${amount}${side.unit}` : '';
  return `now${shift}${side.round ? `/${side.unit}` : ''}`;
}

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Resolves one side: date math against `now` (rounding up for the end), else an ISO date-time; a date-only ISO
 * text (`2026-10-14`) is local midnight, as `new Date(2026, 9, 14)`, not UTC. `null` when unreadable.
 */
export function hxResolveRangeSide(
  expression: string,
  options: { now?: Date; firstDayOfWeek?: number; roundUp?: boolean } = {},
): Date | null {
  const math = hxParseDateMath(expression, options);
  if (math) return math;
  const text = typeof expression === 'string' ? expression.trim() : '';
  const day = DATE_ONLY.exec(text);
  if (day) {
    const [y, m, d] = [Number(day[1]), Number(day[2]) - 1, Number(day[3])];
    const date = new Date(y, m, d);
    // 2026-02-30 rolls over: refuse it
    return date.getFullYear() === y && date.getMonth() === m && date.getDate() === d ? date : null;
  }
  if (!/^\d{4}-\d{2}-\d{2}T/.test(text)) return null;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Resolves a range expression (as the picker's `expression` model holds it) against the current time: `from`
 * rounds down, `to` rounds up (`now/d` to `now/d` is today from 00:00 to 23:59:59.999).
 */
export function hxResolveRangeExpression(
  range: HxDateRangeExpression,
  options: { now?: Date; firstDayOfWeek?: number } = {},
): { from: Date | null; to: Date | null } {
  return {
    from: hxResolveRangeSide(range.from, { ...options, roundUp: false }),
    to: hxResolveRangeSide(range.to, { ...options, roundUp: true }),
  };
}

const fill = (template: string, n: number | string, unit: string) =>
  template.replace('{n}', String(n)).replace('{unit}', unit);

/**
 * A label for a range: the label of a commonly used range with the same expressions, `Last 15 minutes` /
 * `Next 2 days`, else both sides (`now-1d/d - now`, absolute sides through `formatDate`).
 */
export function describeRange(
  range: HxDateRangeExpression,
  labels: HxQuickSelectLabels,
  common: readonly HxQuickSelectRange[],
  formatDate: (date: Date) => string,
  separator = '-',
): string {
  const known = common.find((c) => c.from === range.from && c.to === range.to);
  if (known) return known.label;
  const last = /^now-(\d+)([smhdwMy])$/.exec(range.from);
  const next = /^now\+(\d+)([smhdwMy])$/.exec(range.to);
  const unitName = (n: number, unit: HxDateMathUnit) =>
    n === 1 ? labels.unitsOne[unit] : labels.units[unit];
  if (last && range.to === 'now') {
    const n = Number(last[1]);
    return fill(labels.lastRange, n, unitName(n, last[2] as HxDateMathUnit));
  }
  if (next && range.from === 'now') {
    const n = Number(next[1]);
    return fill(labels.nextRange, n, unitName(n, next[2] as HxDateMathUnit));
  }
  const side = (text: string) => {
    if (hxParseDateMath(text)) return text;
    const date = hxResolveRangeSide(text);
    return date ? formatDate(date) : text;
  };
  return `${side(range.from)} ${separator} ${side(range.to)}`;
}

const isRange = (value: unknown): value is HxDateRangeExpression =>
  !!value &&
  typeof (value as HxDateRangeExpression).from === 'string' &&
  typeof (value as HxDateRangeExpression).to === 'string';

/** The browser storage, or `null` where there is none or touching it throws (blocked cookies, sandbox). */
function storage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/**
 * The recently used ranges stored under `key`: empty when nothing (valid) is stored, `null` when there is no key
 * or the storage cannot be read (blocked), so the caller can keep its in-memory list.
 */
export function readRecentRanges(key: string | null): HxDateRangeExpression[] | null {
  if (!key) return null;
  let text: string | null;
  try {
    const store = storage();
    if (!store) return null;
    text = store.getItem(key);
  } catch {
    return null; // blocked storage
  }
  try {
    const parsed: unknown = JSON.parse(text ?? '[]');
    if (!Array.isArray(parsed)) return [];
    // de-duplicated on read too: an edited or older list may hold the same range twice
    return parsed
      .filter(isRange)
      .reduce<HxDateRangeExpression[]>(
        (list, { from, to }) =>
          list.some((r) => r.from === from && r.to === to) ? list : [...list, { from, to }],
        [],
      )
      .slice(0, RECENT_MAX);
  } catch {
    return []; // damaged data: start empty
  }
}

/** Stores the recently used ranges; does nothing when storage is blocked or full. */
export function writeRecentRanges(
  key: string | null,
  ranges: readonly HxDateRangeExpression[],
): void {
  if (!key) return;
  try {
    storage()?.setItem(key, JSON.stringify(ranges));
  } catch {
    // storage full or blocked: the list just does not survive a reload
  }
}

/** Puts `range` first, drops an equal older entry and keeps at most `max` entries. */
export function addRecentRange(
  ranges: readonly HxDateRangeExpression[],
  range: HxDateRangeExpression,
  max = RECENT_MAX,
): HxDateRangeExpression[] {
  const rest = ranges.filter((r) => r.from !== range.from || r.to !== range.to);
  return [{ from: range.from, to: range.to }, ...rest].slice(0, max);
}
