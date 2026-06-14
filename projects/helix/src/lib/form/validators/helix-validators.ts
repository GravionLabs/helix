import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { HelixValidatorKey } from './helix-validator-key.enum';

export type HelixValidatorMessage = (value: unknown) => string;

const EMPTY_VALUES = ['', null, undefined];

const isEmptyValue = (v: unknown): boolean => EMPTY_VALUES.includes(v as string);

const checkEmpty =
  (allowEmpty: boolean, check: (value: unknown) => boolean) =>
  (ctrl: AbstractControl): boolean =>
    allowEmpty
      ? isEmptyValue(ctrl.value) || check(ctrl.value)
      : !isEmptyValue(ctrl.value) && check(ctrl.value);

const buildValidator =
  (
    isValid: (ctrl: AbstractControl) => boolean,
    key: HelixValidatorKey,
    msg: string | HelixValidatorMessage,
  ): ValidatorFn =>
  (ctrl: AbstractControl): ValidationErrors | null =>
    isValid(ctrl) ? null : { [key]: typeof msg === 'function' ? msg(ctrl.value) : msg };

export { buildValidator, checkEmpty, EMPTY_VALUES, isEmptyValue };

export const HelixValidators = {
  required: (msg: string | HelixValidatorMessage): ValidatorFn => {
    const predicate = (ctrl: AbstractControl): boolean => !isEmptyValue(ctrl.value);
    return buildValidator(predicate, HelixValidatorKey.Required, msg);
  },

  email: (msg: string | HelixValidatorMessage, allowEmpty = true): ValidatorFn => {
    const check = (value: unknown): boolean => {
      const ctrl = new FormControl(value);
      return Validators.email(ctrl) === null;
    };
    return buildValidator(checkEmpty(allowEmpty, check), HelixValidatorKey.Email, msg);
  },

  pattern: (msg: string | HelixValidatorMessage, regex: RegExp, allowEmpty = true): ValidatorFn => {
    const check = (value: unknown): boolean => regex.test(value as string);
    return buildValidator(checkEmpty(allowEmpty, check), HelixValidatorKey.Pattern, msg);
  },

  date: (msg: string | HelixValidatorMessage, allowEmpty = true): ValidatorFn => {
    const check = (value: unknown): boolean => {
      const d = new Date(value as string | number | Date);
      return !Number.isNaN(d.getTime());
    };
    return buildValidator(checkEmpty(allowEmpty, check), HelixValidatorKey.Date, msg);
  },

  number: (msg: string | HelixValidatorMessage, allowEmpty = true): ValidatorFn => {
    const check = (value: unknown): boolean =>
      typeof value !== 'boolean' && !Number.isNaN(Number(value));
    return buildValidator(checkEmpty(allowEmpty, check), HelixValidatorKey.Number, msg);
  },

  integer: (msg: string | HelixValidatorMessage, allowEmpty = true): ValidatorFn => {
    const check = (value: unknown): boolean => {
      if (typeof value === 'boolean') return false;
      const num = Number(value);
      return !Number.isNaN(num) && num % 1 === 0;
    };
    return buildValidator(checkEmpty(allowEmpty, check), HelixValidatorKey.Integer, msg);
  },

  min: (msg: string | HelixValidatorMessage, minimum: number, allowEmpty = true): ValidatorFn => {
    const check = (value: unknown): boolean => Number(value) >= minimum;
    return buildValidator(checkEmpty(allowEmpty, check), HelixValidatorKey.Min, msg);
  },

  max: (msg: string | HelixValidatorMessage, maximum: number, allowEmpty = true): ValidatorFn => {
    const check = (value: unknown): boolean => Number(value) <= maximum;
    return buildValidator(checkEmpty(allowEmpty, check), HelixValidatorKey.Max, msg);
  },

  minLength: (msg: string | HelixValidatorMessage, min: number, allowEmpty = true): ValidatorFn => {
    const check = (value: unknown): boolean => (value as { length: number }).length >= min;
    return buildValidator(checkEmpty(allowEmpty, check), HelixValidatorKey.MinLength, msg);
  },

  maxLength: (msg: string | HelixValidatorMessage, max: number, allowEmpty = true): ValidatorFn => {
    const check = (value: unknown): boolean => (value as { length: number }).length <= max;
    return buildValidator(checkEmpty(allowEmpty, check), HelixValidatorKey.MaxLength, msg);
  },

  oneOf: (msg: string | HelixValidatorMessage, options: unknown[]): ValidatorFn => {
    const anyEmptyMember = EMPTY_VALUES.some((v) => options.includes(v));
    return (ctrl: AbstractControl): ValidationErrors | null => {
      const value = ctrl.value;
      if (anyEmptyMember && isEmptyValue(value)) return null;
      if (options.includes(value)) return null;
      return { [HelixValidatorKey.OneOf]: typeof msg === 'function' ? msg(value) : msg };
    };
  },

  allOf: (
    msg: string | HelixValidatorMessage,
    options: unknown[],
    allowEmpty = true,
  ): ValidatorFn => {
    const check = (value: unknown): boolean =>
      Array.isArray(value) && value.every((v) => options.includes(v));
    return buildValidator(checkEmpty(allowEmpty, check), HelixValidatorKey.AllOf, msg);
  },
};
