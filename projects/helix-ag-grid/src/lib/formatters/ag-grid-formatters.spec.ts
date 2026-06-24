import { describe, expect, it } from 'vitest';
import type { AgGridFormatterParams } from './ag-grid-formatters';
import {
  cetDateFormatter,
  cetDateTimeFormatter,
  cetTimeFormatter,
  currencyFormatter,
  intlNumberFormatter,
  numberFormatter,
  rawNumberFormatter,
} from './ag-grid-formatters';

function params<T>(value: T): AgGridFormatterParams<unknown, T> {
  return { value } as AgGridFormatterParams<unknown, T>;
}

// ── numberFormatter ──────────────────────────────────────────────────────────

describe('numberFormatter', () => {
  it('formats a number using toLocaleString', () => {
    const result = numberFormatter(params(1234));
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns empty string for null', () => {
    expect(numberFormatter(params(null))).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(numberFormatter(params(undefined))).toBe('');
  });

  it('returns empty string for NaN', () => {
    expect(numberFormatter(params(Number.NaN))).toBe('');
  });
});

// ── rawNumberFormatter ───────────────────────────────────────────────────────

describe('rawNumberFormatter', () => {
  it('returns raw string representation', () => {
    expect(rawNumberFormatter(params(3.14))).toBe('3.14');
  });

  it('returns empty string for null', () => {
    expect(rawNumberFormatter(params(null))).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(rawNumberFormatter(params(undefined))).toBe('');
  });
});

// ── intlNumberFormatter ──────────────────────────────────────────────────────

describe('intlNumberFormatter', () => {
  const fmt = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2 });

  it('formats using the supplied Intl.NumberFormat', () => {
    expect(intlNumberFormatter(params(1234.5), fmt)).toBe('1.234,50');
  });

  it('returns empty string for null', () => {
    expect(intlNumberFormatter(params(null), fmt)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(intlNumberFormatter(params(undefined), fmt)).toBe('');
  });

  it('returns empty string for NaN', () => {
    expect(intlNumberFormatter(params(Number.NaN), fmt)).toBe('');
  });
});

// ── currencyFormatter ────────────────────────────────────────────────────────

describe('currencyFormatter', () => {
  it('formats with default EUR/de-DE', () => {
    const fmt = currencyFormatter();
    const result = fmt(params(1234.5));
    expect(result).toContain('1.234,50');
    expect(result).toContain('€');
  });

  it('formats with custom currency and locale', () => {
    const fmt = currencyFormatter('USD', 'en-US');
    const result = fmt(params(99.9));
    expect(result).toContain('$');
    expect(result).toContain('99.90');
  });

  it('returns empty string for null', () => {
    expect(currencyFormatter()(params(null))).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(currencyFormatter()(params(undefined))).toBe('');
  });

  it('returns empty string for NaN', () => {
    expect(currencyFormatter()(params(Number.NaN))).toBe('');
  });
});

// ── CET date formatters ──────────────────────────────────────────────────────

// Use a fixed UTC timestamp: 2024-06-15T10:30:45Z
// In Europe/Berlin (UTC+2 in summer) that is 12:30:45 on 15.06.2024
const UTC_DATE = new Date('2024-06-15T10:30:45Z');
const UTC_ISO = '2024-06-15T10:30:45Z';

describe('cetDateFormatter', () => {
  it('formats a Date as dd.MM.yyyy in CET', () => {
    expect(cetDateFormatter(params(UTC_DATE))).toBe('15.06.2024');
  });

  it('formats an ISO string as dd.MM.yyyy in CET', () => {
    expect(cetDateFormatter(params(UTC_ISO))).toBe('15.06.2024');
  });

  it('returns empty string for null', () => {
    expect(cetDateFormatter(params(null))).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(cetDateFormatter(params(undefined))).toBe('');
  });

  it('returns empty string for an invalid date string', () => {
    expect(cetDateFormatter(params('not-a-date'))).toBe('');
  });
});

describe('cetDateTimeFormatter', () => {
  it('formats a Date as dd.MM.yyyy HH:mm:ss in CET', () => {
    expect(cetDateTimeFormatter(params(UTC_DATE))).toBe('15.06.2024 12:30:45');
  });

  it('formats an ISO string as dd.MM.yyyy HH:mm:ss in CET', () => {
    expect(cetDateTimeFormatter(params(UTC_ISO))).toBe('15.06.2024 12:30:45');
  });

  it('returns empty string for null', () => {
    expect(cetDateTimeFormatter(params(null))).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(cetDateTimeFormatter(params(undefined))).toBe('');
  });
});

describe('cetTimeFormatter', () => {
  it('formats a Date as HH:mm in CET', () => {
    expect(cetTimeFormatter(params(UTC_DATE))).toBe('12:30');
  });

  it('formats an ISO string as HH:mm in CET', () => {
    expect(cetTimeFormatter(params(UTC_ISO))).toBe('12:30');
  });

  it('returns empty string for null', () => {
    expect(cetTimeFormatter(params(null))).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(cetTimeFormatter(params(undefined))).toBe('');
  });
});
