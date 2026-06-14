import {
  type AbstractControl,
  type AbstractControlOptions,
  type AsyncValidatorFn,
  FormArray,
  FormGroup,
  type ValidationErrors,
  type ValidatorFn,
} from '@angular/forms';

export function helixFormErrorMap(
  control: AbstractControl,
  name = 'form',
  result: Record<string, string> = {},
): Record<string, string> {
  if (control instanceof FormGroup) {
    Object.entries(control.controls).forEach(([key, ctrl]) => {
      helixFormErrorMap(ctrl, key, result);
    });
  } else if (control instanceof FormArray) {
    control.controls.forEach((ctrl, i) => {
      helixFormErrorMap(ctrl, `${name}[${i}]`, result);
    });
  } else if (control.errors) {
    const first = Object.values(control.errors as ValidationErrors)[0];
    if (typeof first === 'string') result[name] = first;
  }
  return result;
}

export class HelixFormArrayWithFactory<
  TControl extends AbstractControl = AbstractControl,
> extends FormArray<TControl> {
  constructor(
    readonly createControl: () => TControl,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super([], validatorOrOpts, asyncValidator);
  }

  alignLength(length: number): void {
    while (this.length < length) this.push(this.createControl());
    while (this.length > length) this.removeAt(this.length - 1);
  }

  override reset(value?: any, options?: object): void {
    if (Array.isArray(value)) this.alignLength(value.length);
    super.reset(value, options);
  }

  override setValue(value: any, options?: object): void {
    if (Array.isArray(value)) this.alignLength(value.length);
    super.setValue(value, options);
  }
}
