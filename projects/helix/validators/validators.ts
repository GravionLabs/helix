import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormControl, Validators as NgValidators } from '@angular/forms';
import { ValidatorKey } from './validator-key.enum';

export type ValidatorMessage = (value: any) => string;

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
    key: ValidatorKey,
    msg: string | ValidatorMessage,
  ): ValidatorFn =>
  (ctrl: AbstractControl): ValidationErrors | null =>
    isValid(ctrl) ? null : { [key]: typeof msg === 'function' ? msg(ctrl.value) : msg };

export { buildValidator, checkEmpty, EMPTY_VALUES, isEmptyValue };

export const Validators = {
  required: (msg: string | ValidatorMessage): ValidatorFn => {
    const predicate = (ctrl: AbstractControl): boolean => !isEmptyValue(ctrl.value);
    return buildValidator(predicate, ValidatorKey.Required, msg);
  },

  email: (msg: string | ValidatorMessage, allowEmpty = true): ValidatorFn => {
    const check = (value: unknown): boolean => {
      const ctrl = new FormControl(value);
      return NgValidators.email(ctrl) === null;
    };
    return buildValidator(checkEmpty(allowEmpty, check), ValidatorKey.Email, msg);
  },

  pattern: (msg: string | ValidatorMessage, regex: RegExp, allowEmpty = true): ValidatorFn => {
    const check = (value: unknown): boolean => regex.test(value as string);
    return buildValidator(checkEmpty(allowEmpty, check), ValidatorKey.Pattern, msg);
  },

  date: (msg: string | ValidatorMessage, allowEmpty = true): ValidatorFn => {
    const check = (value: unknown): boolean => {
      const d = new Date(value as string | number | Date);
      return !Number.isNaN(d.getTime());
    };
    return buildValidator(checkEmpty(allowEmpty, check), ValidatorKey.Date, msg);
  },

  number: (msg: string | ValidatorMessage, allowEmpty = true): ValidatorFn => {
    const check = (value: unknown): boolean =>
      typeof value !== 'boolean' && !Number.isNaN(Number(value));
    return buildValidator(checkEmpty(allowEmpty, check), ValidatorKey.Number, msg);
  },

  integer: (msg: string | ValidatorMessage, allowEmpty = true): ValidatorFn => {
    const check = (value: unknown): boolean => {
      if (typeof value === 'boolean') return false;
      const num = Number(value);
      return !Number.isNaN(num) && num % 1 === 0;
    };
    return buildValidator(checkEmpty(allowEmpty, check), ValidatorKey.Integer, msg);
  },

  min: (msg: string | ValidatorMessage, minimum: number, allowEmpty = true): ValidatorFn => {
    const check = (value: unknown): boolean => Number(value) >= minimum;
    return buildValidator(checkEmpty(allowEmpty, check), ValidatorKey.Min, msg);
  },

  max: (msg: string | ValidatorMessage, maximum: number, allowEmpty = true): ValidatorFn => {
    const check = (value: unknown): boolean => Number(value) <= maximum;
    return buildValidator(checkEmpty(allowEmpty, check), ValidatorKey.Max, msg);
  },

  minLength: (msg: string | ValidatorMessage, min: number, allowEmpty = true): ValidatorFn => {
    const check = (value: unknown): boolean => (value as { length: number }).length >= min;
    return buildValidator(checkEmpty(allowEmpty, check), ValidatorKey.MinLength, msg);
  },

  maxLength: (msg: string | ValidatorMessage, max: number, allowEmpty = true): ValidatorFn => {
    const check = (value: unknown): boolean => (value as { length: number }).length <= max;
    return buildValidator(checkEmpty(allowEmpty, check), ValidatorKey.MaxLength, msg);
  },

  oneOf: (msg: string | ValidatorMessage, options: unknown[]): ValidatorFn => {
    const anyEmptyMember = EMPTY_VALUES.some((v) => options.includes(v));
    return (ctrl: AbstractControl): ValidationErrors | null => {
      const value = ctrl.value;
      if (anyEmptyMember && isEmptyValue(value)) return null;
      if (options.includes(value)) return null;
      return { [ValidatorKey.OneOf]: typeof msg === 'function' ? msg(value) : msg };
    };
  },

  allOf: (
    msg: string | ValidatorMessage,
    options: unknown[],
    allowEmpty = true,
  ): ValidatorFn => {
    const check = (value: unknown): boolean =>
      Array.isArray(value) && value.every((v) => options.includes(v));
    return buildValidator(checkEmpty(allowEmpty, check), ValidatorKey.AllOf, msg);
  },
};
