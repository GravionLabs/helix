#!/usr/bin/env node
// Resolves the Helix design tokens (projects/tokens) to static CSS and JSON — the tokens as the docs site, the
// Design System and helix-ui (epic #523) read them, without a runtime engine. Run: pnpm tokens:export [preset …]
//
// Options: `--base` writes only the primitive, semantic and global layers (no
// component tokens: what a page outside Angular needs, ~1/10 of the size);
// `--dark=<selector>` sets the dark-scheme selector (default `.app-dark`, the
// docs site passes VitePress's `.dark`); `--out=<dir>` the output folder
// (default `dist/tokens`).
//
// Needs nothing built: the data is read from projects/tokens, the resolver is scripts/tokens/resolve.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { helixTokens } from '../projects/tokens/src/index.ts';
import { resolveTokens, tokensOf as tokensOfCss } from './tokens/resolve.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'dist/tokens');

/** The dark-mode selector of the shell and the demo (`.app-dark`, set by the theme service). */
export const DARK_SELECTOR = '.app-dark';
/** The presets that have token data (projects/tokens). Aura, Lara and Nora went with the styling engine. */
export const PRESETS = ['helix'];

/**
 * The custom properties of resolved CSS, by colour scheme: a declaration inside a
 * rule whose selector contains `darkSelector` is dark, every other one is light.
 */
export const tokensOf = (css, darkSelector = DARK_SELECTOR) => tokensOfCss(css, darkSelector);

/** The token data of a preset (`{ primitive, semantic, components }`). */
export function loadTokens(name) {
  if (!PRESETS.includes(name)) {
    throw new Error(`unknown preset "${name}": only ${PRESETS.join(', ')} has token data (projects/tokens)`);
  }
  return helixTokens;
}

export function exportPreset(name, { outDir = OUT, darkSelector = DARK_SELECTOR, base = false } = {}) {
  const { css, json: tokens } = resolveTokens(loadTokens(name), { darkSelector, components: !base });
  const stem = base ? `${name}.base` : name;
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${stem}.css`), `${css}\n`);
  fs.writeFileSync(path.join(outDir, `${stem}.json`), `${JSON.stringify(tokens, null, 2)}\n`);
  return { css, tokens, stem };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
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
      console.error(`unknown preset "${name}" (only ${PRESETS.join(', ')} has token data)`);
      process.exit(1);
    }
    const { tokens, stem } = exportPreset(name, options);
    const count = (scheme) => Object.keys(tokens[scheme]).length;
    console.log(
      `${path.relative(ROOT, options.outDir)}/${stem}.{css,json}: ${count('light')} light / ${count('dark')} dark tokens`,
    );
  }
}
