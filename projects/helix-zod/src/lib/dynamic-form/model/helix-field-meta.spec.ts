import { z } from 'zod';
import { type HelixFieldMeta, helixMeta, readHelixMeta } from './helix-field-meta';

describe('helixMeta / readHelixMeta', () => {
  it('registers metadata and returns the same schema instance', () => {
    const base = z.string();
    const annotated = helixMeta(base, { label: 'Name' });

    expect(annotated).toBe(base);
    expect(readHelixMeta(annotated)).toEqual({ label: 'Name' });
  });

  it('reads the full metadata shape', () => {
    const meta: HelixFieldMeta = {
      label: 'Country',
      placeholder: 'Pick one',
      hint: 'Where you live',
      widget: 'select',
      options: ['DE', 'FR'],
      order: 2,
    };
    const schema = helixMeta(z.string(), meta);

    expect(readHelixMeta(schema)).toEqual(meta);
  });

  it('falls back to zod global .meta() with title→label and description→hint mapping', () => {
    const schema = z.string().meta({ title: 'E-mail', description: 'Work address' });

    expect(readHelixMeta(schema)).toEqual({ label: 'E-mail', hint: 'Work address' });
  });

  it('merges the helix key of .meta() on top of title/description', () => {
    const schema = z.string().meta({
      title: 'Ignored',
      description: 'Kept',
      helix: { label: 'Wins', widget: 'textarea' },
    });

    expect(readHelixMeta(schema)).toEqual({ label: 'Wins', hint: 'Kept', widget: 'textarea' });
  });

  it('prefers the typed registry over global .meta()', () => {
    const schema = helixMeta(z.string(), { label: 'Registry' });

    expect(readHelixMeta(schema).label).toBe('Registry');
  });

  it('unwraps optional/default wrappers and merges metadata outermost-wins', () => {
    const inner = helixMeta(z.string(), { label: 'Inner', hint: 'Inner hint' });
    const outer = helixMeta(inner.optional(), { label: 'Outer' });

    expect(readHelixMeta(outer)).toEqual({ label: 'Outer', hint: 'Inner hint' });
  });

  it('reads metadata attached to the inner type through a wrapper without own meta', () => {
    const schema = helixMeta(z.string(), { label: 'Inner' }).nullable();

    expect(readHelixMeta(schema)).toEqual({ label: 'Inner' });
  });

  it('returns an empty object for schemas without metadata', () => {
    expect(readHelixMeta(z.string())).toEqual({});
  });
});
