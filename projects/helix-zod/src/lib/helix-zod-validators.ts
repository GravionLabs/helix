import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import type { HelixValidatorKey } from '@gravionlabs/helix-shell';
import type { ZodSchema } from 'zod';
import { isEmptyValue, zodIssueToHelixKey } from './internal/zod-issue-map';

// Declared by Angular's build toolchain — true in development, false in production.
declare const ngDevMode: boolean | undefined;

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
