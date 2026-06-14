import { FormControl } from '@angular/forms';
import { HelixValidatorKey } from './helix-validator-key.enum';
import {
  buildValidator,
  checkEmpty,
  type HelixValidatorMessage,
  HelixValidators,
  isEmptyValue,
} from './helix-validators';

describe('isEmptyValue', () => {
  it.each(['', null, undefined])('should return true for %s', (v) => {
    expect(isEmptyValue(v)).toBe(true);
  });

  it.each([0, false, 'hello', [], {}])('should return false for %s', (v) => {
    expect(isEmptyValue(v)).toBe(false);
  });
});

describe('checkEmpty', () => {
  const alwaysTrue = () => true;
  const alwaysFalse = () => false;

  describe('allowEmpty = true', () => {
    const gate = checkEmpty(true, alwaysFalse);

    it('should pass empty values without calling predicate', () => {
      expect(gate(new FormControl(''))).toBe(true);
      expect(gate(new FormControl(null))).toBe(true);
      expect(gate(new FormControl(undefined))).toBe(true);
    });

    it('should call predicate for non-empty values', () => {
      expect(gate(new FormControl('hello'))).toBe(false);
    });
  });

  describe('allowEmpty = false', () => {
    const gate = checkEmpty(false, alwaysTrue);

    it('should fail empty values', () => {
      expect(gate(new FormControl(''))).toBe(false);
      expect(gate(new FormControl(null))).toBe(false);
      expect(gate(new FormControl(undefined))).toBe(false);
    });

    it('should call predicate for non-empty values', () => {
      expect(gate(new FormControl('hello'))).toBe(true);
    });
  });
});

describe('buildValidator', () => {
  it('should return null when the gate passes', () => {
    const validator = buildValidator(() => true, HelixValidatorKey.Required, 'This is required');
    expect(validator(new FormControl('hello'))).toBeNull();
  });

  it('should return error with static string message when gate fails', () => {
    const validator = buildValidator(() => false, HelixValidatorKey.Required, 'This is required');
    const result = validator(new FormControl(''));
    expect(result).toEqual({ Required: 'This is required' });
  });

  it('should return error with function message when gate fails', () => {
    const msg: HelixValidatorMessage = (value) => `Value "${value}" is invalid`;
    const validator = buildValidator(() => false, HelixValidatorKey.Pattern, msg);
    const result = validator(new FormControl('abc'));
    expect(result).toEqual({ Pattern: 'Value "abc" is invalid' });
  });
});

describe('HelixValidators', () => {
  describe('required', () => {
    it('should fail for empty string', () => {
      const v = HelixValidators.required('Required');
      expect(v(new FormControl(''))).toEqual({ Required: 'Required' });
    });

    it('should fail for null', () => {
      const v = HelixValidators.required('Required');
      expect(v(new FormControl(null))).toEqual({ Required: 'Required' });
    });

    it('should fail for undefined', () => {
      const v = HelixValidators.required('Required');
      expect(v(new FormControl(undefined))).toEqual({ Required: 'Required' });
    });

    it('should pass for a non-empty value', () => {
      const v = HelixValidators.required('Required');
      expect(v(new FormControl('hello'))).toBeNull();
    });

    it('should return error with function message', () => {
      const msg: HelixValidatorMessage = (v) => `"${v}" is required`;
      const v = HelixValidators.required(msg);
      expect(v(new FormControl(''))).toEqual({ Required: '"" is required' });
    });
  });

  describe('email', () => {
    it('should pass a valid email', () => {
      const v = HelixValidators.email('Invalid email');
      expect(v(new FormControl('user@example.com'))).toBeNull();
    });

    it('should fail an invalid email', () => {
      const v = HelixValidators.email('Invalid email');
      expect(v(new FormControl('notanemail'))).toEqual({ Email: 'Invalid email' });
    });

    it('should pass empty value when allowEmpty=true (default)', () => {
      const v = HelixValidators.email('Invalid email');
      expect(v(new FormControl(''))).toBeNull();
    });

    it('should fail empty value when allowEmpty=false', () => {
      const v = HelixValidators.email('Invalid email', false);
      expect(v(new FormControl(''))).toEqual({ Email: 'Invalid email' });
    });
  });

  describe('pattern', () => {
    it('should pass a matching value', () => {
      const v = HelixValidators.pattern('Invalid', /^[a-z]+$/);
      expect(v(new FormControl('abc'))).toBeNull();
    });

    it('should fail a non-matching value', () => {
      const v = HelixValidators.pattern('Invalid', /^[a-z]+$/);
      expect(v(new FormControl('123'))).toEqual({ Pattern: 'Invalid' });
    });

    it('should pass empty value when allowEmpty=true', () => {
      const v = HelixValidators.pattern('Invalid', /^[a-z]+$/);
      expect(v(new FormControl(''))).toBeNull();
    });

    it('should fail empty value when allowEmpty=false', () => {
      const v = HelixValidators.pattern('Invalid', /^[a-z]+$/, false);
      expect(v(new FormControl(''))).toEqual({ Pattern: 'Invalid' });
    });
  });

  describe('date', () => {
    it('should pass an ISO date string', () => {
      const v = HelixValidators.date('Invalid date');
      expect(v(new FormControl('2024-01-01'))).toBeNull();
    });

    it('should pass a Date object', () => {
      const v = HelixValidators.date('Invalid date');
      expect(v(new FormControl(new Date()))).toBeNull();
    });

    it('should fail an unparseable string', () => {
      const v = HelixValidators.date('Invalid date');
      expect(v(new FormControl('notadate'))).toEqual({ Date: 'Invalid date' });
    });

    it('should pass empty value when allowEmpty=true', () => {
      const v = HelixValidators.date('Invalid date');
      expect(v(new FormControl(''))).toBeNull();
    });

    it('should fail empty value when allowEmpty=false', () => {
      const v = HelixValidators.date('Invalid date', false);
      expect(v(new FormControl(''))).toEqual({ Date: 'Invalid date' });
    });
  });
});
