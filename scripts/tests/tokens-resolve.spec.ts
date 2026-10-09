import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { helixTokens } from '../../projects/tokens/src/index.ts';
import { loadPreset, resolvePreset } from '../tokens/core-engine.mjs';
import { declare, kebab, resolveTokens, variableName, variableValue } from '../tokens/resolve.mjs';

const ROOT = resolve(__dirname, '../..');
const FIXTURES = resolve(__dirname, 'fixtures');
const built = existsSync(resolve(ROOT, 'dist/core/fesm2022'));
// the golden files end with a newline that `resolveTokens` does not add
const goldenCss = readFileSync(resolve(FIXTURES, 'helix-tokens.golden.css'), 'utf8').replace(
  /\n$/,
  '',
);
const goldenJson = JSON.parse(readFileSync(resolve(FIXTURES, 'helix-tokens.golden.json'), 'utf8'));

describe('resolveTokens: the golden tokens (what helix-core emitted)', () => {
  const resolved = resolveTokens(helixTokens);

  it('emits the same CSS, byte for byte', () => {
    // booleans first: a mismatch must not dump 170 kB into the report
    expect(resolved.css.length).toBe(goldenCss.length);
    expect(resolved.css === goldenCss).toBe(true);
  });

  it('emits the same JSON, key for key and in the same order', () => {
    expect(JSON.stringify(resolved.json) === JSON.stringify(goldenJson)).toBe(true);
  });
});

describe('naming', () => {
  it('is --h- plus the path in kebab case', () => {
    expect(variableName(['button', 'primary', 'hoverBackground'])).toBe(
      '--h-button-primary-hover-background',
    );
    expect(variableName(['select', 'dropdown', 'width'])).toBe('--h-select-dropdown-width');
    expect(variableName(['some_key'])).toBe('--h-some-key');
  });

  it('leaves out the structural keys', () => {
    for (const key of [
      'primitive',
      'semantic',
      'components',
      'colorScheme',
      'light',
      'dark',
      'root',
    ]) {
      expect(variableName([key, 'primary', 'color']), key).toBe('--h-primary-color');
    }
    expect(variableName(['button', 'root', 'padding'])).toBe('--h-button-padding');
  });

  it('turns characters that are not allowed in a name into dashes', () => {
    expect(variableName(['a b', 'c.d'])).toBe('--h-ab-c-d');
  });

  it('kebab-cases camelCase and underscores', () => {
    expect(kebab('hoverBackground')).toBe('hover-background');
    expect(kebab('xl_2')).toBe('xl-2');
  });
});

describe('values and references', () => {
  it('keeps plain strings and numbers as they are', () => {
    expect(variableValue('#ffffff')).toBe('#ffffff');
    expect(variableValue('  0 0 1px 0 ')).toBe('0 0 1px 0');
    expect(variableValue(0.6)).toBe(0.6);
  });

  it('turns a {reference} into var(), by the same naming rule', () => {
    expect(variableValue('{primary.600}')).toBe('var(--h-primary-600)');
    expect(variableValue('{border.radius.md}')).toBe('var(--h-border-radius-md)');
    expect(variableValue('{form.field.focusRing.width}')).toBe(
      'var(--h-form-field-focus-ring-width)',
    );
    expect(variableValue('{semantic.primary.color}')).toBe('var(--h-primary-color)');
  });

  it('resolves several references inside one value', () => {
    expect(variableValue('{a.b} {c.d} solid {e}')).toBe(
      'var(--h-a-b) var(--h-c-d) solid var(--h-e)',
    );
    expect(variableValue('color-mix(in srgb, {red.50}, transparent 5%)')).toBe(
      'color-mix(in srgb, var(--h-red-50), transparent 5%)',
    );
  });

  it('wraps arithmetic in calc()', () => {
    expect(variableValue('{a.b} + 1')).toBe('calc(var(--h-a-b) + 1)');
    expect(variableValue('{a} * 2')).toBe('calc(var(--h-a) * 2)');
    expect(variableValue('{a} {b}')).toBe('var(--h-a) var(--h-b)');
  });

  it('gives up on unbalanced braces, and on values that are neither string nor number', () => {
    expect(variableValue('{a.b')).toBeUndefined();
    expect(variableValue(true)).toBeUndefined();
  });
});

describe('order', () => {
  it('writes the values of an object first, then its nested objects, the last one first', () => {
    const names = declare({ a: 1, x: { p: 1, q: { z: 1 } }, b: 2, y: { r: 1 } }).map((d) => d.name);
    expect(names).toEqual(['--h-a', '--h-b', '--h-y-r', '--h-x-p', '--h-x-q-z']);
  });
});

