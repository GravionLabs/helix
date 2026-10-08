import { nextId } from './ids';
import { compareValues, resolveOptions } from './options';

const accessors = ['label', 'value', 'disabled'] as const;
const resolve = (options: unknown[]) => resolveOptions(options, ...accessors);

describe('resolveOptions', () => {
  it('uses a primitive as its own label and value', () => {
    expect(resolve(['a', 2, true, null])).toEqual([
      { label: 'a', value: 'a', disabled: false },
      { label: '2', value: 2, disabled: false },
      { label: 'true', value: true, disabled: false },
      { label: 'null', value: null, disabled: false },
    ]);
  });

  it('reads an object through property names', () => {
    expect(resolve([{ label: 'Rome', value: 'RM', disabled: true }])).toEqual([
      { label: 'Rome', value: 'RM', disabled: true },
    ]);
    expect(resolveOptions([{ name: 'Rome', code: 'RM', off: 1 }], 'name', 'code', 'off')).toEqual([
      { label: 'Rome', value: 'RM', disabled: true },
    ]);
  });

  it('reads an object through functions', () => {
    const city = { name: 'Rome', code: 'RM', closed: true };
    const [item] = resolveOptions(
      [city],
      (o: { name: string }) => o.name.toUpperCase(),
      (o: { code: string }) => o.code.toLowerCase(),
      (o: { closed: boolean }) => !o.closed,
    );
    expect(item).toEqual({ label: 'ROME', value: 'rm', disabled: false });
  });

  it('falls back for missing properties: empty label, the object as value, not disabled', () => {
    const option = { other: 1 };
    const [item] = resolve([option]);
    expect(item.label).toBe('');
    expect(item.value).toBe(option);
    expect(item.disabled).toBe(false);
  });

  it('keeps a property that is present but falsy', () => {
    expect(resolve([{ label: 'x', value: 0, disabled: false }])[0]).toEqual({
      label: 'x',
      value: 0,
      disabled: false,
    });
  });

  it('handles an empty list and mixed primitives and objects', () => {
    expect(resolve([])).toEqual([]);
    expect(resolve(['a', { label: 'B', value: 'b' }]).map((o) => o.value)).toEqual(['a', 'b']);
  });
});

describe('compareValues', () => {
  it('is Object.is', () => {
    expect(compareValues(1, 1)).toBe(true);
    expect(compareValues(NaN, NaN)).toBe(true);
    expect(compareValues({}, {})).toBe(false);
  });
});

describe('nextId', () => {
  it('returns unique ids with the prefix', () => {
    const a = nextId('hx-x');
    const b = nextId('hx-x');
    expect(a).toMatch(/^hx-x-\d+$/);
    expect(a).not.toBe(b);
  });
});
