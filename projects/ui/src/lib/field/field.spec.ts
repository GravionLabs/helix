import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormField, form, required } from '@angular/forms/signals';
import { HxCheckbox } from '../checkbox/checkbox';
import { HxInput } from '../input/input';
import { HxSelect } from '../select/select';
import { HxSwitch } from '../switch/switch';
import { HxField } from './field';

async function render<T>(host: new () => T) {
  const fixture = TestBed.createComponent(host);
  document.body.appendChild(fixture.nativeElement);
  await fixture.whenStable();
  return fixture;
}

/** The parts of the field with the test id `name`, as the browser sees them. */
function parts(fixture: ComponentFixture<unknown>, name: string) {
  const field = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
    `[data-test="${name}"]`,
  )!;
  const control = field.querySelector<HTMLElement>('input, textarea, button')!;
  const label = field.querySelector('label');
  const hint = field.querySelector('.hx-field-hint');
  const error = field.querySelector('.hx-field-error')!;
  return {
    field,
    control,
    label,
    hint,
    error,
    message: () => error.textContent!.trim(),
    marker: () => field.querySelector('.hx-field-required'),
    describedBy: () => control.getAttribute('aria-describedby'),
    invalid: () => control.getAttribute('aria-invalid'),
    required: () => control.getAttribute('aria-required'),
  };
}

function blur(control: HTMLElement) {
  control.dispatchEvent(new Event('blur'));
  control.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
}

