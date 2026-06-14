import { type AbstractControl, FormArray, FormGroup, type ValidationErrors } from '@angular/forms';

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
