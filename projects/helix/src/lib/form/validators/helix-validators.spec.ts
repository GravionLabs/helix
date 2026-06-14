import { FormControl } from '@angular/forms';
import { HelixValidatorKey } from './helix-validator-key.enum';
import {
  buildValidator,
  checkEmpty,
  type HelixValidatorMessage,
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
