import { ValidatorKey } from '@helix/core/validators';
import { type ZodIssue, ZodIssueCode } from 'zod';

// Mirrors Validators' internal EMPTY_VALUES — defined locally to avoid
// depending on unexported internals of @helix/core.
export const EMPTY_VALUES: unknown[] = ['', null, undefined];
export const isEmptyValue = (v: unknown): boolean => EMPTY_VALUES.includes(v);

/**
 * Maps a single `ZodIssue` to the corresponding `ValidatorKey`.
 *
 * NOTE: Zod v4 breaking changes accounted for here:
 *   - `invalid_string` → `invalid_format` with `format` property (not `validation`)
 *   - `too_small`/`too_big` use `origin` instead of `type`
 *   - `not_integer` removed → `invalid_type` with `expected: 'int'`
 *   - `invalid_type` for null/undefined no longer has a `received` field;
 *     detected via the `value` parameter instead
 *
 * Returns `null` for issue codes with no automatic mapping — caller handles
 * these via `fallbackKey` (Option B).
 */
export function zodIssueToHelixKey(issue: ZodIssue, value: unknown): ValidatorKey | null {
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      // Zod v4 dropped the `received` field on invalid_type issues.
      // Detect required (null/undefined) errors by checking the control value directly.
      if (isEmptyValue(value)) return ValidatorKey.Required;
      // integer: Zod v4 changed not_integer → invalid_type { expected: 'int' }
      if ((issue as { expected: string }).expected === 'int') return ValidatorKey.Integer;
      // numeric type mismatch
      if (
        (issue as { expected: string }).expected === 'number' ||
        (issue as { expected: string }).expected === 'float'
      ) {
        return ValidatorKey.Number;
      }
      return null;

    case ZodIssueCode.invalid_format:
      // Zod v4: replaces invalid_string for all format-based string validations.
      // The `format` property holds the validation name.
      {
        const fmt = (issue as { format: string }).format;
        if (fmt === 'email') return ValidatorKey.Email;
        if (fmt === 'regex') return ValidatorKey.Pattern;
        if (fmt === 'datetime' || fmt === 'date' || fmt === 'time') return ValidatorKey.Date;
      }
      return null;

    case ZodIssueCode.too_small:
      // Zod v4: uses `origin` instead of `type` to identify the validated construct.
      {
        const origin = (issue as { origin: string }).origin;
        if (origin === 'string' || origin === 'array') return ValidatorKey.MinLength;
        if (origin === 'number') return ValidatorKey.Min;
      }
      return null;

    case ZodIssueCode.too_big:
      {
        const origin = (issue as { origin: string }).origin;
        if (origin === 'string' || origin === 'array') return ValidatorKey.MaxLength;
        if (origin === 'number') return ValidatorKey.Max;
      }
      return null;

    case ZodIssueCode.custom:
      return null; // must be handled via fallbackKey (Option B)

    default:
      return null;
  }
}
