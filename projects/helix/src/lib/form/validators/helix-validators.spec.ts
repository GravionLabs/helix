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

    it('should support function message', () => {
      const v = HelixValidators.email((val) => `"${val}" is not valid`);
      expect(v(new FormControl('bad'))).toEqual({ Email: '"bad" is not valid' });
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

    it('should support function message', () => {
      const v = HelixValidators.pattern((val) => `"${val}" does not match`, /^\d+$/);
      expect(v(new FormControl('abc'))).toEqual({ Pattern: '"abc" does not match' });
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

    it('should support function message', () => {
      const v = HelixValidators.date((val) => `"${val}" is not a date`);
      expect(v(new FormControl('bad'))).toEqual({ Date: '"bad" is not a date' });
    });
  });

  describe('number', () => {
    it('should pass a numeric value', () => {
      const v = HelixValidators.number('Invalid number');
      expect(v(new FormControl(42))).toBeNull();
    });

    it('should pass a numeric string', () => {
      const v = HelixValidators.number('Invalid number');
      expect(v(new FormControl('3.14'))).toBeNull();
    });

    it('should pass zero', () => {
      const v = HelixValidators.number('Invalid number');
      expect(v(new FormControl(0))).toBeNull();
    });

    it('should fail a non-numeric string', () => {
      const v = HelixValidators.number('Invalid number');
      expect(v(new FormControl('abc'))).toEqual({ Number: 'Invalid number' });
    });

    it('should fail a boolean', () => {
      const v = HelixValidators.number('Invalid number');
      expect(v(new FormControl(true))).toEqual({ Number: 'Invalid number' });
    });

    it('should pass empty value when allowEmpty=true', () => {
      const v = HelixValidators.number('Invalid number');
      expect(v(new FormControl(''))).toBeNull();
    });

    it('should fail empty value when allowEmpty=false', () => {
      const v = HelixValidators.number('Invalid number', false);
      expect(v(new FormControl(''))).toEqual({ Number: 'Invalid number' });
    });

    it('should support function message', () => {
      const v = HelixValidators.number((val) => `"${val}" is not a number`);
      expect(v(new FormControl('abc'))).toEqual({ Number: '"abc" is not a number' });
    });
  });

  describe('integer', () => {
    it('should pass a whole number', () => {
      const v = HelixValidators.integer('Invalid integer');
      expect(v(new FormControl(5))).toBeNull();
    });

    it('should pass an integer string', () => {
      const v = HelixValidators.integer('Invalid integer');
      expect(v(new FormControl('10'))).toBeNull();
    });

    it('should fail a float', () => {
      const v = HelixValidators.integer('Invalid integer');
      expect(v(new FormControl(3.14))).toEqual({ Integer: 'Invalid integer' });
    });

    it('should fail a float string', () => {
      const v = HelixValidators.integer('Invalid integer');
      expect(v(new FormControl('1.5'))).toEqual({ Integer: 'Invalid integer' });
    });

    it('should fail a boolean', () => {
      const v = HelixValidators.integer('Invalid integer');
      expect(v(new FormControl(false))).toEqual({ Integer: 'Invalid integer' });
    });

    it('should pass empty value when allowEmpty=true', () => {
      const v = HelixValidators.integer('Invalid integer');
      expect(v(new FormControl(''))).toBeNull();
    });

    it('should fail empty value when allowEmpty=false', () => {
      const v = HelixValidators.integer('Invalid integer', false);
      expect(v(new FormControl(''))).toEqual({ Integer: 'Invalid integer' });
    });

    it('should support function message', () => {
      const v = HelixValidators.integer((val) => `"${val}" is not integer`);
      expect(v(new FormControl(3.14))).toEqual({ Integer: '"3.14" is not integer' });
    });
  });

  describe('min', () => {
    it('should pass a value equal to minimum', () => {
      const v = HelixValidators.min('Too small', 5);
      expect(v(new FormControl(5))).toBeNull();
    });

    it('should pass a value above minimum', () => {
      const v = HelixValidators.min('Too small', 5);
      expect(v(new FormControl(10))).toBeNull();
    });

    it('should fail a value below minimum', () => {
      const v = HelixValidators.min('Too small', 5);
      expect(v(new FormControl(4))).toEqual({ Min: 'Too small' });
    });

    it('should pass empty value when allowEmpty=true', () => {
      const v = HelixValidators.min('Too small', 5);
      expect(v(new FormControl(''))).toBeNull();
    });

    it('should fail empty value when allowEmpty=false', () => {
      const v = HelixValidators.min('Too small', 5, false);
      expect(v(new FormControl(''))).toEqual({ Min: 'Too small' });
    });

    it('should support function message', () => {
      const v = HelixValidators.min((val) => `Min is 5, got ${val}`, 5);
      expect(v(new FormControl(1))).toEqual({ Min: 'Min is 5, got 1' });
    });
  });

  describe('max', () => {
    it('should pass a value equal to maximum', () => {
      const v = HelixValidators.max('Too large', 10);
      expect(v(new FormControl(10))).toBeNull();
    });

    it('should pass a value below maximum', () => {
      const v = HelixValidators.max('Too large', 10);
      expect(v(new FormControl(0))).toBeNull();
    });

    it('should fail a value above maximum', () => {
      const v = HelixValidators.max('Too large', 10);
      expect(v(new FormControl(11))).toEqual({ Max: 'Too large' });
    });

    it('should pass empty value when allowEmpty=true', () => {
      const v = HelixValidators.max('Too large', 10);
      expect(v(new FormControl(''))).toBeNull();
    });

    it('should fail empty value when allowEmpty=false', () => {
      const v = HelixValidators.max('Too large', 10, false);
      expect(v(new FormControl(''))).toEqual({ Max: 'Too large' });
    });

    it('should support function message', () => {
      const v = HelixValidators.max((val) => `Max is 10, got ${val}`, 10);
      expect(v(new FormControl(20))).toEqual({ Max: 'Max is 10, got 20' });
    });
  });

  describe('minLength', () => {
    it('should pass a string at minimum length', () => {
      const v = HelixValidators.minLength('Too short', 3);
      expect(v(new FormControl('abc'))).toBeNull();
    });

    it('should pass an array at minimum length', () => {
      const v = HelixValidators.minLength('Too short', 3);
      expect(v(new FormControl([1, 2, 3]))).toBeNull();
    });

    it('should fail a string below minimum length', () => {
      const v = HelixValidators.minLength('Too short', 3);
      expect(v(new FormControl('ab'))).toEqual({ MinLength: 'Too short' });
    });

    it('should pass empty value when allowEmpty=true', () => {
      const v = HelixValidators.minLength('Too short', 3);
      expect(v(new FormControl(''))).toBeNull();
    });

    it('should fail empty value when allowEmpty=false', () => {
      const v = HelixValidators.minLength('Too short', 3, false);
      expect(v(new FormControl(''))).toEqual({ MinLength: 'Too short' });
    });

    it('should support function message', () => {
      const v = HelixValidators.minLength((val: string) => `Length ${val.length} < 3`, 3);
      expect(v(new FormControl('ab'))).toEqual({ MinLength: 'Length 2 < 3' });
    });
  });

  describe('maxLength', () => {
    it('should pass a string at maximum length', () => {
      const v = HelixValidators.maxLength('Too long', 5);
      expect(v(new FormControl('hello'))).toBeNull();
    });

    it('should pass an array below maximum length', () => {
      const v = HelixValidators.maxLength('Too long', 5);
      expect(v(new FormControl([1, 2]))).toBeNull();
    });

    it('should fail a string above maximum length', () => {
      const v = HelixValidators.maxLength('Too long', 5);
      expect(v(new FormControl('toolong'))).toEqual({ MaxLength: 'Too long' });
    });

    it('should pass empty value when allowEmpty=true', () => {
      const v = HelixValidators.maxLength('Too long', 5);
      expect(v(new FormControl(''))).toBeNull();
    });

    it('should fail empty value when allowEmpty=false', () => {
      const v = HelixValidators.maxLength('Too long', 5, false);
      expect(v(new FormControl(''))).toEqual({ MaxLength: 'Too long' });
    });

    it('should support function message', () => {
      const v = HelixValidators.maxLength((val: string) => `Length ${val.length} > 5`, 5);
      expect(v(new FormControl('toolong'))).toEqual({ MaxLength: 'Length 7 > 5' });
    });
  });

  describe('oneOf', () => {
    it('should pass a value in options', () => {
      const v = HelixValidators.oneOf('Not allowed', ['a', 'b', null]);
      expect(v(new FormControl('a'))).toBeNull();
    });

    it('should pass null when null is in options', () => {
      const v = HelixValidators.oneOf('Not allowed', ['a', 'b', null]);
      expect(v(new FormControl(null))).toBeNull();
    });

    it('should fail a value not in options', () => {
      const v = HelixValidators.oneOf('Not allowed', ['a', 'b']);
      expect(v(new FormControl('c'))).toEqual({ OneOf: 'Not allowed' });
    });

    it('should fail null when null is not in options', () => {
      const v = HelixValidators.oneOf('Not allowed', ['a', 'b']);
      expect(v(new FormControl(null))).toEqual({ OneOf: 'Not allowed' });
    });

    it('should fail empty string when not in options', () => {
      const v = HelixValidators.oneOf('Not allowed', ['a', 'b']);
      expect(v(new FormControl(''))).toEqual({ OneOf: 'Not allowed' });
    });

    it('should support function message', () => {
      const v = HelixValidators.oneOf((val) => `"${val}" is not allowed`, ['a']);
      expect(v(new FormControl('b'))).toEqual({ OneOf: '"b" is not allowed' });
    });
  });

  describe('allOf', () => {
    it('should pass when all elements are in options', () => {
      const v = HelixValidators.allOf('Not allowed', [1, 2, 3]);
      expect(v(new FormControl([1, 2]))).toBeNull();
    });

    it('should pass an empty array', () => {
      const v = HelixValidators.allOf('Not allowed', [1, 2, 3]);
      expect(v(new FormControl([]))).toBeNull();
    });

    it('should fail when an element is not in options', () => {
      const v = HelixValidators.allOf('Not allowed', [1, 2, 3]);
      expect(v(new FormControl([1, 4]))).toEqual({ AllOf: 'Not allowed' });
    });

    it('should pass empty value when allowEmpty=true', () => {
      const v = HelixValidators.allOf('Not allowed', [1, 2, 3]);
      expect(v(new FormControl(''))).toBeNull();
    });

    it('should fail empty value when allowEmpty=false', () => {
      const v = HelixValidators.allOf('Not allowed', [1, 2, 3], false);
      expect(v(new FormControl(''))).toEqual({ AllOf: 'Not allowed' });
    });

    it('should support function message', () => {
      const v = HelixValidators.allOf((val) => `${JSON.stringify(val)} has invalid items`, [1, 2]);
      expect(v(new FormControl([1, 3]))).toEqual({ AllOf: '[1,3] has invalid items' });
    });
  });
});
