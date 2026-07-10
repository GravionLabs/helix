import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { z } from 'zod';
import { helixMeta } from '../../model/helix-field-meta';
import { provideHelixDynamicForms } from '../../registry/provide-helix-dynamic-forms';
import { HelixDynamicForm } from './dynamic-form';

const RegistrationSchema = z.object({
  email: helixMeta(z.email('Invalid email'), { label: 'E-mail' }),
  age: helixMeta(z.number('Age is required').min(18, 'Too young'), { label: 'Age' }),
  role: helixMeta(z.enum(['user', 'editor']), { label: 'Role' }),
  newsletter: helixMeta(z.boolean(), { label: 'Newsletter' }),
  frequency: helixMeta(z.string(), {
    label: 'Frequency',
    hiddenWhen: (root: any) => !root.newsletter,
  }),
  contacts: helixMeta(z.array(z.object({ phone: z.string().min(3, 'Phone too short') })), {
    label: 'Contacts',
    addLabel: 'Add contact',
  }),
  account: z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('personal'), nickname: z.string() }),
    z.object({ kind: z.literal('company'), vatId: z.string().min(2, 'VAT required') }),
  ]),
});

@Component({
  standalone: true,
  imports: [HelixDynamicForm],
  template: `<helix-dynamic-form [schema]="schema" (submitted)="submittedValue.set($event)" />`,
})
class Host {
  readonly schema = RegistrationSchema;
  readonly submittedValue = signal<unknown>(null);
}

describe('HelixDynamicForm (integration)', () => {
  let fixture: ComponentFixture<Host>;

  const el = <T extends Element>(selector: string): T => {
    const found = fixture.nativeElement.querySelector(selector);
    if (!found) throw new Error(`No element for selector "${selector}"`);
    return found as T;
  };

  const setInput = (input: HTMLInputElement, value: string) => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('blur', { bubbles: true }));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideHelixDynamicForms()],
    });
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders a widget per schema field', () => {
    expect(el('input[type="email"]')).toBeTruthy();
    expect(el('input[type="number"]')).toBeTruthy();
    expect(el('input[type="checkbox"]')).toBeTruthy();
    expect(el('helix-select')).toBeTruthy();
    expect(el('helix-union-widget')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('E-mail');
  });

  it('shows the zod error message after typing an invalid value and blurring', () => {
    setInput(el<HTMLInputElement>('input[type="email"]'), 'not-an-email');

    expect(fixture.nativeElement.textContent).toContain('Invalid email');
  });

  it('clears the error once the value is fixed', () => {
    const email = el<HTMLInputElement>('input[type="email"]');
    setInput(email, 'not-an-email');
    setInput(email, 'a@b.co');

    expect(fixture.nativeElement.textContent).not.toContain('Invalid email');
  });

  it('hides and reveals fields via hiddenWhen', () => {
    expect(fixture.nativeElement.textContent).not.toContain('Frequency');

    const newsletter = el<HTMLInputElement>('input[type="checkbox"]');
    newsletter.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Frequency');
  });

  it('adds and removes array items', () => {
    expect(fixture.nativeElement.querySelectorAll('.helix-array-widget__item')).toHaveLength(0);

    el<HTMLButtonElement>('.helix-array-widget__add').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.helix-array-widget__item')).toHaveLength(1);

    el<HTMLButtonElement>('.helix-array-widget__remove').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.helix-array-widget__item')).toHaveLength(0);
  });

  it('switches union variants and resets the variant value', () => {
    expect(fixture.nativeElement.textContent).toContain('Nickname');
    expect(fixture.nativeElement.textContent).not.toContain('Vat id');

    const select = el<HTMLSelectElement>('.helix-union-widget__select');
    select.value = '1'; // index of 'company'
    select.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Vat id');
    expect(fixture.nativeElement.textContent).not.toContain('Nickname');
  });

  it('does not emit submitted for an invalid form', async () => {
    el<HTMLButtonElement>('button[type="submit"]').click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.submittedValue()).toBeNull();
  });

  it('emits the parsed value on valid submit', async () => {
    setInput(el<HTMLInputElement>('input[type="email"]'), 'a@b.co');
    setInput(el<HTMLInputElement>('input[type="number"]'), '30');
    setInput(
      el<HTMLInputElement>('.helix-union-widget ~ * input, helix-union-widget input[type="text"]'),
      'zoe',
    );

    el<HTMLButtonElement>('button[type="submit"]').click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.submittedValue()).toEqual({
      email: 'a@b.co',
      age: 30,
      role: 'user',
      newsletter: false,
      frequency: '',
      contacts: [],
      account: { kind: 'personal', nickname: 'zoe' },
    });
  });

  it('uses an external model when provided', async () => {
    @Component({
      standalone: true,
      imports: [HelixDynamicForm],
      template: `<helix-dynamic-form [schema]="schema" [model]="model" />`,
    })
    class ExternalHost {
      readonly schema = z.object({ name: z.string() });
      readonly model = signal<Record<string, unknown>>({ name: 'preset' });
    }

    const external = TestBed.createComponent(ExternalHost);
    external.detectChanges();
    await external.whenStable();

    const input = external.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('preset');

    input.value = 'changed';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    external.detectChanges();

    expect(external.componentInstance.model()).toEqual({ name: 'changed' });
  });
});
