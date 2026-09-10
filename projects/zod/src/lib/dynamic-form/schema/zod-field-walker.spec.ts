import { z } from 'zod';
import { helixMeta } from '../model/helix-field-meta';
import { zodToFieldDescriptors } from './zod-field-walker';

describe('zodToFieldDescriptors', () => {
  it('infers widgets per zod type', () => {
    const root = zodToFieldDescriptors(
      z.object({
        name: z.string(),
        email: z.email(),
        age: z.number(),
        admin: z.boolean(),
        born: z.date(),
        role: z.enum(['user', 'editor']),
        tags: z.array(z.string()),
        address: z.object({ city: z.string() }),
      }),
    );

    const widgets = Object.fromEntries((root.children ?? []).map((c) => [c.key, c.widget]));
    expect(widgets).toEqual({
      name: 'text',
      email: 'email',
      age: 'number',
      admin: 'checkbox',
      born: 'date',
      role: 'select',
      tags: 'array',
      address: 'object',
    });
  });

  it('sets native input types for input-based widgets', () => {
    const root = zodToFieldDescriptors(z.object({ email: z.email(), age: z.number() }));
    const [email, age] = root.children ?? [];

    expect(email.inputType).toBe('email');
    expect(age.inputType).toBe('number');
  });

  it('detects requiredness through optional/nullable/default wrappers', () => {
    const root = zodToFieldDescriptors(
      z.object({
        plain: z.string(),
        opt: z.string().optional(),
        nul: z.string().nullable(),
        def: z.string().default('x'),
      }),
    );

    const required = Object.fromEntries((root.children ?? []).map((c) => [c.key, c.required]));
    expect(required).toEqual({ plain: true, opt: false, nul: false, def: false });
  });

  it('derives select options from z.enum()', () => {
    const root = zodToFieldDescriptors(z.object({ role: z.enum(['user', 'editor']) }));

    expect(root.children?.[0].options).toEqual([
      { label: 'user', value: 'user' },
      { label: 'editor', value: 'editor' },
    ]);
  });

  it('normalizes string meta options and prefers them over enum options', () => {
    const root = zodToFieldDescriptors(
      z.object({ role: helixMeta(z.enum(['a', 'b']), { options: ['x'] }) }),
    );

    expect(root.children?.[0].options).toEqual([{ label: 'x', value: 'x' }]);
  });

  it('sorts object children by meta.order, stable otherwise', () => {
    const root = zodToFieldDescriptors(
      z.object({
        c: z.string(),
        a: helixMeta(z.string(), { order: 1 }),
        b: z.string(),
      }),
    );

    expect(root.children?.map((c) => c.key)).toEqual(['a', 'c', 'b']);
  });

  it('builds an item descriptor for arrays of objects', () => {
    const root = zodToFieldDescriptors(
      z.object({ contacts: z.array(z.object({ phone: z.string() })) }),
    );
    const contacts = root.children?.[0];

    expect(contacts?.widget).toBe('array');
    expect(contacts?.itemDescriptor?.widget).toBe('object');
    expect(contacts?.itemDescriptor?.children?.[0].key).toBe('phone');
  });

  it('maps discriminated unions to variant descriptors keyed by discriminator value', () => {
    const root = zodToFieldDescriptors(
      z.object({
        account: z.discriminatedUnion('kind', [
          z.object({ kind: z.literal('personal'), nickname: z.string() }),
          z.object({ kind: z.literal('company'), vatId: z.string() }),
        ]),
      }),
    );
    const account = root.children?.[0];

    expect(account?.widget).toBe('union');
    expect(account?.union?.discriminator).toBe('kind');
    expect([...(account?.union?.variants.keys() ?? [])]).toEqual(['personal', 'company']);
    expect(account?.union?.variants.get('company')?.children?.map((c) => c.key)).toEqual([
      'kind',
      'vatId',
    ]);
  });

  it('honors meta.widget overrides for unsupported types', () => {
    const root = zodToFieldDescriptors(
      z.object({ blob: helixMeta(z.any(), { widget: 'my-custom' }) }),
    );

    expect(root.children?.[0].widget).toBe('my-custom');
  });

  it('throws in dev mode for unsupported types without a widget override', () => {
    vi.stubGlobal('ngDevMode', true);
    try {
      expect(() => zodToFieldDescriptors(z.object({ blob: z.any() }))).toThrowError(
        /no automatic widget mapping/,
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('falls back to a text widget in production for unsupported types', () => {
    vi.stubGlobal('ngDevMode', false);
    try {
      const root = zodToFieldDescriptors(z.object({ blob: z.any() }));
      expect(root.children?.[0].widget).toBe('text');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('records root-relative paths', () => {
    const root = zodToFieldDescriptors(z.object({ address: z.object({ city: z.string() }) }));

    expect(root.children?.[0].children?.[0].path).toEqual(['address', 'city']);
  });
});
