import { z } from 'zod';
import { buildDefaultValue } from './zod-defaults';

describe('buildDefaultValue', () => {
  it('builds concrete defaults per zod type', () => {
    expect(buildDefaultValue(z.string())).toBe('');
    expect(buildDefaultValue(z.number())).toBeNull();
    expect(buildDefaultValue(z.boolean())).toBe(false);
    expect(buildDefaultValue(z.date())).toBeNull();
    expect(buildDefaultValue(z.enum(['a', 'b']))).toBe('a');
    expect(buildDefaultValue(z.literal('x'))).toBe('x');
    expect(buildDefaultValue(z.array(z.string()))).toEqual([]);
  });

  it('respects .default() over the type default', () => {
    expect(buildDefaultValue(z.number().default(42))).toBe(42);
    expect(buildDefaultValue(z.string().default(() => 'gen'))).toBe('gen');
  });

  it('recurses into objects', () => {
    const value = buildDefaultValue(
      z.object({ name: z.string(), nested: z.object({ on: z.boolean() }) }),
    );

    expect(value).toEqual({ name: '', nested: { on: false } });
  });

  it('uses undefined for optional leaves and null for nullable leaves', () => {
    expect(buildDefaultValue(z.string().optional())).toBeUndefined();
    expect(buildDefaultValue(z.string().nullable())).toBeNull();
  });

  it('still builds a concrete shape for optional containers', () => {
    expect(buildDefaultValue(z.object({ city: z.string() }).optional())).toEqual({ city: '' });
    expect(buildDefaultValue(z.array(z.string()).optional())).toEqual([]);
  });

  it('uses the first variant for discriminated unions', () => {
    const union = z.discriminatedUnion('kind', [
      z.object({ kind: z.literal('personal'), nickname: z.string() }),
      z.object({ kind: z.literal('company'), vatId: z.string() }),
    ]);

    expect(buildDefaultValue(union)).toEqual({ kind: 'personal', nickname: '' });
  });

  it('returns undefined for unsupported types', () => {
    expect(buildDefaultValue(z.any())).toBeUndefined();
  });
});
