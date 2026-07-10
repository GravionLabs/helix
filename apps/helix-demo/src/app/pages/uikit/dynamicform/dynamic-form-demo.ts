import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { HelixDynamicForm, helixMeta } from '@gravionlabs/helix-zod';
import { z } from 'zod';

interface RegistrationRoot {
  newsletter?: boolean;
  [key: string]: unknown;
}

const RegistrationSchema = z.object({
  email: helixMeta(z.email('Please enter a valid e-mail address'), {
    label: 'E-mail',
    placeholder: 'you@example.com',
    order: 1,
  }),
  password: helixMeta(z.string().min(8, 'At least 8 characters'), {
    label: 'Password',
    widget: 'password',
    order: 2,
  }),
  age: helixMeta(
    z.number('Age is required').min(18, 'You must be at least 18').max(120, 'Really?'),
    {
      label: 'Age',
      order: 3,
    },
  ),
  role: helixMeta(z.enum(['user', 'editor', 'admin']), {
    label: 'Role',
    hint: 'Determines the default permissions',
    order: 4,
  }),
  bio: helixMeta(z.string().max(200, 'Max. 200 characters').optional(), {
    label: 'Bio',
    widget: 'textarea',
    order: 5,
  }),
  birthday: helixMeta(z.date('Please pick a date').nullable(), {
    label: 'Birthday',
    order: 6,
  }),
  newsletter: helixMeta(z.boolean(), { label: 'Subscribe to newsletter', order: 7 }),
  frequency: helixMeta(z.enum(['daily', 'weekly', 'monthly']), {
    label: 'Frequency',
    order: 8,
    hiddenWhen: (root: RegistrationRoot) => !root.newsletter,
  }),
  account: helixMeta(
    z.discriminatedUnion('kind', [
      z.object({
        kind: z.literal('personal'),
        nickname: helixMeta(z.string().min(2, 'At least 2 characters'), { label: 'Nickname' }),
      }),
      z.object({
        kind: z.literal('company'),
        companyName: helixMeta(z.string().min(2, 'Required'), { label: 'Company name' }),
        vatId: helixMeta(z.string().min(2, 'Required'), { label: 'VAT ID' }),
      }),
    ]),
    { label: 'Account type', order: 9 },
  ),
  contacts: helixMeta(
    z.array(
      z.object({
        name: helixMeta(z.string().min(1, 'Required'), { label: 'Name' }),
        phone: helixMeta(z.string().min(3, 'At least 3 digits'), { label: 'Phone' }),
      }),
    ),
    { label: 'Emergency contacts', addLabel: 'Add contact', removeLabel: 'Remove', order: 10 },
  ),
  terms: helixMeta(
    z.boolean().refine((v) => v, 'You must accept the terms'),
    {
      label: 'I accept the terms and conditions',
      order: 11,
    },
  ),
});

@Component({
  selector: 'app-dynamic-form-demo',
  standalone: true,
  imports: [HelixDynamicForm, JsonPipe],
  templateUrl: './dynamic-form-demo.html',
  styleUrl: './dynamic-form-demo.scss',
})
export class DynamicFormDemo {
  protected readonly schema = RegistrationSchema;
  protected readonly model = signal<Record<string, unknown>>({
    email: '',
    password: '',
    age: null,
    role: 'user',
    bio: '',
    birthday: null,
    newsletter: false,
    frequency: 'weekly',
    account: { kind: 'personal', nickname: '' },
    contacts: [],
    terms: false,
  });

  protected readonly submittedValue = signal<unknown>(null);

  protected onSubmitted(value: unknown): void {
    this.submittedValue.set(value);
  }
}
