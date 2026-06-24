import { FormControl } from '@angular/forms';
import { HelixValidatorKey } from '@gravionlabs/helix';
import { z } from 'zod';
import { HelixZodValidators } from './helix-zod-validators';

describe('HelixZodValidators', () => {
  describe('fromZod', () => {
    // ─── allowEmpty = true (default) ─────────────────────────────────────────

    describe('allowEmpty = true (default)', () => {
      const validator = HelixZodValidators.fromZod(z.string().email('Invalid email'));

      it.each(['', null, undefined])('should return null for empty value: %s', (value) => {
        expect(validator(new FormControl(value))).toBeNull();
      });

      it('should return null for a valid email', () => {
        expect(validator(new FormControl('user@example.com'))).toBeNull();
      });

      it('should return Email error for an invalid email', () => {
        expect(validator(new FormControl('notanemail'))).toEqual({
          [HelixValidatorKey.Email]: 'Invalid email',
        });
      });
    });

    // ─── allowEmpty = false ───────────────────────────────────────────────────

    describe('allowEmpty = false', () => {
      const validator = HelixZodValidators.fromZod(z.string().min(1, 'Required'), {
        allowEmpty: false,
      });

      it('should return MinLength error for empty string', () => {
        // '' passes the string type check but fails min(1) → too_small → MinLength
        expect(validator(new FormControl(''))).toEqual({
          [HelixValidatorKey.MinLength]: 'Required',
        });
      });

      it('should return Required error key for null', () => {
        // null causes invalid_type → Required key; message is Zod's default
        // invalid_type message, not the .min() message (different error code).
        const result = validator(new FormControl(null));
        expect(result).not.toBeNull();
        expect(Object.keys(result!)).toContain(HelixValidatorKey.Required);
      });

      it('should return Required error key for undefined', () => {
        const result = validator(new FormControl(undefined));
        expect(result).not.toBeNull();
        expect(Object.keys(result!)).toContain(HelixValidatorKey.Required);
      });

      it('should return null for a valid non-empty value', () => {
        expect(validator(new FormControl('hello'))).toBeNull();
      });
    });

    // ─── z.string().email() → Email ──────────────────────────────────────────

    describe('z.string().email() → Email', () => {
      const validator = HelixZodValidators.fromZod(z.string().email('Invalid email'));

      it('should return null for a valid email', () => {
        expect(validator(new FormControl('alice@example.com'))).toBeNull();
      });

      it('should return Email error for an invalid email', () => {
        expect(validator(new FormControl('bad'))).toEqual({
          [HelixValidatorKey.Email]: 'Invalid email',
        });
      });
    });

    // ─── z.string().min() → MinLength ────────────────────────────────────────

    describe('z.string().min() → MinLength', () => {
      const validator = HelixZodValidators.fromZod(z.string().min(3, 'Too short'));

      it('should return null at minimum length', () => {
        expect(validator(new FormControl('abc'))).toBeNull();
      });

      it('should return null above minimum length', () => {
        expect(validator(new FormControl('abcd'))).toBeNull();
      });

      it('should return MinLength error below minimum length', () => {
        expect(validator(new FormControl('ab'))).toEqual({
          [HelixValidatorKey.MinLength]: 'Too short',
        });
      });
    });

    // ─── z.string().max() → MaxLength ────────────────────────────────────────

    describe('z.string().max() → MaxLength', () => {
      const validator = HelixZodValidators.fromZod(z.string().max(5, 'Too long'));

      it('should return null at maximum length', () => {
        expect(validator(new FormControl('hello'))).toBeNull();
      });

      it('should return MaxLength error above maximum length', () => {
        expect(validator(new FormControl('toolong'))).toEqual({
          [HelixValidatorKey.MaxLength]: 'Too long',
        });
      });
    });

    // ─── z.number().min() → Min ──────────────────────────────────────────────

    describe('z.number().min() → Min', () => {
      const validator = HelixZodValidators.fromZod(z.number().min(5, 'Too small'));

      it('should return null at minimum value', () => {
        expect(validator(new FormControl(5))).toBeNull();
      });

      it('should return null above minimum value', () => {
        expect(validator(new FormControl(10))).toBeNull();
      });

      it('should return Min error below minimum value', () => {
        expect(validator(new FormControl(4))).toEqual({
          [HelixValidatorKey.Min]: 'Too small',
        });
      });
    });

    // ─── z.number().max() → Max ──────────────────────────────────────────────

    describe('z.number().max() → Max', () => {
      const validator = HelixZodValidators.fromZod(z.number().max(10, 'Too large'));

      it('should return null at maximum value', () => {
        expect(validator(new FormControl(10))).toBeNull();
      });

      it('should return Max error above maximum value', () => {
        expect(validator(new FormControl(11))).toEqual({
          [HelixValidatorKey.Max]: 'Too large',
        });
      });
    });

    // ─── z.number().int() → Integer ──────────────────────────────────────────

    describe('z.number().int() → Integer', () => {
      const validator = HelixZodValidators.fromZod(z.number().int('Not an integer'));

      it('should return null for an integer', () => {
        expect(validator(new FormControl(5))).toBeNull();
      });

      it('should return Integer error for a float', () => {
        expect(validator(new FormControl(3.14))).toEqual({
          [HelixValidatorKey.Integer]: 'Not an integer',
        });
      });
    });

    // ─── z.string().regex() → Pattern ────────────────────────────────────────

    describe('z.string().regex() → Pattern', () => {
      const validator = HelixZodValidators.fromZod(z.string().regex(/^\d+$/, 'Digits only'));

      it('should return null for a matching value', () => {
        expect(validator(new FormControl('123'))).toBeNull();
      });

      it('should return Pattern error for a non-matching value', () => {
        expect(validator(new FormControl('abc'))).toEqual({
          [HelixValidatorKey.Pattern]: 'Digits only',
        });
      });
    });

    // ─── z.number() type check → Number ──────────────────────────────────────

    describe('z.number() type check → Number', () => {
      // In Zod v4 the invalid_type_error option was removed; default message is used.
      const validator = HelixZodValidators.fromZod(z.number(), { allowEmpty: false });

      it('should return null for a valid number', () => {
        expect(validator(new FormControl(42))).toBeNull();
      });

      it('should return Number error key for a non-number value', () => {
        const result = validator(new FormControl('text'));
        expect(result).not.toBeNull();
        expect(Object.keys(result!)).toContain(HelixValidatorKey.Number);
      });
    });

    // ─── z.array().min() → MinLength ─────────────────────────────────────────

    describe('z.array().min() → MinLength', () => {
      const validator = HelixZodValidators.fromZod(z.array(z.string()).min(2, 'Select at least 2'));

      it('should return null when array meets minimum length', () => {
        expect(validator(new FormControl(['a', 'b']))).toBeNull();
      });

      it('should return MinLength error when array is too short', () => {
        expect(validator(new FormControl(['a']))).toEqual({
          [HelixValidatorKey.MinLength]: 'Select at least 2',
        });
      });
    });

    // ─── multiple issues ──────────────────────────────────────────────────────

    describe('multiple issues', () => {
      // z.string().min(5).email() on 'ab' → MinLength + Email simultaneously
      const validator = HelixZodValidators.fromZod(
        z.string().min(5, 'Too short').email('Bad email'),
      );

      it('should return all mapped error keys for multiple issues', () => {
        const result = validator(new FormControl('ab'));
        expect(result).toEqual({
          [HelixValidatorKey.MinLength]: 'Too short',
          [HelixValidatorKey.Email]: 'Bad email',
        });
      });
    });

    // ─── UserSchema.shape integration ────────────────────────────────────────

    describe('UserSchema.shape integration', () => {
      const emailSchema = z.string().email('Please enter a valid email address');
      const nameSchema = z.string().min(1, 'Name is required');

      it('should map email field schema to Email error', () => {
        const validator = HelixZodValidators.fromZod(emailSchema);
        expect(validator(new FormControl('bad'))).toEqual({
          [HelixValidatorKey.Email]: 'Please enter a valid email address',
        });
        expect(validator(new FormControl('alice@example.com'))).toBeNull();
      });

      it('should map name field schema to MinLength error with allowEmpty=false', () => {
        const validator = HelixZodValidators.fromZod(nameSchema, { allowEmpty: false });
        expect(validator(new FormControl(''))).toEqual({
          [HelixValidatorKey.MinLength]: 'Name is required',
        });
        expect(validator(new FormControl('Alice'))).toBeNull();
      });
    });

    // ─── .refine() with fallbackKey ───────────────────────────────────────────

    describe('.refine() with fallbackKey', () => {
      const banned = ['admin', 'root'];
      const validator = HelixZodValidators.fromZod(
        z.string().refine((v) => !banned.includes(v), 'Username not allowed'),
        { fallbackKey: HelixValidatorKey.Pattern },
      );

      it('should return null for an allowed value', () => {
        expect(validator(new FormControl('alice'))).toBeNull();
      });

      it('should return fallbackKey error for a banned value', () => {
        expect(validator(new FormControl('admin'))).toEqual({
          [HelixValidatorKey.Pattern]: 'Username not allowed',
        });
      });
    });

    // ─── Option B: missing fallbackKey ────────────────────────────────────────

    describe('missing fallbackKey (Option B)', () => {
      const validator = HelixZodValidators.fromZod(z.string().refine(() => false, 'Always fails'));

      it('should throw in development (ngDevMode = true)', () => {
        vi.stubGlobal('ngDevMode', true);
        expect(() => validator(new FormControl('anything'))).toThrow(
          '[HelixZodValidators.fromZod]',
        );
        vi.unstubAllGlobals();
      });

      it('should return null in production (ngDevMode = false)', () => {
        vi.stubGlobal('ngDevMode', false);
        // No mapped issues + no fallbackKey + prod → errors object stays empty → null
        expect(validator(new FormControl('anything'))).toBeNull();
        vi.unstubAllGlobals();
      });
    });
  });
});
