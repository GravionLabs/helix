import { requiredError, standardSchemaError } from '@angular/forms/signals';
import { HelixValidatorKey } from '@gravionlabs/helix';
import { z } from 'zod';
import { helixErrorKey, helixFirstErrorMessage } from './helix-signal-errors';

function zodIssuesFor(schema: z.ZodType, value: unknown) {
  const result = schema.safeParse(value);
  if (result.success) throw new Error('expected zod validation failure');
  return result.error.issues;
}

describe('helixErrorKey', () => {
  it('maps standard-schema zod issues to HelixValidatorKeys', () => {
    const [tooShort] = zodIssuesFor(z.string().min(3, 'Too short'), 'ab');
    expect(helixErrorKey(standardSchemaError(tooShort), 'ab')).toBe(HelixValidatorKey.MinLength);

    const [badEmail] = zodIssuesFor(z.email('Invalid'), 'nope');
    expect(helixErrorKey(standardSchemaError(badEmail), 'nope')).toBe(HelixValidatorKey.Email);

    const [tooSmall] = zodIssuesFor(z.number().min(5), 2);
    expect(helixErrorKey(standardSchemaError(tooSmall), 2)).toBe(HelixValidatorKey.Min);
  });

  it('maps invalid_type on empty values to Required using the field value', () => {
    const [issue] = zodIssuesFor(z.string(), undefined);
    expect(helixErrorKey(standardSchemaError(issue), undefined)).toBe(HelixValidatorKey.Required);
  });

  it('maps built-in signal-forms error kinds', () => {
    expect(helixErrorKey(requiredError())).toBe(HelixValidatorKey.Required);
  });

  it('returns null for unmapped kinds', () => {
    const [custom] = zodIssuesFor(
      z.string().refine(() => false, 'nope'),
      'value',
    );
    expect(helixErrorKey(standardSchemaError(custom), 'value')).toBeNull();
  });
});

describe('helixFirstErrorMessage', () => {
  it('returns the first zod issue message', () => {
    const issues = zodIssuesFor(
      z.string().min(3, 'Too short').regex(/^a/, 'Must start with a'),
      'zz',
    );
    const errors = issues.map((i) => standardSchemaError(i));

    expect(helixFirstErrorMessage(errors, { value: 'zz' })).toBe('Too short');
  });

  it('returns null for an empty error list', () => {
    expect(helixFirstErrorMessage([])).toBeNull();
  });

  it('lets a resolver override the message', () => {
    const [issue] = zodIssuesFor(z.string().min(3, 'Too short'), 'ab');

    const message = helixFirstErrorMessage([standardSchemaError(issue)], {
      value: 'ab',
      resolver: (_error, key) => (key === HelixValidatorKey.MinLength ? 'Custom!' : null),
    });

    expect(message).toBe('Custom!');
  });

  it('falls back to the default message when the resolver returns null', () => {
    const [issue] = zodIssuesFor(z.string().min(3, 'Too short'), 'ab');

    const message = helixFirstErrorMessage([standardSchemaError(issue)], {
      value: 'ab',
      resolver: () => null,
    });

    expect(message).toBe('Too short');
  });

  it('skips errors without any message', () => {
    const [issue] = zodIssuesFor(z.string().min(3, 'Second'), 'ab');
    const errors = [requiredError(), standardSchemaError(issue)];

    expect(helixFirstErrorMessage(errors, { value: 'ab' })).toBe('Second');
  });
});
