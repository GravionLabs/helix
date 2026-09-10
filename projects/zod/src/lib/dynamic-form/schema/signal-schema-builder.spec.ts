import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { z } from 'zod';
import { helixMeta } from '../model/helix-field-meta';
import { fieldAtPath } from './field-path.utils';
import { buildHelixSchema } from './signal-schema-builder';
import { buildDefaultValue } from './zod-defaults';
import { zodToFieldDescriptors } from './zod-field-walker';

beforeEach(() => {
  TestBed.configureTestingModule({});
});

function createForm(schema: z.ZodObject, initial?: Record<string, unknown>) {
  const model = signal((initial ?? buildDefaultValue(schema)) as Record<string, unknown>);
  const descriptors = zodToFieldDescriptors(schema);
  const tree = TestBed.runInInjectionContext(() =>
    form(model, buildHelixSchema(schema, descriptors)),
  );
  return { model, tree, descriptors };
}

describe('buildHelixSchema', () => {
  describe('root standard-schema validation', () => {
    it('routes zod issues onto the matching child fields', () => {
      const schema = z.object({
        email: z.email('Invalid email'),
        age: z.number().min(18, 'Too young'),
      });
      const { tree } = createForm(schema, { email: 'nope', age: 3 });

      const emailErrors = (tree as any).email().errors();
      const ageErrors = (tree as any).age().errors();
      expect(emailErrors.some((e: any) => e.kind === 'standardSchema')).toBe(true);
      expect(emailErrors[0].issue.message).toBe('Invalid email');
      expect(ageErrors[0].issue.message).toBe('Too young');
    });

    it('routes cross-field refine errors to the field named in the issue path', () => {
      const schema = z
        .object({ password: z.string(), confirm: z.string() })
        .refine((v) => v.password === v.confirm, {
          message: 'Passwords differ',
          path: ['confirm'],
        });
      // .refine() wraps the object — the walker needs the inner object, the
      // validator the refined schema. buildHelixSchema takes the refined one.
      const inner = z.object({ password: z.string(), confirm: z.string() });
      const model = signal({ password: 'a', confirm: 'b' });
      const tree = TestBed.runInInjectionContext(() =>
        form(model, buildHelixSchema(schema as any, zodToFieldDescriptors(inner))),
      );

      const confirmErrors = (tree as any).confirm().errors();
      expect(confirmErrors[0]?.issue?.message).toBe('Passwords differ');
    });

    it('marks the form valid when the value satisfies the schema', () => {
      const schema = z.object({ email: z.email() });
      const { tree } = createForm(schema, { email: 'a@b.co' });

      expect(tree().valid()).toBe(true);
    });
  });

  describe('conditional state', () => {
    it('drives hidden() from hiddenWhen over the root value', () => {
      const schema = z.object({
        newsletter: z.boolean(),
        frequency: helixMeta(z.string(), {
          hiddenWhen: (root: any) => !root.newsletter,
        }),
      });
      const { model, tree } = createForm(schema, { newsletter: false, frequency: '' });

      expect((tree as any).frequency().hidden()).toBe(true);
      model.update((v) => ({ ...v, newsletter: true }));
      expect((tree as any).frequency().hidden()).toBe(false);
    });

    it('excludes hidden invalid fields from root validity', () => {
      const schema = z.object({
        newsletter: z.boolean(),
        frequency: helixMeta(z.string().min(1, 'Required'), {
          hiddenWhen: (root: any) => !root.newsletter,
        }),
      });
      const { model, tree } = createForm(schema, { newsletter: false, frequency: '' });

      expect(tree().valid()).toBe(true);
      model.update((v) => ({ ...v, newsletter: true }));
      expect(tree().valid()).toBe(false);
    });

    it('drives disabled() with a string reason', () => {
      const schema = z.object({
        locked: z.boolean(),
        name: helixMeta(z.string(), {
          disabledWhen: (root: any) => (root.locked ? 'Locked by admin' : false),
        }),
      });
      const { model, tree } = createForm(schema, { locked: true, name: '' });

      expect((tree as any).name().disabled()).toBe(true);
      expect((tree as any).name().disabledReasons()[0]?.message).toBe('Locked by admin');
      model.update((v) => ({ ...v, locked: false }));
      expect((tree as any).name().disabled()).toBe(false);
    });

    it('drives readonly() from readonlyWhen', () => {
      const schema = z.object({
        submitted: z.boolean(),
        name: helixMeta(z.string(), { readonlyWhen: (root: any) => root.submitted }),
      });
      const { model, tree } = createForm(schema, { submitted: false, name: '' });

      expect((tree as any).name().readonly()).toBe(false);
      model.update((v) => ({ ...v, submitted: true }));
      expect((tree as any).name().readonly()).toBe(true);
    });

    it('drives required() from requiredWhen', () => {
      const schema = z.object({
        company: z.boolean(),
        vatId: helixMeta(z.string().optional(), {
          requiredWhen: (root: any) => root.company,
        }),
      });
      const { model, tree } = createForm(schema, { company: false, vatId: '' });

      expect((tree as any).vatId().required()).toBe(false);
      model.update((v) => ({ ...v, company: true }));
      expect((tree as any).vatId().required()).toBe(true);
      expect(
        (tree as any)
          .vatId()
          .errors()
          .some((e: any) => e.kind === 'required'),
      ).toBe(true);
    });

    it('applies extraSchema rules to the field path', () => {
      const applied: string[] = [];
      const schema = z.object({
        name: helixMeta(z.string(), {
          extraSchema: () => applied.push('name'),
        }),
      });
      createForm(schema, { name: '' });

      expect(applied).toEqual(['name']);
    });
  });

  describe('arrays', () => {
    it('routes per-item zod errors to the matching item field', () => {
      const schema = z.object({
        contacts: z.array(z.object({ phone: z.string().min(3, 'Too short') })),
      });
      const { tree } = createForm(schema, {
        contacts: [{ phone: '12345' }, { phone: '1' }],
      });

      const first = fieldAtPath(tree as any, ['contacts'])[0].phone;
      const second = fieldAtPath(tree as any, ['contacts'])[1].phone;
      expect(first().errors()).toHaveLength(0);
      expect(second().errors()[0]?.issue?.message).toBe('Too short');
    });

    it('applies item-level conditional rules via applyEach', () => {
      const schema = z.object({
        lockAll: z.boolean(),
        contacts: z.array(
          z.object({
            phone: helixMeta(z.string(), { disabledWhen: (root: any) => root.lockAll }),
          }),
        ),
      });
      const { model, tree } = createForm(schema, {
        lockAll: false,
        contacts: [{ phone: '123' }],
      });

      const phone = (tree as any).contacts[0].phone;
      expect(phone().disabled()).toBe(false);
      model.update((v) => ({ ...v, lockAll: true }));
      expect(phone().disabled()).toBe(true);
    });
  });

  describe('discriminated unions', () => {
    const schema = z.object({
      account: z.discriminatedUnion('kind', [
        z.object({ kind: z.literal('personal'), nickname: z.string() }),
        z.object({
          kind: z.literal('company'),
          vatId: helixMeta(z.string().min(2, 'VAT required'), {
            disabledWhen: (root: any) => root.frozen,
          }),
        }),
      ]),
      frozen: z.boolean(),
    });

    it('validates the active variant via the root zod schema', () => {
      const { tree } = createForm(schema, {
        account: { kind: 'company', vatId: 'x' },
        frozen: false,
      });

      const vatErrors = (tree as any).account.vatId().errors();
      expect(vatErrors[0]?.issue?.message).toBe('VAT required');
    });

    it('keeps variant rules dormant for other variants and active for the matching one', () => {
      const { model, tree } = createForm(schema, {
        account: { kind: 'company', vatId: 'DE123' },
        frozen: true,
      });

      expect((tree as any).account.vatId().disabled()).toBe(true);

      model.update((v) => ({ ...v, account: { kind: 'personal', nickname: 'zoe' } }));
      expect(tree().valid()).toBe(true);
    });
  });
});
