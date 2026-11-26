import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildTokens,
  contrast,
  createResolver,
  hexToRgb,
  shellConstants,
} from '../design-system/tokens.mjs';
import { resolveTokens } from '../tokens/resolve.mjs';
import { helixTokens } from '../../projects/tokens/src/index.ts';

const EXPORT = resolve(__dirname, '../../dist/tokens/helix.json');

describe('createResolver', () => {
  const tokens = {
    light: {
      '--h-a': 'var(--h-b)',
      '--h-b': '#112233',
      '--h-c': 'color-mix(in srgb, var(--h-b), transparent 84%)',
      '--h-loop': 'var(--h-loop)',
    },
    dark: { '--h-b': '#ffffff' },
  };
  const { literal, value } = createResolver(tokens);

  it('follows var() to a literal, per scheme, with light as fallback', () => {
    expect(literal('--h-a', 'light')).toBe('#112233');
    expect(literal('--h-a', 'dark')).toBe('#ffffff'); // --h-a only in light, --h-b overridden in dark
    expect(value('--h-a', 'dark')).toBe('var(--h-b)');
  });

  it('turns color-mix(…, transparent N%) into rgba()', () => {
    expect(literal('--h-c', 'light')).toBe('rgba(17, 34, 51, 0.16)');
  });

  it('gives up on cycles and unknown properties', () => {
    expect(literal('--h-loop', 'light')).toBeNull();
    expect(literal('--h-missing', 'light')).toBeNull();
  });
});

describe('contrast', () => {
  it('matches known WCAG values', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 1);
    expect(contrast('#767676', '#ffffff')).toBeCloseTo(4.54, 1);
    expect(hexToRgb('#abc')).toEqual([170, 187, 204]);
  });
});

describe('shellConstants', () => {
  it('reads the layout dimensions from the shell stylesheet', () => {
    expect(
      shellConstants(
        '--helix-layout-gap: 1.5rem; --helix-topbar-height: 4rem; --helix-control-height: 32px;',
      ),
    ).toMatchObject({
      'layout-gap': '1.5rem',
      'topbar-height': '4rem',
      'control-height': '32px',
    });
  });
});

describe('type scale and spacing groups', () => {
  const { tokens } = buildTokens(resolveTokens(helixTokens).json, { shell: {} });

  it('lists the spacing steps, in px of the 14px root', () => {
    const steps = tokens.spacing.tokens.filter((t: { name: string }) =>
      t.name.startsWith('space-'),
    );
    expect(steps.map((t: { name: string; value: string }) => [t.name, t.value])).toEqual([
      ['space-1', '3.5px'],
      ['space-2', '7px'],
      ['space-3', '10.5px'],
      ['space-4', '14px'],
      ['space-5', '17.5px'],
      ['space-6', '21px'],
      ['space-7', '24.5px'],
      ['space-8', '28px'],
    ]);
  });

  it('lists the type scale', () => {
    const scale = tokens.type.groups.find((g: { name: string }) => g.name === 'Type scale');
    expect(
      scale?.styles.map((s: { name: string; fontSize: string }) => [s.name, s.fontSize]),
    ).toEqual([
      ['font-size-xs', '10.5px'],
      ['font-size-sm', '12.25px'],
      ['font-size-md', '14px'],
      ['font-size-lg', '15.75px'],
      ['font-size-xl', '17.5px'],
      ['font-size-2xl', '21px'],
      ['font-size-3xl', '28px'],
    ]);
  });

  it('keeps the field paddings and text sizes, which now reference the steps', () => {
    const spacing = tokens.spacing.tokens as { name: string; value: string }[];
    expect(spacing.find((t) => t.name === 'field-padding-x')?.value).toBe('10.5px');
    expect(spacing.find((t) => t.name === 'field-padding-y')?.value).toBe('7px');
    const text = tokens.type.groups.find((g: { name: string }) => g.name === 'Text');
    const size = (name: string) =>
      text?.styles.find((s: { name: string }) => s.name === name)?.fontSize;
    expect([size('small'), size('large')]).toEqual(['12.25px', '15.75px']);
  });
});

