import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { helixTokens, palettes } from '../../projects/tokens/src/index.ts';
import { TOKEN_COMPONENTS } from '../build-ui-css.mjs';
import { auraPrimitive, mute, SCALES } from '../helix-palettes.mjs';
import { loadPreset } from '../tokens/core-engine.mjs';

const ROOT = resolve(__dirname, '../..');
const SRC = join(ROOT, 'projects/tokens/src');
const built = existsSync(join(ROOT, 'dist/core/fesm2022'));

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

// What helix-core resolves for the Helix preset: the data must be the same, key by key and in the same order
// (the order is the order of the CSS the resolver emits).
describe.skipIf(!built)('token data equals the Helix preset of helix-core', () => {
  it.each(['primitive', 'semantic', 'components'] as const)('%s layer', async (layer) => {
    const { preset } = await loadPreset('helix');
    const now = JSON.stringify(helixTokens[layer]);
    const then = JSON.stringify(preset[layer]);
    expect(now === then, `${layer} differs from the preset (compare with JSON.stringify)`).toBe(
      true,
    );
  });
});
