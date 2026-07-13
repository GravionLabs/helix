import { HelixValidatorKey } from '@gravionlabs/helix-shell';
import type { HelixErrorMessageResolver } from '@gravionlabs/helix-zod';

/**
 * Central error-message hook passed to `provideHelixDynamicForms`. Handles a
 * few keys and returns `null` otherwise, so the per-field Zod messages remain
 * the fallback.
 */
export const advancedErrorResolver: HelixErrorMessageResolver = (_error, helixKey) => {
  switch (helixKey) {
    case HelixValidatorKey.Required:
      return 'This field is required (message from the central resolver)';
    case HelixValidatorKey.Email:
      return 'That does not look like an e-mail address';
    default:
      return null;
  }
};