// The exported tokens come from the built library (`pnpm tokens:export`).
describe.skipIf(!existsSync(EXPORT))('buildTokens (Helix tokens)', () => {
  const { tokens, skipped } = buildTokens(JSON.parse(readFileSync(EXPORT, 'utf8')));
  const colors = tokens.color.tokens as {
    name: string;
    value: string | Record<string, string>;
    usage: string;
  }[];

  /** A token's literal value in a theme, following {aliases}. */
  const hex = (name: string, theme: 'light' | 'dark', depth = 0): string => {
    const token = colors.find((t) => t.name === name);
    if (!token || depth > 16) throw new Error(`cannot resolve ${name}`);
    const v =
      typeof token.value === 'string' ? token.value : (token.value[theme] ?? token.value.light);
    const alias = /^\{(.+)\}$/.exec(v);
    return alias ? hex(alias[1], theme, depth + 1) : v;
  };

  it('has light first, unique names and literal or alias values only', () => {
    expect(tokens.color.themes.map((t: { id: string }) => t.id)).toEqual(['light', 'dark']);
    const all = [
      ...colors,
      ...tokens.spacing.tokens,
      ...tokens.radius.tokens,
      ...tokens.shadow.tokens,
    ].map((t) => t.name);
    expect(new Set(all).size).toBe(all.length);
    for (const t of all) expect(t).toMatch(/^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/);
    for (const { value } of colors) {
      for (const v of typeof value === 'string' ? [value] : Object.values(value)) {
        expect(v).not.toMatch(/var\(|color-mix|^[a-z]+$/);
        expect(v).toMatch(/^(#[0-9a-f]{6}|rgba?\(.+\)|\{[A-Za-z0-9_.-]+\})$/);
      }
    }
    expect(skipped).toEqual([]);
  });

  it('keeps the preset structure: primary → primary-600/400 → indigo', () => {
    const primary = colors.find((t) => t.name === 'primary')?.value;
    expect(primary).toEqual({ light: '{primary-600}', dark: '{primary-400}' });
    expect(colors.find((t) => t.name === 'primary-600')?.value).toBe('{indigo-600}');
  });

  it.each(['light', 'dark'] as const)('documented text pairs meet 4.5:1 in %s', (theme) => {
    const pairs: [string, string][] = [
      ['text', 'content-bg'],
      ...(theme === 'light' ? ([['text', 'surface-0']] as [string, string][]) : []), // surface-0 is white in both themes
      ['text-muted', 'content-bg'],
      // the shell's page, chrome, hover and card surfaces (styles-src.css)
      ...(theme === 'light'
        ? ([
            ['text', 'surface-50'],
            ['text-muted', 'surface-50'],
            ['text-muted', 'surface-100'],
          ] as [string, string][])
        : ([
            ['text', 'surface-900'],
            ['text', 'surface-950'],
            ['text-muted', 'surface-900'],
            ['text-muted', 'surface-800'],
            ['text-muted', 'surface-950'],
          ] as [string, string][])),
      ['primary-contrast', 'primary'],
      ['primary', 'content-bg'], // links, focus text
    ];
    for (const [fg, bg] of pairs) {
      const ratio = contrast(hex(fg, theme), hex(bg, theme));
      expect({ pair: `${fg} on ${bg}`, ok: ratio >= 4.5, ratio: ratio.toFixed(2) }).toMatchObject({
        ok: true,
      });
    }
  });

  it('flags severity text below 4.5:1 in its usage note', () => {
    const onSuccess = colors.find((t) => t.name === 'on-success');
    expect(onSuccess?.usage).toMatch(/below 4\.5:1/);
  });

  it('carries the font with files, and a radius and shadow set', () => {
    expect(tokens.type.fonts.map((f: { family: string }) => f.family)).toEqual(['Inter']);
    expect(tokens.radius.tokens.find((t: { name: string }) => t.name === 'radius-md').value).toBe(
      '6px',
    );
    expect(tokens.shadow.tokens).toHaveLength(4);
  });
});
