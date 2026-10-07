#!/usr/bin/env node
// Resolves a helix-core theme preset to static CSS and JSON — the design tokens
// as the docs site, the design-system sync (#522) and helix-ui (epic #523) read
// them, without the runtime engine (ADR 0001). Run: pnpm tokens:export [preset …]
//
// Options: `--base` writes only the primitive, semantic and global layers (no
// component tokens: what a page outside Angular needs, ~1/10 of the size);
// `--dark=<selector>` sets the dark-scheme selector (default `.app-dark`, the
// docs site passes VitePress's `.dark`); `--out=<dir>` the output folder
// (default `dist/tokens`).
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
export function resolvePreset(Theme, preset, darkSelector = DARK_SELECTOR, { components = true } = {}) {
  Theme.setTheme({ preset, options: { prefix: 'h', darkModeSelector: darkSelector } });
  const common = Theme.getCommon('common');
  const parts = [common.primitive.css, common.semantic.css, common.global.css];
  if (components) {
    // `true`: every component of the preset; an array: just those.
    const names = Array.isArray(components) ? components : Object.keys(preset.components ?? {}).sort();
    for (const name of names) parts.push(Theme.getComponent(name).css);
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

export async function loadPreset(name) {
  const engine = await import(path.join(FESM, 'gravionlabs-helix-core-themes.mjs'));
  const module = await import(path.join(FESM, `gravionlabs-helix-core-themes-${name}.mjs`));
  const preset = module[`${name}Preset`];
  if (!preset) throw new Error(`no ${name}Preset exported by themes/${name}`);
  return { Theme: engine.Theme, preset };
}

export async function exportPreset(name, { outDir = OUT, darkSelector = DARK_SELECTOR, base = false } = {}) {
  const { Theme, preset } = await loadPreset(name);
  const css = resolvePreset(Theme, preset, darkSelector, { components: !base });
  const tokens = tokensOf(css, darkSelector);
  const stem = base ? `${name}.base` : name;
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${stem}.css`), `${css}\n`);
  fs.writeFileSync(path.join(outDir, `${stem}.json`), `${JSON.stringify(tokens, null, 2)}\n`);
  return { css, tokens, stem };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!fs.existsSync(FESM)) {
    console.error('dist/core not found — run `pnpm build:core` first');
    process.exit(1);
  }
  const args = process.argv.slice(2);
  const flag = (key) => args.find((a) => a.startsWith(`--${key}=`))?.slice(key.length + 3);
  const options = {
    base: args.includes('--base'),
    darkSelector: flag('dark') ?? DARK_SELECTOR,
    outDir: flag('out') ? path.resolve(ROOT, flag('out')) : OUT,
  };
  const names = args.filter((a) => !a.startsWith('--'));
  for (const name of names.length ? names : ['helix']) {
    if (!PRESETS.includes(name)) {
      console.error(`unknown preset "${name}" (one of ${PRESETS.join(', ')})`);
      process.exit(1);
    }
    const { tokens, stem } = await exportPreset(name, options);
    const count = (scheme) => Object.keys(tokens[scheme]).length;
    console.log(
      `${path.relative(ROOT, options.outDir)}/${stem}.{css,json}: ${count('light')} light / ${count('dark')} dark tokens`,
    );
  }
}
