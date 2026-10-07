import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DARK_SELECTOR, resolvePreset, tokensOf } from '../export-tokens.mjs';

const FESM = resolve(__dirname, '../../dist/core/fesm2022');

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

// The presets and the engine come from the built library (`pnpm build:core`).
describe.skipIf(!existsSync(FESM))('resolvePreset (built core)', () => {
  const load = async (name: string) => {
    const { Theme } = await import(resolve(FESM, 'gravionlabs-helix-core-themes.mjs'));
    const module = await import(resolve(FESM, `gravionlabs-helix-core-themes-${name}.mjs`));
    return { Theme, preset: module[`${name}Preset`] };
  };

  it('resolves helixPreset to the full token set, light and dark', async () => {
    const { Theme, preset } = await load('helix');
    const tokens = tokensOf(resolvePreset(Theme, preset));
    expect(tokens.light['--h-primary-color']).toBeDefined();
    expect(tokens.light['--h-button-primary-background']).toBeDefined();
    expect(tokens.dark['--h-stone-50']).toBeUndefined(); // primitive: not per scheme
    expect(tokens.dark['--h-surface-0']).toBeDefined(); // semantic, per colour scheme
    expect(tokens.dark['--h-primary-color']).toBeDefined();
    expect(Object.keys(tokens.light).length).toBeGreaterThan(1000);
  });

  it('helixPreset equals Aura until the mockups (#521) fill helixOverrides', async () => {
    const helix = await load('helix');
    const aura = await load('aura');
    expect(resolvePreset(helix.Theme, helix.preset)).toBe(resolvePreset(aura.Theme, aura.preset));
  });
});
