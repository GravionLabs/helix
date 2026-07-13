import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { HelixValidators } from '../validators/helix-validators';
import { HelixFormArrayWithFactory, helixFormErrorMap } from './form.utils';

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

describe('HelixFormArrayWithFactory', () => {
  it('should add controls via alignLength', () => {
    const arr = new HelixFormArrayWithFactory(() => new FormControl(''));
    arr.alignLength(3);
    expect(arr.length).toBe(3);
    arr.controls.forEach((ctrl) => {
      expect(ctrl.value).toBe('');
    });
  });

  it('should remove controls via alignLength', () => {
    const arr = new HelixFormArrayWithFactory(() => new FormControl(''));
    arr.alignLength(3);
    arr.alignLength(1);
    expect(arr.length).toBe(1);
  });

  it('should not change length when already matching', () => {
    const arr = new HelixFormArrayWithFactory(() => new FormControl(''));
    arr.alignLength(2);
    arr.alignLength(2);
    expect(arr.length).toBe(2);
  });

  it('should align before reset with array value', () => {
    const arr = new HelixFormArrayWithFactory(() => new FormControl(''));
    arr.reset(['a', 'b', 'c']);
    expect(arr.length).toBe(3);
    expect(arr.value).toEqual(['a', 'b', 'c']);
  });

  it('should align before setValue', () => {
    const arr = new HelixFormArrayWithFactory(() => new FormControl(''));
    arr.setValue(['x', 'y']);
    expect(arr.length).toBe(2);
    expect(arr.value).toEqual(['x', 'y']);
  });

  it('should accept validators', () => {
    const arr = new HelixFormArrayWithFactory(() => new FormControl(''), [Validators.required]);
    expect(arr.valid).toBe(false);
    arr.push(new FormControl('hello'));
    expect(arr.valid).toBe(true);
  });
});
