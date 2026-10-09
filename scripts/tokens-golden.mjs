#!/usr/bin/env node
// Records what the styling engine of helix-core produces for the Helix preset today (#646), so the replacement
// resolver of the token pipeline (#648) can prove it emits the same CSS variables.
//
// Writes scripts/tests/fixtures/helix-tokens.golden.{css,json}: the complete output (primitive, semantic and
// global layers, then every component token set; light on `:root,:host`, dark under `.app-dark`) and the same as
// JSON by colour scheme. Temporary: removed together with helix-core (epic #585).
//
// Run: pnpm tokens:golden   (needs `pnpm build:core`)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DARK_SELECTOR, tokensOf } from './export-tokens.mjs';
import { loadPreset, resolvePreset } from './tokens/core-engine.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const FIXTURES = path.join(ROOT, 'scripts/tests/fixtures');
export const GOLDEN_CSS = path.join(FIXTURES, 'helix-tokens.golden.css');
export const GOLDEN_JSON = path.join(FIXTURES, 'helix-tokens.golden.json');

/** The current pipeline output for the Helix preset, as the two golden files hold it. */
export async function currentTokens() {
  const { Theme, preset } = await loadPreset('helix');
  const css = `${resolvePreset(Theme, preset, DARK_SELECTOR, { components: true })}\n`;
  const json = `${JSON.stringify(tokensOf(css, DARK_SELECTOR), null, 2)}\n`;
  return { css, json };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!fs.existsSync(path.join(ROOT, 'dist/core/fesm2022'))) {
    console.error('dist/core not found — run `pnpm build:core` first');
    process.exit(1);
  }
  const { css, json } = await currentTokens();
  fs.mkdirSync(FIXTURES, { recursive: true });
  fs.writeFileSync(GOLDEN_CSS, css);
  fs.writeFileSync(GOLDEN_JSON, json);
  const count = JSON.parse(json);
  console.log(
    `${path.relative(ROOT, GOLDEN_CSS)}: ${(css.length / 1024).toFixed(0)} kB, ${Object.keys(count.light).length} light / ${Object.keys(count.dark).length} dark tokens`,
  );
}
