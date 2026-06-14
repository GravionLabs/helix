import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { HelixValidators } from '../validators/helix-validators';
import { helixFormErrorMap } from './form.utils';

describe('helixFormErrorMap', () => {
  it('should return empty object for a valid form group', () => {
    const form = new FormGroup({ name: new FormControl('hello') });
    expect(helixFormErrorMap(form)).toEqual({});
  });

  it('should return errors from flat form group', () => {
    const form = new FormGroup({
      email: new FormControl('bad', HelixValidators.email('Invalid email')),
      name: new FormControl('', HelixValidators.required('Required')),
    });
    expect(helixFormErrorMap(form)).toEqual({ email: 'Invalid email', name: 'Required' });
  });

  it('should return errors from nested form group using inner control name', () => {
    const form = new FormGroup({
      user: new FormGroup({
        email: new FormControl('bad', HelixValidators.email('Bad email')),
      }),
    });
    expect(helixFormErrorMap(form)).toEqual({ email: 'Bad email' });
  });

  it('should return errors from form array with indexed keys', () => {
    const form = new FormGroup({
      items: new FormArray([
        new FormControl('', HelixValidators.required('Required')),
        new FormControl('', HelixValidators.required('Required')),
      ]),
    });
    expect(helixFormErrorMap(form)).toEqual({ 'items[0]': 'Required', 'items[1]': 'Required' });
  });

  it('should skip non-string error values', () => {
    const form = new FormGroup({
      name: new FormControl('', Validators.required),
    });
    expect(helixFormErrorMap(form)).toEqual({});
  });
});
