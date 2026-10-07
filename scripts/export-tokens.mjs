#!/usr/bin/env node
// Resolves a helix-core theme preset to static CSS and JSON — the design tokens
// as the docs site, the design-system sync (#522) and helix-ui (epic #523) read
// them, without the runtime engine (ADR 0001). Run: pnpm tokens:export [preset …]
//
// Needs `dist/core` (`pnpm build:core`): the presets and the styling engine are
// imported from the built bundles, which have no Angular dependency.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FESM = path.join(ROOT, 'dist/core/fesm2022');
const OUT = path.join(ROOT, 'dist/tokens');

/** The dark-mode selector of the shell and the demo (`provideHelix` in `app.config.ts`). */
export const DARK_SELECTOR = '.app-dark';
export const PRESETS = ['helix', 'aura', 'lara', 'nora'];

/**
 * The CSS of a preset: primitive, semantic and global variables (light, then dark
 * under `darkSelector`), then every component's variables, in the order the engine
 * emits them at runtime.
 */
export function resolvePreset(Theme, preset, darkSelector = DARK_SELECTOR) {
  Theme.setTheme({ preset, options: { prefix: 'h', darkModeSelector: darkSelector } });
  const common = Theme.getCommon('common');
  const parts = [common.primitive.css, common.semantic.css, common.global.css];
  for (const name of Object.keys(preset.components ?? {}).sort()) {
    parts.push(Theme.getComponent(name).css);
  }
  return parts.filter(Boolean).join('\n');
}

/**
 * The custom properties of resolved CSS, by colour scheme: a declaration inside a
 * rule whose selector contains `darkSelector` is dark, every other one is light.
 */
export function tokensOf(css, darkSelector = DARK_SELECTOR) {
  const tokens = { light: {}, dark: {} };
  for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const scheme = selector.includes(darkSelector) ? 'dark' : 'light';
    for (const [, name, value] of body.matchAll(/(--h-[\w-]+)\s*:\s*([^;]+)/g)) {
      tokens[scheme][name] = value.trim();
    }
  }
  return tokens;
}

async function loadPreset(name) {
  const engine = await import(path.join(FESM, 'gravionlabs-helix-core-themes.mjs'));
  const module = await import(path.join(FESM, `gravionlabs-helix-core-themes-${name}.mjs`));
  const preset = module[`${name}Preset`];
  if (!preset) throw new Error(`no ${name}Preset exported by themes/${name}`);
  return { Theme: engine.Theme, preset };
}

export async function exportPreset(name, outDir = OUT) {
  const { Theme, preset } = await loadPreset(name);
  const css = resolvePreset(Theme, preset);
  const tokens = tokensOf(css);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${name}.css`), `${css}\n`);
  fs.writeFileSync(path.join(outDir, `${name}.json`), `${JSON.stringify(tokens, null, 2)}\n`);
  return { css, tokens };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!fs.existsSync(FESM)) {
    console.error('dist/core not found — run `pnpm build:core` first');
    process.exit(1);
  }
  const names = process.argv.slice(2).length ? process.argv.slice(2) : ['helix'];
  for (const name of names) {
    if (!PRESETS.includes(name)) {
      console.error(`unknown preset "${name}" (one of ${PRESETS.join(', ')})`);
      process.exit(1);
    }
    const { tokens } = await exportPreset(name);
    const count = (scheme) => Object.keys(tokens[scheme]).length;
    console.log(
      `dist/tokens/${name}.{css,json}: ${count('light')} light / ${count('dark')} dark tokens`,
    );
  }
}
