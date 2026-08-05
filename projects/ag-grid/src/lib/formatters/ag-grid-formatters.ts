import type { ValueFormatterParams } from 'ag-grid-community';

/** Type alias for AG Grid's `ValueFormatterParams`, used by all formatter functions. */
export type AgGridFormatterParams<TData = unknown, TValue = unknown> = ValueFormatterParams<
  TData,
  TValue
>;

// ── Number formatters ──────────────────────────────────────────────────────

/**
 * Formats a numeric cell value using the system locale (`toLocaleString`).
 * Returns `''` for `null`, `undefined`, or `NaN`.
 *
 * @example
 * ```ts
 * { field: 'amount', valueFormatter: numberFormatter }
 * ```
 */
export function numberFormatter(
  params: AgGridFormatterParams<unknown, number | null | undefined>,
): string {
  const v = params.value;
  if (v == null || Number.isNaN(v)) return '';
  return v.toLocaleString();
}

/**
 * Returns the raw string representation of a number without any locale
 * formatting. Returns `''` for `null` or `undefined`.
 *
 * @example
 * ```ts
 * { field: 'id', valueFormatter: rawNumberFormatter }
 * ```
 */
export function rawNumberFormatter(
  params: AgGridFormatterParams<unknown, number | null | undefined>,
): string {
  const v = params.value;
  if (v == null) return '';
  return v.toString();
}

/**
 * Formats a number using a caller-supplied `Intl.NumberFormat` instance,
 * allowing full control over locale, currency, fraction digits, etc.
 * Returns `''` for `null` or `undefined`.
 *
 * @example
 * ```ts
 * const fmt = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2 });
 * { field: 'price', valueFormatter: (p) => intlNumberFormatter(p, fmt) }
 * ```
 */
export function intlNumberFormatter(
  params: AgGridFormatterParams<unknown, number | null | undefined>,
  numberFormat: Intl.NumberFormat,
): string {
  const v = params.value;
  if (v == null || Number.isNaN(v)) return '';
  return numberFormat.format(v);
}

/**
 * Factory that returns a currency formatter closure using `Intl.NumberFormat`
 * with `style: 'currency'`. Defaults to EUR / de-DE.
 * Returns `''` for `null`, `undefined`, or `NaN`.
 *
 * @example
 * ```ts
 * { field: 'revenue', valueFormatter: currencyFormatter() }           // '1.234,50 €'
 * { field: 'price',   valueFormatter: currencyFormatter('USD','en-US') } // '$99.90'
 * ```
 */
export function currencyFormatter(
  currencyCode = 'EUR',
  locale = 'de-DE',
): (params: AgGridFormatterParams<unknown, number | null | undefined>) => string {
  const fmt = new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode });
  return (params) => {
    const v = params.value;
    if (v == null || Number.isNaN(v)) return '';
    return fmt.format(v);
  };
}

// ── CET date formatters ────────────────────────────────────────────────────

type DateInput = Date | string | null | undefined;

function toDate(value: DateInput): Date | null {
  if (value == null) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

const cetDateFormat = new Intl.DateTimeFormat('de-DE', {
  timeZone: 'Europe/Berlin',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const cetDateTimeFormat = new Intl.DateTimeFormat('de-DE', {
  timeZone: 'Europe/Berlin',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

const cetTimeFormat = new Intl.DateTimeFormat('de-DE', {
  timeZone: 'Europe/Berlin',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

/**
 * Formats a `Date` or ISO string as a CET date: `'15.06.2024'`.
 * Returns `''` for `null`, `undefined`, or invalid dates.
 *
 * @example
 * ```ts
 * { field: 'date', valueFormatter: cetDateFormatter }
 * ```
 */
export function cetDateFormatter(params: AgGridFormatterParams<unknown, DateInput>): string {
  const d = toDate(params.value);
  return d ? cetDateFormat.format(d) : '';
}

/**
 * Formats a `Date` or ISO string as a CET date-time: `'15.06.2024 12:30:00'`.
 * Returns `''` for `null`, `undefined`, or invalid dates.
 *
 * @example
 * ```ts
 * { field: 'updatedAt', valueFormatter: cetDateTimeFormatter }
 * ```
 */
export function cetDateTimeFormatter(params: AgGridFormatterParams<unknown, DateInput>): string {
  const d = toDate(params.value);
  if (!d) return '';
  // Intl formats date and time parts separated by ', ' in de-DE — replace with ' '
  return cetDateTimeFormat.format(d).replace(', ', ' ');
}

/**
 * Formats a `Date` or ISO string as a CET time: `'12:30'`.
 * Returns `''` for `null`, `undefined`, or invalid dates.
 *
 * @example
 * ```ts
 * { field: 'startTime', valueFormatter: cetTimeFormatter }
 * ```
 */
export function cetTimeFormatter(params: AgGridFormatterParams<unknown, DateInput>): string {
  const d = toDate(params.value);
  return d ? cetTimeFormat.format(d) : '';
}
