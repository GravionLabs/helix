import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { HelixValidators } from '../validators/helix-validators';
import { HelixFormField } from './form-field';

describe('HelixFormField', () => {
  let fixture: ComponentFixture<HelixFormField>;
  let component: HelixFormField;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixFormField],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixFormField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should have default showLabel true', () => {
      expect(component.showLabel()).toBe(true);
    });

    it('should have default showHint true', () => {
      expect(component.showHint()).toBe(true);
    });

    it('should reflect label input', () => {
      fixture.componentRef.setInput('label', 'Email');
      expect(component.label()).toBe('Email');
    });

    it('should reflect control input', () => {
      const ctrl = new FormControl('');
      fixture.componentRef.setInput('control', ctrl);
      expect(component.control()).toBe(ctrl);
    });

    it('should reflect hint input', () => {
      fixture.componentRef.setInput('hint', 'Helper text');
      expect(component.hint()).toBe('Helper text');
    });

    it('should reflect error input', () => {
      fixture.componentRef.setInput('error', 'Server error');
      expect(component.error()).toBe('Server error');
    });
  });

  describe('renders label', () => {
    it('should show label when showLabel is true and label is set', () => {
      fixture.componentRef.setInput('label', 'Email');
      fixture.detectChanges();
      const labelEl = fixture.nativeElement.querySelector('label');
      expect(labelEl).toBeTruthy();
      expect(labelEl.textContent).toContain('Email');
    });

    it('should hide label when showLabel is false', () => {
      fixture.componentRef.setInput('label', 'Email');
      fixture.componentRef.setInput('showLabel', false);
      fixture.detectChanges();
      const labelEl = fixture.nativeElement.querySelector('label');
      expect(labelEl).toBeNull();
    });

    it('should hide label when label is not set', () => {
      fixture.detectChanges();
      const labelEl = fixture.nativeElement.querySelector('label');
      expect(labelEl).toBeNull();
    });
  });

  describe('renders projected content', () => {
    it('should render ng-content', () => {
      fixture.nativeElement.innerHTML =
        '<helix-form-field><input id="test-input" /></helix-form-field>';
      fixture.detectChanges();
      const inputEl = fixture.nativeElement.querySelector('#test-input');
      expect(inputEl).toBeTruthy();
    });
  });

  describe('renders hint', () => {
    it('should show hint when hint is set and no error is active', () => {
      fixture.componentRef.setInput('hint', 'Helper text');
      fixture.detectChanges();
      const smallEls = fixture.nativeElement.querySelectorAll('small');
      expect(smallEls.length).toBe(1);
      expect(smallEls[0].textContent).toContain('Helper text');
    });

    it('should hide hint when showHint is false', () => {
      fixture.componentRef.setInput('hint', 'Helper text');
      fixture.componentRef.setInput('showHint', false);
      fixture.detectChanges();
      const smallEls = fixture.nativeElement.querySelectorAll('small');
      expect(smallEls.length).toBe(0);
    });
  });

  describe('renders error', () => {
    it('should show error from control when touched and invalid', () => {
      const ctrl = new FormControl('', [HelixValidators.required('Required')]);
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity();
      fixture.componentRef.setInput('control', ctrl);
      fixture.detectChanges();
      const smallEls = fixture.nativeElement.querySelectorAll('small');
      expect(smallEls.length).toBe(1);
      expect(smallEls[0].textContent).toContain('Required');
    });

    it('should show external error when set', () => {
      fixture.componentRef.setInput('error', 'Server error');
      fixture.detectChanges();
      const smallEls = fixture.nativeElement.querySelectorAll('small');
      expect(smallEls.length).toBe(1);
      expect(smallEls[0].textContent).toContain('Server error');
    });

    it('should show external error over control error', () => {
      const ctrl = new FormControl('', [HelixValidators.required('Required')]);
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity();
      fixture.componentRef.setInput('control', ctrl);
      fixture.componentRef.setInput('error', 'External error');
      fixture.detectChanges();
      const smallEls = fixture.nativeElement.querySelectorAll('small');
      expect(smallEls.length).toBe(1);
      expect(smallEls[0].textContent).toContain('External error');
    });

    it('should not show error when control is untouched', () => {
      const ctrl = new FormControl('', [HelixValidators.required('Required')]);
      ctrl.updateValueAndValidity();
      fixture.componentRef.setInput('control', ctrl);
      fixture.detectChanges();
      const smallEls = fixture.nativeElement.querySelectorAll('small');
      expect(smallEls.length).toBe(0);
    });

    it('should not show hint when error is active', () => {
      const ctrl = new FormControl('', [HelixValidators.required('Required')]);
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity();
      fixture.componentRef.setInput('control', ctrl);
      fixture.componentRef.setInput('hint', 'Helper text');
      fixture.detectChanges();
      const smallEls = fixture.nativeElement.querySelectorAll('small');
      expect(smallEls.length).toBe(1);
      expect(smallEls[0].classList.contains('p-error')).toBe(true);
    });

    it('should not show hint or error when showHint is false', () => {
      const ctrl = new FormControl('', [HelixValidators.required('Required')]);
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity();
      fixture.componentRef.setInput('control', ctrl);
      fixture.componentRef.setInput('hint', 'Helper text');
      fixture.componentRef.setInput('error', 'External error');
      fixture.componentRef.setInput('showHint', false);
      fixture.detectChanges();
      const smallEls = fixture.nativeElement.querySelectorAll('small');
      expect(smallEls.length).toBe(0);
    });
  });

  describe('activeError computed', () => {
    it('should return null when control is null', () => {
      expect(component.activeError()).toBeNull();
    });

    it('should return null when control has no errors', () => {
      const ctrl = new FormControl('hello');
      fixture.componentRef.setInput('control', ctrl);
      expect(component.activeError()).toBeNull();
    });

    it('should return null when control is invalid but untouched', () => {
      const ctrl = new FormControl('', [HelixValidators.required('Required')]);
      fixture.componentRef.setInput('control', ctrl);
      expect(component.activeError()).toBeNull();
    });

    it('should return error message when control is touched and invalid', () => {
      const ctrl = new FormControl('', [HelixValidators.required('Required')]);
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity();
      fixture.componentRef.setInput('control', ctrl);
      fixture.detectChanges();
      expect(component.activeError()).toBe('Required');
    });

    it('should return external error when set', () => {
      fixture.componentRef.setInput('error', 'External');
      expect(component.activeError()).toBe('External');
    });

    it('should prefer external error over control error', () => {
      const ctrl = new FormControl('', [HelixValidators.required('Required')]);
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity();
      fixture.componentRef.setInput('control', ctrl);
      fixture.componentRef.setInput('error', 'External error');
      expect(component.activeError()).toBe('External error');
    });
  });
});
