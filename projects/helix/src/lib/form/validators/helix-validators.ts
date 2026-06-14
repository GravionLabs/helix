import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import type { HelixValidatorKey } from './helix-validator-key.enum';

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
