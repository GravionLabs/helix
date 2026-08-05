import type { ValueParserParams } from 'ag-grid-community';

/** Bounds for number validation. */
export interface ParseNumberOptions {
  min?: number;
  max?: number;
}

/**
 * Validates a number against optional `min`/`max` bounds.
 * Returns `null` if the value is `null`, `undefined`, `NaN`, or out of bounds.
 *
 * @example
 * ```ts
 * coerceValue(5, { min: 0, max: 10 })  // → 5
 * coerceValue(15, { max: 10 })         // → null
 * coerceValue(null)                    // → null
 * ```
 */
export function coerceValue(
  value: number | null | undefined,
  options?: ParseNumberOptions,
): number | null {
  if (value == null || Number.isNaN(value)) return null;
  if (options?.min != null && value < options.min) return null;
  if (options?.max != null && value > options.max) return null;
  return value;
}

/**
 * Locale-aware string-to-number parser.
 * Handles thousand separators and decimal commas for the given locale.
 * Returns `null` for empty, `null`, or `undefined` input.
 *
 * @example
 * ```ts
 * parseNumber('1.234,56', 'de-DE') // → 1234.56
 * parseNumber('1,234.56', 'en-US') // → 1234.56
 * ```
 */
export function parseNumber(
  value: string | null | undefined,
  locale: string,
  options?: ParseNumberOptions,
): number | null {
  if (value == null || value.trim() === '') return null;

  // Derive separators from the locale
  const parts = new Intl.NumberFormat(locale).formatToParts(1234.5);
  const group = parts.find((p) => p.type === 'group')?.value ?? '';
  const decimal = parts.find((p) => p.type === 'decimal')?.value ?? '.';

  const normalised = value.trim().replaceAll(group, '').replace(decimal, '.');

  const n = Number.parseFloat(normalised);
  return coerceValue(n, options);
}

/**
 * Smart string-to-number parser that detects the decimal separator
 * automatically:
 * - Strings containing a comma (e.g. `'1.234,56'` from spreadsheet paste)
 *   are parsed as German locale (`de-DE`).
 * - All other strings (e.g. `'3.14'` from keyboard input) are parsed with
 *   `parseFloat`.
 *
 * Returns `null` for empty, `null`, or `undefined` input.
 *
 * @example
 * ```ts
 * parseNumberValue('42')        // → 42
 * parseNumberValue('3.14')      // → 3.14
 * parseNumberValue('1.234,56')  // → 1234.56  (German paste)
 * parseNumberValue(null)        // → null
 * parseNumberValue('5', { min: 10 }) // → null (out of bounds)
 * ```
 */
export function parseNumberValue(
  value: string | null | undefined,
  options?: ParseNumberOptions,
): number | null {
  if (value == null || value.trim() === '') return null;

  const hasComma = value.includes(',');
  if (hasComma) {
    return parseNumber(value, 'de-DE', options);
  }

  const n = Number.parseFloat(value.trim());
  return coerceValue(n, options);
}

/**
 * AG Grid `valueParser` adapter — wraps `parseNumberValue` to read
 * `params.newValue`. Drop-in for any editable numeric column.
 *
 * @example
 * ```ts
 * { field: 'quantity', editable: true, valueParser: numberValueParser }
 * // or with bounds:
 * { field: 'pct', editable: true, valueParser: (p) => numberValueParser(p, { min: 0, max: 100 }) }
 * ```
 */
export function numberValueParser(
  params: ValueParserParams,
  options?: ParseNumberOptions,
): number | null {
  return parseNumberValue(params.newValue as string | null | undefined, options);
}
