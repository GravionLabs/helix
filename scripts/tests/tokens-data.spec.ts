import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { helixTokens, palettes } from '../../projects/tokens/src/index.ts';
import { TOKEN_COMPONENTS } from '../build-ui-css.mjs';
import { auraPrimitive, mute, SCALES } from '../helix-palettes.mjs';
import { resolveTokens } from '../tokens/resolve.mjs';

const ROOT = resolve(__dirname, '../..');
const SRC = join(ROOT, 'projects/tokens/src');

type Tree = { [key: string]: string | number | Tree };

function* leaves(tree: Tree, path: string[] = []): Generator<[string[], string | number]> {
  for (const [key, value] of Object.entries(tree)) {
    if (value !== null && typeof value === 'object') yield* leaves(value, [...path, key]);
    else yield [[...path, key], value];
  }
}

function* sourceFiles(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) yield* sourceFiles(full);
    else if (name.endsWith('.ts')) yield full;
  }
}

describe('token data (projects/tokens)', () => {
  it('is data only: no import of helix-core or a styling engine, no functions', () => {
    for (const file of sourceFiles(SRC)) {
      const source = readFileSync(file, 'utf8');
      expect(source, file).not.toMatch(/from\s+['"][^'"]*(helix-core|@primeuix|primeng)/i);
      expect(source, file).not.toMatch(/=>|function\s*\(/);
    }
  });

  it('has the three layers, and every leaf is a string or a number', () => {
    expect(Object.keys(helixTokens)).toEqual(['primitive', 'semantic', 'components']);
    for (const [layer, tree] of Object.entries(helixTokens)) {
      let count = 0;
      for (const [path, value] of leaves(tree as Tree)) {
        count++;
        expect(['string', 'number'], `${layer}.${path.join('.')}`).toContain(typeof value);
      }
      expect(count, layer).toBeGreaterThan(100);
    }
  });

  it('has the colour schemes of the semantic layer', () => {
    const scheme = (helixTokens.semantic as Tree).colorScheme as Tree;
    expect(Object.keys(scheme)).toEqual(['light', 'dark']);
  });

  it('has every component set the helix-ui stylesheets read', () => {
    const wanted = new Set(Object.values(TOKEN_COMPONENTS).flat());
    for (const name of wanted) expect(helixTokens.components, name).toHaveProperty(name);
  });

  it('resolves every {reference} against the primitive, semantic and component layers', () => {
    // the engine names a token by its path in kebab case (`borderRadius.md` and `{border.radius.md}` are
    // both --h-border-radius-md), so references are compared by that name
    const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    const known = new Set<string>();
    const scheme = (helixTokens.semantic as Tree).colorScheme as Tree;
    for (const tree of [helixTokens.primitive, helixTokens.semantic, scheme.light, scheme.dark]) {
      for (const [path] of leaves(tree as Tree)) {
        known.add(
          path
            .filter((p) => p !== 'colorScheme' && p !== 'light' && p !== 'dark')
            .map(kebab)
            .join('-'),
        );
      }
    }
    // a component token may also refer to a token of a component set (`{datatable.border.color}`)
    for (const [name, tree] of Object.entries(helixTokens.components)) {
      for (const [path] of leaves(tree as Tree)) {
        // the colour scheme and `root` are structure, not part of the name
        const parts = path.filter((p) => !['colorScheme', 'light', 'dark', 'root'].includes(p));
        known.add([name, ...parts].map(kebab).join('-'));
      }
    }
    const missing = new Set<string>();
    for (const tree of Object.values(helixTokens)) {
      for (const [, value] of leaves(tree as Tree)) {
        for (const [, ref] of String(value).matchAll(/\{([\w.]+)\}/g)) {
          if (!known.has(ref.split('.').map(kebab).join('-'))) missing.add(ref);
        }
      }
    }
    expect([...missing].sort()).toEqual([]);
  });
});

/** The scales of ADR 0009, as written there. */
const FONT_SIZES = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
};
const SPACES = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
};

describe('type scale and spacing (ADR 0009)', () => {
  const semantic = helixTokens.semantic as Tree;

  it('are in the semantic layer with the values of the ADR', () => {
    expect(semantic.fontSize).toEqual(FONT_SIZES);
    expect(semantic.space).toEqual(SPACES);
  });

  it('are referenced by every font size and spacing token that equals a step', () => {
    const rem = (value: string) => Number.parseFloat(value);
    const fontSteps = Object.values(FONT_SIZES).map(rem);
    const spaceSteps = Object.values(SPACES).map(rem);
    const written: string[] = [];
    for (const tree of [semantic, helixTokens.components as unknown as Tree]) {
      for (const [path, value] of leaves(tree)) {
        // the scales themselves are where the literals live
        if (tree === semantic && (path[0] === 'fontSize' || path[0] === 'space')) continue;
        const key = path.at(-1) ?? '';
        const steps = /fontSize$/i.test(key)
          ? fontSteps
          : /^(padding(X|Y|Top|Right|Bottom|Left)?|gap|\w+Gap|indent|mobileIndent|gutter)$/.test(
                key,
              )
            ? spaceSteps
            : [];
        if (/^\d*\.?\d+rem$/.test(String(value)) && steps.includes(rem(String(value)))) {
          written.push(`${path.join('.')}: ${value}`);
        }
      }
    }
    expect(written).toEqual([]);
  });

  it('leave the resolved value of every token that now references them unchanged', () => {
    // the values these variables had before they referenced a step
    const before: Record<string, string> = JSON.parse(
      readFileSync(join(ROOT, 'scripts/tests/fixtures/tokens-before-scale.json'), 'utf8'),
    );
    const { light } = resolveTokens(helixTokens).json;
    const literal = (value: string): string => {
      const ref = /^var\((--[\w-]+)\)$/.exec(value);
      return ref ? literal(light[ref[1]]) : value;
    };
    expect(Object.keys(before).length).toBeGreaterThan(100);
    for (const [name, value] of Object.entries(before)) {
      expect(light[name], name).toMatch(/^var\(--h-(font-size|space)-\w+\)$/);
      // a number comparison: `.5rem` and `0.5rem` are the same length
      expect(literal(light[name]), name).toMatch(/rem$/);
      expect(Number.parseFloat(literal(light[name])), name).toBe(Number.parseFloat(value));
    }
  });
});

describe('palettes', () => {
  it('mutes the Tailwind scales of tailwind.ts exactly as palettes.ts holds them', () => {
    const tailwind = auraPrimitive(readFileSync(join(SRC, 'tailwind.ts'), 'utf8'));
    expect(Object.keys(palettes)).toEqual(SCALES);
    for (const name of SCALES)
      expect(palettes[name as keyof typeof palettes], name).toEqual(mute(tailwind[name]));
  });

  it('are the colour scales of the primitive layer, in the key order of the preset', () => {
    for (const name of SCALES) {
      expect((helixTokens.primitive as Tree)[name], name).toBe(
        palettes[name as keyof typeof palettes],
      );
    }
  });
});
