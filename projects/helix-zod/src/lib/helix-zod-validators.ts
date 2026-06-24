import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { HelixValidatorKey } from '@gravionlabs/helix';
import { type ZodIssue, ZodIssueCode, type ZodSchema } from 'zod';

// Declared by Angular's build toolchain — true in development, false in production.
declare const ngDevMode: boolean | undefined;

// Mirrors HelixValidators' internal EMPTY_VALUES — defined locally to avoid
// depending on unexported internals of @gravionlabs/helix.
const EMPTY_VALUES: unknown[] = ['', null, undefined];
const isEmptyValue = (v: unknown): boolean => EMPTY_VALUES.includes(v);

export interface ZodHelixOptions {
  /**
   * Required when the schema contains `.refine()` or `.superRefine()`.
   * Those produce `ZodIssueCode.custom` which has no automatic `HelixValidatorKey`
   * mapping. The bridge throws a descriptive error in development (`ngDevMode`)
   * and skips silently in production when this is missing and a custom issue occurs.
   *
   * @example
   * HelixZodValidators.fromZod(
   *   z.string().refine(v => !banned.includes(v), 'Not allowed'),
   *   { fallbackKey: HelixValidatorKey.Pattern },
   * )
   */
  fallbackKey?: HelixValidatorKey;

  /**
   * When `true` (default), empty values (`''`, `null`, `undefined`) bypass Zod
   * and return `null` — matching `HelixValidators`' default `allowEmpty = true`.
   * Set to `false` to let Zod validate empty values (e.g. for required fields).
   */
  allowEmpty?: boolean;
}

/**
 * Maps a single `ZodIssue` to the corresponding `HelixValidatorKey`.
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
function zodIssueToHelixKey(issue: ZodIssue, value: unknown): HelixValidatorKey | null {
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      // Zod v4 dropped the `received` field on invalid_type issues.
      // Detect required (null/undefined) errors by checking the control value directly.
      if (isEmptyValue(value)) return HelixValidatorKey.Required;
      // integer: Zod v4 changed not_integer → invalid_type { expected: 'int' }
      if ((issue as { expected: string }).expected === 'int') return HelixValidatorKey.Integer;
      // numeric type mismatch
      if (
        (issue as { expected: string }).expected === 'number' ||
        (issue as { expected: string }).expected === 'float'
      ) {
        return HelixValidatorKey.Number;
      }
      return null;

    case ZodIssueCode.invalid_format:
      // Zod v4: replaces invalid_string for all format-based string validations.
      // The `format` property holds the validation name.
      {
        const fmt = (issue as { format: string }).format;
        if (fmt === 'email') return HelixValidatorKey.Email;
        if (fmt === 'regex') return HelixValidatorKey.Pattern;
        if (fmt === 'datetime' || fmt === 'date' || fmt === 'time') return HelixValidatorKey.Date;
      }
      return null;

    case ZodIssueCode.too_small:
      // Zod v4: uses `origin` instead of `type` to identify the validated construct.
      {
        const origin = (issue as { origin: string }).origin;
        if (origin === 'string' || origin === 'array') return HelixValidatorKey.MinLength;
        if (origin === 'number') return HelixValidatorKey.Min;
      }
      return null;

    case ZodIssueCode.too_big:
      {
        const origin = (issue as { origin: string }).origin;
        if (origin === 'string' || origin === 'array') return HelixValidatorKey.MaxLength;
        if (origin === 'number') return HelixValidatorKey.Max;
      }
      return null;

    case ZodIssueCode.custom:
      return null; // must be handled via fallbackKey (Option B)

    default:
      return null;
  }
}

export const HelixZodValidators = {
  /**
   * Converts a Zod field schema into a Helix-compatible Angular `ValidatorFn`.
   *
   * Each `ZodIssue` is mapped to its `HelixValidatorKey`. `HelixFormField` reads
   * those keys directly — no template changes required.
   *
   * All issues from a single `safeParse` are processed simultaneously, producing
   * one `ValidationErrors` key per issue — equivalent to stacking multiple
   * `HelixValidators` calls.
   *
   * ### Known gaps
   * - `HelixValidatorKey.OneOf` / `AllOf` — `z.enum()` produces `invalid_value`,
   *   which has no automatic mapping. Use `fallbackKey` or continue using
   *   `HelixValidators.oneOf` / `HelixValidators.allOf`.
   * - `invalid_type` for `boolean` expected — Helix has no `Boolean` key.
   *   Use `fallbackKey` or `HelixValidators.pattern`.
   *
   * @param schema    A Zod field schema (e.g. `UserSchema.shape.email`).
   *                  Do NOT pass schemas with `.transform()` — use the
   *                  input-only (pre-transform) variant for form controls.
   * @param options   `allowEmpty` (default `true`) and optional `fallbackKey`
   *                  for `.refine()` / `custom` validators.
   *
   * @example
   * // Standard field — no fallbackKey needed
   * HelixZodValidators.fromZod(UserSchema.shape.email)
   *
   * @example
   * // Schema with .refine() — fallbackKey required (Option B)
   * HelixZodValidators.fromZod(
   *   z.string().refine(v => !banned.includes(v), 'Username not allowed'),
   *   { fallbackKey: HelixValidatorKey.Pattern },
   * )
   *
   * @example
   * // Required field — disable allowEmpty so empty value triggers Required / MinLength
   * HelixZodValidators.fromZod(UserSchema.shape.name, { allowEmpty: false })
   */
  fromZod(schema: ZodSchema, options: ZodHelixOptions = {}): ValidatorFn {
    const { fallbackKey, allowEmpty = true } = options;

    return (control: AbstractControl): ValidationErrors | null => {
      const value: unknown = control.value;

      // Replicate HelixValidators' allowEmpty = true default:
      // skip Zod entirely for empty values unless the caller opts out.
      if (allowEmpty && isEmptyValue(value)) {
        return null;
      }

      const result = schema.safeParse(value);
      if (result.success) return null;

      const errors: ValidationErrors = {};

      for (const issue of result.error.issues) {
        const key = zodIssueToHelixKey(issue, value);

        if (key !== null) {
          errors[key] = issue.message;
          continue;
        }

        // No automatic mapping — apply Option B logic.
        if (fallbackKey !== undefined) {
          errors[fallbackKey] = issue.message;
        } else {
          // ngDevMode is set by Angular's build toolchain:
          // true in development builds, false (tree-shaken) in production.
          if (typeof ngDevMode !== 'undefined' && ngDevMode) {
            throw new Error(
              `[HelixZodValidators.fromZod] Zod issue code "${issue.code}" has no ` +
                `automatic HelixValidatorKey mapping.\n` +
                `Pass { fallbackKey: HelixValidatorKey.xxx } as the second argument.\n` +
                `Failing issue: ${JSON.stringify(issue, null, 2)}`,
            );
          }
          // Production: skip the unmapped issue silently.
          // The control remains invalid if other issues produce mapped errors.
        }
      }

      return Object.keys(errors).length ? errors : null;
    };
  },
};