@Component({
  imports: [HxField, HxInput, HxCheckbox, HxSwitch, HxSelect, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <hx-field data-test="name" label="Name" hint="Your full name" error="Enter your name">
        <input hx-input formControlName="name" />
      </hx-field>
      <hx-field data-test="terms" label="Terms" error="Accept the terms">
        <input type="checkbox" hx-checkbox formControlName="terms" />
      </hx-field>
      <hx-field data-test="dark" label="Dark mode">
        <input type="checkbox" hx-switch formControlName="dark" />
      </hx-field>
      <hx-field data-test="city" label="City" hint="Where you live" error="Pick a city">
        <hx-select formControlName="city" [options]="['Rome', 'Oslo']" />
      </hx-field>
    </form>
  `,
})
class ReactiveHost {
  readonly form = new FormGroup({
    name: new FormControl('', Validators.required),
    terms: new FormControl(false, Validators.requiredTrue),
    dark: new FormControl(false),
    city: new FormControl<string | null>(null, Validators.required),
  });
}

@Component({
  imports: [HxField, HxInput, HxSelect, FormsModule],
  template: `
    <hx-field data-test="name" label="Name" error="Enter your name">
      <input hx-input name="name" [required]="mandatory()" [(ngModel)]="name" />
    </hx-field>
    <hx-field data-test="city" label="City" error="Pick a city">
      <hx-select required [options]="['Rome', 'Oslo']" [(ngModel)]="city" />
    </hx-field>
  `,
})
class TemplateHost {
  readonly mandatory = signal(true);
  name = '';
  city: string | null = null;
}

@Component({
  imports: [HxField, HxInput, HxCheckbox, HxSwitch, HxSelect, FormField],
  template: `
    <hx-field data-test="name" label="Name" [error]="override()">
      <input hx-input [formField]="signup.name" />
    </hx-field>
    <hx-field data-test="terms" label="Terms">
      <input type="checkbox" hx-checkbox [formField]="signup.terms" />
    </hx-field>
    <hx-field data-test="dark" label="Dark mode">
      <input type="checkbox" hx-switch [formField]="signup.dark" />
    </hx-field>
    <hx-field data-test="city" label="City">
      <hx-select [options]="['Rome', 'Oslo']" [formField]="signup.city" />
    </hx-field>
  `,
})
class SignalHost {
  readonly override = signal<string | null>(null);
  readonly model = signal({ name: '', terms: false, dark: false, city: '' });
  readonly signup = form(this.model, (path) => {
    required(path.name, { message: 'Name is required' });
    required(path.terms, { message: 'Terms are required' });
    required(path.city, { message: 'City is required' });
  });
}

@Component({
  imports: [HxField, HxInput, HxSelect],
  template: `
    <hx-field data-test="own" label="Name" [hint]="hint()" [error]="error()" [required]="mandatory()">
      <input hx-input id="own-id" aria-describedby="elsewhere" />
    </hx-field>
    <hx-field data-test="city" label="City">
      <hx-select inputId="own-city" ariaDescribedby="elsewhere" [invalid]="true" />
    </hx-field>
    <hx-field data-test="bare"><input hx-input aria-invalid="true" aria-label="Bare" /></hx-field>
  `,
})
class PlainHost {
  readonly hint = signal<string | undefined>(undefined);
  readonly error = signal<string | null>(null);
  readonly mandatory = signal(false);
}

describe('HxField', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it.each(['name', 'terms', 'dark', 'city'])(
    'labels the control of the %s field with a generated id',
    async (name) => {
      const { label, control } = parts(await render(ReactiveHost), name);

      expect(control.id).toMatch(/^hx-field-control-\d+$/);
      expect(label!.getAttribute('for')).toBe(control.id);
    },
  );

  it('works with reactive forms: invalid, error and description appear once touched', async () => {
    const fixture = await render(ReactiveHost);
    const name = parts(fixture, 'name');
    const city = parts(fixture, 'city');

    expect(name.invalid()).toBeNull();
    expect(name.message()).toBe('');
    expect(name.describedBy()).toBe(name.hint!.id);
    expect(name.required()).toBe('true');
    expect(city.invalid()).toBeNull();
    expect(city.describedBy()).toBe(city.hint!.id);
    expect(city.required()).toBe('true');
    expect(parts(fixture, 'terms').required()).toBe('true');
    expect(parts(fixture, 'dark').required()).toBeNull();
    expect(parts(fixture, 'dark').marker()).toBeNull();

    fixture.componentInstance.form.markAllAsTouched();
    await fixture.whenStable();

    expect(name.invalid()).toBe('true');
    expect(name.message()).toBe('Enter your name');
    expect(name.error.getAttribute('aria-live')).toBe('polite');
    expect(name.describedBy()).toBe(`${name.hint!.id} ${name.error.id}`);
    expect(city.invalid()).toBe('true');
    expect(city.describedBy()).toBe(`${city.hint!.id} ${city.error.id}`);
    expect(city.field.querySelector('.hx-select')!.classList).toContain('hx-select-invalid');
    expect(parts(fixture, 'terms').invalid()).toBe('true');
    expect(parts(fixture, 'dark').invalid()).toBeNull();

    fixture.componentInstance.form.patchValue({ name: 'Ada', city: 'Rome', terms: true });
    await fixture.whenStable();

    expect(name.invalid()).toBeNull();
    expect(name.message()).toBe('');
    expect(name.describedBy()).toBe(name.hint!.id);
    expect(city.invalid()).toBeNull();
    expect(city.describedBy()).toBe(city.hint!.id);
  });

  it('follows a control that is replaced', async () => {
    const fixture = await render(ReactiveHost);
    const name = parts(fixture, 'name');

    fixture.componentInstance.form.setControl('name', new FormControl('Ada'));
    await fixture.whenStable();
    fixture.componentInstance.form.markAllAsTouched();
    await fixture.whenStable();

    expect(name.invalid()).toBeNull();
    expect(name.required()).toBeNull();
  });

  it('works with template-driven forms: the required attribute and the touched state', async () => {
    const fixture = await render(TemplateHost);
    const name = parts(fixture, 'name');
    const city = parts(fixture, 'city');

    expect(name.required()).toBe('true');
    expect(name.marker()!.getAttribute('aria-hidden')).toBe('true');
    expect(city.required()).toBe('true');
    expect(name.invalid()).toBeNull();

    blur(name.control);
    blur(city.control);
    await fixture.whenStable();

    expect(name.invalid()).toBe('true');
    expect(name.message()).toBe('Enter your name');
    expect(name.describedBy()).toBe(name.error.id);
    expect(city.invalid()).toBe('true');
    expect(city.message()).toBe('Pick a city');

    fixture.componentInstance.mandatory.set(false);
    await fixture.whenStable();

    expect(name.required()).toBeNull();
    expect(name.marker()).toBeNull();
    expect(name.invalid()).toBeNull();
    expect(name.describedBy()).toBeNull();
  });

  it('works with signal forms: shows the message of the first error once touched', async () => {
    const fixture = await render(SignalHost);
    const name = parts(fixture, 'name');
    const city = parts(fixture, 'city');

    for (const field of ['name', 'terms', 'city']) {
      expect(parts(fixture, field).required()).toBe('true');
      expect(parts(fixture, field).invalid()).toBeNull();
      expect(parts(fixture, field).label!.getAttribute('for')).toBe(
        parts(fixture, field).control.id,
      );
    }
    // the select is invalid from the start for the form, but does not show it before a touch
    expect(city.field.querySelector('.hx-select')!.classList).not.toContain('hx-select-invalid');

    const { signup } = fixture.componentInstance;
    for (const field of [signup.name, signup.terms, signup.city, signup.dark])
      field().markAsTouched();
    await fixture.whenStable();

    expect(name.invalid()).toBe('true');
    expect(name.message()).toBe('Name is required');
    expect(name.describedBy()).toBe(name.error.id);
    expect(city.invalid()).toBe('true');
    expect(city.message()).toBe('City is required');
    expect(city.describedBy()).toBe(city.error.id);
    expect(parts(fixture, 'terms').message()).toBe('Terms are required');
    expect(parts(fixture, 'dark').invalid()).toBeNull();

    fixture.componentInstance.override.set('Tell us your name');
    await fixture.whenStable();
    expect(name.message()).toBe('Tell us your name');

    fixture.componentInstance.model.update((m) => ({ ...m, name: 'Ada' }));
    await fixture.whenStable();
    expect(name.invalid()).toBeNull();
    expect(name.message()).toBe('');
    expect(name.describedBy()).toBeNull();
  });

  it('keeps the id and the descriptions the app gave a control', async () => {
    const fixture = await render(PlainHost);
    const own = parts(fixture, 'own');
    const city = parts(fixture, 'city');

    expect(own.control.id).toBe('own-id');
    expect(own.label!.getAttribute('for')).toBe('own-id');
    expect(own.describedBy()).toBe('elsewhere');
    expect(city.control.id).toBe('own-city');
    expect(city.label!.getAttribute('for')).toBe('own-city');
    expect(city.describedBy()).toBe('elsewhere');
    // without a form and an error the field leaves the select's own `invalid` alone
    expect(city.invalid()).toBe('true');
  });

  it('shows a hint, an error and the required marker without a form, and takes them away', async () => {
    const fixture = await render(PlainHost);
    const host = fixture.componentInstance;
    host.hint.set('Help');
    host.error.set('Taken');
    host.mandatory.set(true);
    await fixture.whenStable();
    const own = parts(fixture, 'own');
    const hint = own.field.querySelector('.hx-field-hint')!;

    expect(own.describedBy()).toBe(`elsewhere ${hint.id} ${own.error.id}`);
    expect(own.invalid()).toBe('true');
    expect(own.required()).toBe('true');
    expect(own.marker()).not.toBeNull();

    host.hint.set(undefined);
    host.error.set(null);
    host.mandatory.set(false);
    await fixture.whenStable();

    expect(own.describedBy()).toBe('elsewhere');
    expect(own.invalid()).toBeNull();
    expect(own.required()).toBeNull();
    expect(own.marker()).toBeNull();
  });

  it('renders no label without one and keeps an aria-invalid the app set', async () => {
    const bare = parts(await render(PlainHost), 'bare');

    expect(bare.label).toBeNull();
    expect(bare.invalid()).toBe('true');
    expect(bare.describedBy()).toBeNull();
  });
});
