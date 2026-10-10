import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { helixTokens } from '../../projects/tokens/src/index.ts';
import { DARK_SELECTOR, exportPreset, loadTokens, PRESETS, tokensOf } from '../export-tokens.mjs';
import { resolveTokens } from '../tokens/resolve.mjs';

describe('tokensOf', () => {
  it('splits custom properties by colour scheme', () => {
    const css = `:root,:host{--h-primary-color:#123;--h-surface-0:#fff}
      ${DARK_SELECTOR}{--h-surface-0:#000}
      .h-button{color:red}`;
    expect(tokensOf(css)).toEqual({
      light: { '--h-primary-color': '#123', '--h-surface-0': '#fff' },
      dark: { '--h-surface-0': '#000' },
    });
  });

  it('ignores declarations that are not Helix tokens', () => {
    expect(tokensOf(':root{color-scheme:light;--vp-c-brand:#000}')).toEqual({
      light: {},
      dark: {},
    });
  });
});

describe('the Helix tokens (projects/tokens)', () => {
  const helix = resolveTokens(helixTokens).json;

  it('resolve to the full token set, light and dark', () => {
    expect(helix.light['--h-primary-color']).toBeDefined();
    expect(helix.light['--h-button-primary-background']).toBeDefined();
    expect(helix.dark['--h-stone-50']).toBeUndefined(); // primitive: not per scheme
    expect(helix.dark['--h-surface-0']).toBeDefined(); // semantic, per colour scheme
    expect(helix.dark['--h-primary-color']).toBeDefined();
    expect(Object.keys(helix.light).length).toBeGreaterThan(1000);
  });

  it('are Aura with the Helix identity: indigo primary, the sibling-site surfaces in both schemes', () => {
    expect(helix.light['--h-primary-color']).toBe('var(--h-primary-600)');
    expect(helix.light['--h-primary-500']).toBe('var(--h-indigo-500)');
    expect(helix.light['--h-surface-500']).toBe('#67676c');
    expect(helix.dark['--h-surface-500']).toBe('#67676c');
    expect(helix.light['--h-text-color']).toBe('var(--h-surface-600)');
    expect(helix.dark['--h-text-color']).toBe('#dfdfd6');
  });

  it('export to files for the presets that have data, and refuse the others', () => {
    expect(PRESETS).toEqual(['helix']);
    expect(() => loadTokens('aura')).toThrow(/only helix has token data/);
    const dir = mkdtempSync(join(tmpdir(), 'tokens-'));
    const { css } = exportPreset('helix', { outDir: dir, base: true, darkSelector: '.dark' });
    expect(readFileSync(join(dir, 'helix.base.css'), 'utf8')).toBe(`${css}\n`);
    expect(css).toContain('.dark{--h-');
    expect(css).not.toContain('--h-button-');
    expect(Object.keys(JSON.parse(readFileSync(join(dir, 'helix.base.json'), 'utf8')))).toEqual([
      'light',
      'dark',
    ]);
    rmSync(dir, { recursive: true });
  });
});

describe('helix-palettes', () => {
  it('reduces chroma and keeps lightness', async () => {
    const { hexToOklch, mute } = await import('../helix-palettes.mjs');
    const muted = mute({ 500: '#6366f1' }, 0.65)[500];
    const before = hexToOklch('#6366f1');
    const after = hexToOklch(muted);
    expect(after.C).toBeCloseTo(before.C * 0.65, 2);
    expect(after.L).toBeCloseTo(before.L, 2);
  });

  it('round-trips a hex colour', async () => {
    const { hexToOklch, oklchToHex } = await import('../helix-palettes.mjs');
    expect(oklchToHex(hexToOklch('#4f46e5'))).toBe('#4f46e5');
  });
});

describe('helix-palettes covers the theme service', () => {
  it('mutes every primary colour the theme service offers', async () => {
    const { readFileSync } = await import('node:fs');
    const { SCALES } = await import('../helix-palettes.mjs');
    const source = readFileSync(
      resolve(__dirname, '../../projects/ui/src/lib/theme/theme.ts'),
      'utf8',
    );
    const offered = [
      ...(/HX_PRIMARY_COLORS = \[([\s\S]*?)\] as const/.exec(source)?.[1] ?? '').matchAll(
        /'([a-z]+)'/g,
      ),
    ]
      .map((m) => m[1])
      .filter((color) => color !== 'noir'); // noir is the surface scale, not a colour scale
    expect(offered.length).toBe(16);
    expect(offered.filter((c) => !SCALES.includes(c))).toEqual([]);
  });
});