describe('layers and colour schemes', () => {
  const data = {
    primitive: { blue: { 500: '#00f' } },
    semantic: {
      radius: '4px',
      colorScheme: {
        light: { primary: { color: '{blue.500}' } },
        dark: { primary: { color: '{blue.300}' } },
      },
    },
    components: {
      button: {
        padding: '1rem',
        colorScheme: { light: { background: '{primary.color}' }, dark: { background: '#000' } },
      },
      badge: { size: '1rem' },
    },
  };

  it('puts primitive, semantic (light, then dark), global and the components in that order', () => {
    expect(resolveTokens(data).css).toBe(
      [
        ':root,:host{--h-blue-500:#00f;}',
        ':root,:host{--h-radius:4px;--h-primary-color:var(--h-blue-500);}.app-dark{--h-primary-color:var(--h-blue-300);}',
        ':root,:host{color-scheme:light}.app-dark{color-scheme:dark}',
        ':root,:host{--h-badge-size:1rem;}',
        ':root,:host{--h-button-padding:1rem;--h-button-background:var(--h-primary-color);}.app-dark{--h-button-background:#000;}',
      ].join('\n'),
    );
  });

  it('sorts the components by name, or takes the requested ones in the requested order', () => {
    const order = (components: boolean | string[]) =>
      [...resolveTokens(data, { components }).css.matchAll(/--h-(badge|button)-/g)].map(
        (m) => m[1],
      );
    expect(order(true)).toEqual(['badge', 'button', 'button', 'button']);
    expect(order(['button', 'badge'])).toEqual(['button', 'button', 'button', 'badge']);
    expect(order(false)).toEqual([]);
  });

  it('uses the dark selector it is given', () => {
    expect(resolveTokens(data, { darkSelector: '.dark', components: false }).css).toContain(
      '.dark{--h-primary-color',
    );
  });

  it('splits the JSON by colour scheme', () => {
    expect(resolveTokens(data).json).toEqual({
      light: {
        '--h-blue-500': '#00f',
        '--h-radius': '4px',
        '--h-primary-color': 'var(--h-blue-500)',
        '--h-badge-size': '1rem',
        '--h-button-padding': '1rem',
        '--h-button-background': 'var(--h-primary-color)',
      },
      dark: {
        '--h-primary-color': 'var(--h-blue-300)',
        '--h-button-background': '#000',
      },
    });
  });

  it('puts an attribute selector on the root element', () => {
    const { css, json } = resolveTokens(data, {
      darkSelector: '[data-theme="dark"]',
      components: false,
    });
    expect(css).toContain(
      ':root[data-theme="dark"],:host[data-theme="dark"]{--h-primary-color:var(--h-blue-300);}',
    );
    expect(json.dark['--h-primary-color']).toBe('var(--h-blue-300)');
  });

  it('fails on an unknown component and on a dark selector it does not support', () => {
    expect(() => resolveTokens(data, { components: ['nope'] })).toThrow(
      /no component token set "nope"/,
    );
    expect(() =>
      resolveTokens(data, { darkSelector: '@media (prefers-color-scheme: dark)' }),
    ).toThrow(/only a class .* or an attribute .* selector/);
  });

  it('leaves out layers the data does not have', () => {
    expect(resolveTokens({ primitive: { a: '1' } }, { components: false }).css).toBe(
      ':root,:host{--h-a:1;}\n:root,:host{color-scheme:light}.app-dark{color-scheme:dark}',
    );
  });
});

// The engine of helix-core is the reference while it exists: other selectors and subsets must match it too.
describe.skipIf(!built)('resolveTokens equals the engine of helix-core', () => {
  it.each([
    ['the docs site selector', { darkSelector: '.dark' }],
    ['the base layers only', { components: false as const }],
    ['a component subset', { components: ['select', 'button', 'tooltip'] }],
    ['a subset in a custom selector', { darkSelector: '.my-dark', components: ['inputtext'] }],
    [
      'the attribute selector of the Design System',
      { darkSelector: '[data-theme="dark"]', components: ['button', 'card'] },
    ],
  ])('%s', async (_name, options) => {
    const { Theme, preset } = await loadPreset('helix');
    const darkSelector = options.darkSelector ?? '.app-dark';
    const engine = resolvePreset(Theme, preset, darkSelector, {
      components: options.components ?? true,
    });
    const ours = resolveTokens(helixTokens, options).css;
    expect(ours.length).toBe(engine.length);
    expect(ours === engine).toBe(true);
  });
});
