import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DARK_SELECTOR } from '../export-tokens.mjs';
import { currentTokens, GOLDEN_CSS, GOLDEN_JSON } from '../tokens-golden.mjs';

const built = existsSync(resolve(__dirname, '../../dist/core/fesm2022'));
const golden = {
  css: readFileSync(GOLDEN_CSS, 'utf8'),
  json: readFileSync(GOLDEN_JSON, 'utf8'),
};
const tokens = JSON.parse(golden.json) as {
  light: Record<string, string>;
  dark: Record<string, string>;
};

// The fixtures are what the engine of helix-core emitted when #646 was done. The replacement resolver (#648)
// must reproduce them; `pnpm tokens:golden` regenerates them while helix-core still exists.
describe('golden Helix tokens (the fixtures)', () => {
  it('has the layers the pipeline emits: light on :root,:host, dark under the dark selector', () => {
    expect(golden.css.startsWith(':root,:host{--h-')).toBe(true);
    expect(golden.css).toContain(`${DARK_SELECTOR}{--h-`);
    expect(golden.css.endsWith('\n')).toBe(true);
  });

  it('holds the three base layers and the component token sets', () => {
    expect(Object.keys(tokens.light).length).toBeGreaterThan(2000);
    expect(Object.keys(tokens.dark).length).toBeGreaterThan(300);
    for (const name of [
      '--h-indigo-500', // primitive palette
      '--h-primary-color', // semantic
      '--h-surface-0',
      '--h-text-color',
      '--h-button-primary-background', // component sets
      '--h-select-border-color',
      '--h-datatable-header-cell-background',
      '--h-tooltip-background',
    ]) {
      expect(tokens.light, name).toHaveProperty(name);
    }
  });

  it('keeps references as var() chains and the Helix colours as values', () => {
    expect(tokens.light['--h-primary-color']).toBe('var(--h-primary-600)');
    expect(tokens.dark['--h-primary-color']).toBe('var(--h-primary-400)');
    expect(tokens.light['--h-surface-0']).toBe('#ffffff');
    expect(tokens.light['--h-button-primary-background']).toBe('var(--h-primary-color)');
  });

  it('is consistent: the JSON is the CSS split by colour scheme', async () => {
    const { tokensOf } = await import('../export-tokens.mjs');
    expect(`${JSON.stringify(tokensOf(golden.css), null, 2)}\n`).toBe(golden.json);
  });
});

describe.skipIf(!built)('helix-core engine output (built core)', () => {
  it('still equals the golden fixtures', async () => {
    const now = await currentTokens();
    // Written as booleans first so a mismatch does not dump 170 kB into the report.
    expect(
      now.css === golden.css,
      'CSS differs from helix-tokens.golden.css (run pnpm tokens:golden if intended)',
    ).toBe(true);
    expect(now.json === golden.json, 'JSON differs from helix-tokens.golden.json').toBe(true);
  });

  it('is deterministic', async () => {
    const [a, b] = await Promise.all([currentTokens(), currentTokens()]);
    expect(a.css === b.css).toBe(true);
  });
});
