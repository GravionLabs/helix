import type { ValidationError } from '@angular/forms/signals';
import { HelixValidatorKey } from '@gravionlabs/helix-shell';
import type { ZodIssue } from 'zod';
import { zodIssueToHelixKey } from '../../internal/zod-issue-map';

/**
 * App-level hook to customize user-facing error messages centrally.
 * Return a string to use it, or `null`/`undefined` to fall back to the
 * default message for the error.
 */
export type HelixErrorMessageResolver = (
  error: ValidationError,
  helixKey: HelixValidatorKey | null,
) => string | null | undefined;

/** Built-in signal-forms error kinds → HelixValidatorKey. */
const NG_KIND_TO_HELIX: Record<string, HelixValidatorKey> = {
  required: HelixValidatorKey.Required,
  min: HelixValidatorKey.Min,
  max: HelixValidatorKey.Max,
  minLength: HelixValidatorKey.MinLength,
  maxLength: HelixValidatorKey.MaxLength,
  pattern: HelixValidatorKey.Pattern,
  email: HelixValidatorKey.Email,
};

/**
 * Maps a signal-forms `ValidationError` to the `HelixValidatorKey` message
 * convention shared with `HelixZodValidators.fromZod`.
 *
 * @param error The signal-forms validation error.
 * @param value The current field value — used to distinguish Required from
 *              type errors on Zod `invalid_type` issues (Zod v4 dropped the
 *              `received` field).
 */
export function helixErrorKey(error: ValidationError, value?: unknown): HelixValidatorKey | null {
  if (error.kind === 'standardSchema') {
    const issue = (error as unknown as { issue: unknown }).issue as ZodIssue;
    return zodIssueToHelixKey(issue, value);
  }
  return NG_KIND_TO_HELIX[error.kind] ?? null;
}

function defaultMessage(error: ValidationError): string | null {
  if (error.kind === 'standardSchema') {
    const issue = (error as unknown as { issue: { message?: string } }).issue;
    return issue.message ?? null;
  }
  return error.message ?? null;
}

/**
 * Returns the message of the first displayable error, mirroring
 * `HelixFormField`'s first-error convention.
 *
 * Order of precedence per error: `resolver` result → Zod issue message /
 * signal-forms error message. Errors yielding no message are skipped.
 */
export function helixFirstErrorMessage(
  errors: readonly ValidationError[],
  options: { value?: unknown; resolver?: HelixErrorMessageResolver } = {},
): string | null {
  for (const error of errors) {
    const resolved = options.resolver?.(error, helixErrorKey(error, options.value));
    const message = resolved ?? defaultMessage(error);
    if (message) return message;
  }
  return null;
}
