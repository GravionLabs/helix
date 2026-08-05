import type { ValueParserParams } from 'ag-grid-community';
import { describe, expect, it } from 'vitest';
import { coerceValue, numberValueParser, parseNumber, parseNumberValue } from './number-parsers';

// ── coerceValue ──────────────────────────────────────────────────────────────

describe('coerceValue', () => {
  it('returns the value when within bounds', () => {
    expect(coerceValue(5, { min: 0, max: 10 })).toBe(5);
  });

  it('returns the value when no bounds are set', () => {
    expect(coerceValue(999)).toBe(999);
  });

  it('returns null for null', () => {
    expect(coerceValue(null)).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(coerceValue(undefined)).toBeNull();
  });

  it('returns null for NaN', () => {
    expect(coerceValue(Number.NaN)).toBeNull();
  });

  it('returns null when value is below min', () => {
    expect(coerceValue(5, { min: 10 })).toBeNull();
  });

  it('returns null when value is above max', () => {
    expect(coerceValue(15, { max: 10 })).toBeNull();
  });

  it('accepts a value equal to min', () => {
    expect(coerceValue(10, { min: 10 })).toBe(10);
  });

  it('accepts a value equal to max', () => {
    expect(coerceValue(10, { max: 10 })).toBe(10);
  });
});

// ── parseNumber ──────────────────────────────────────────────────────────────

describe('parseNumber', () => {
  it('parses a German-locale number string', () => {
    expect(parseNumber('1.234,56', 'de-DE')).toBe(1234.56);
  });

  it('parses an English-locale number string', () => {
    expect(parseNumber('1,234.56', 'en-US')).toBe(1234.56);
  });

  it('returns null for empty string', () => {
    expect(parseNumber('', 'de-DE')).toBeNull();
  });

  it('returns null for null', () => {
    expect(parseNumber(null, 'de-DE')).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(parseNumber(undefined, 'de-DE')).toBeNull();
  });

  it('applies min/max options', () => {
    expect(parseNumber('5', 'de-DE', { min: 10 })).toBeNull();
    expect(parseNumber('15', 'de-DE', { max: 10 })).toBeNull();
    expect(parseNumber('5', 'de-DE', { min: 0, max: 10 })).toBe(5);
  });
});

// ── parseNumberValue ─────────────────────────────────────────────────────────

describe('parseNumberValue', () => {
  it('parses a plain integer string', () => {
    expect(parseNumberValue('42')).toBe(42);
  });

  it('parses a decimal string with dot separator', () => {
    expect(parseNumberValue('3.14')).toBe(3.14);
  });

  it('parses a German decimal string (comma separator)', () => {
    expect(parseNumberValue('1.234,56')).toBe(1234.56);
  });

  it('parses a simple comma decimal', () => {
    expect(parseNumberValue('3,14')).toBeCloseTo(3.14);
  });

  it('returns null for empty string', () => {
    expect(parseNumberValue('')).toBeNull();
  });

  it('returns null for null', () => {
    expect(parseNumberValue(null)).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(parseNumberValue(undefined)).toBeNull();
  });

  it('returns null for non-numeric string', () => {
    expect(parseNumberValue('abc')).toBeNull();
  });

  it('applies options bounds', () => {
    expect(parseNumberValue('5', { min: 10 })).toBeNull();
    expect(parseNumberValue('5', { min: 0, max: 10 })).toBe(5);
  });

  it('trims whitespace', () => {
    expect(parseNumberValue('  7  ')).toBe(7);
  });
});

// ── numberValueParser ────────────────────────────────────────────────────────

describe('numberValueParser', () => {
  function vp(newValue: unknown): ValueParserParams {
    return { newValue } as ValueParserParams;
  }

  it('parses the newValue from params', () => {
    expect(numberValueParser(vp('3.14'))).toBe(3.14);
  });

  it('returns null for null newValue', () => {
    expect(numberValueParser(vp(null))).toBeNull();
  });

  it('applies options', () => {
    expect(numberValueParser(vp('5'), { max: 4 })).toBeNull();
    expect(numberValueParser(vp('5'), { max: 10 })).toBe(5);
  });
});
