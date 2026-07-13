/**
 * Copies the demo app's uikit page sources into the public assets folder so
 * the SourceTabsComponent can fetch and display them at runtime.
 *
 * Files end up served at `/source/{page-dir}/{filename}`.
 * Run via `pnpm demo:generate-sources` (wired into `start` and demo builds).
 */
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PAGES_DIR = 'apps/helix-demo/src/app/pages/uikit';
const OUT_DIR = 'apps/helix-demo/public/source';

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

let copied = 0;
for (const entry of readdirSync(PAGES_DIR)) {
  const dir = join(PAGES_DIR, entry);
  if (!statSync(dir).isDirectory()) continue;

  for (const file of readdirSync(dir)) {
    if (!/\.(ts|html|scss)$/.test(file) || file.endsWith('.spec.ts')) continue;
    // Skip empty stylesheets — SourceTabs hides the SCSS tab on 404.
    if (file.endsWith('.scss') && readFileSync(join(dir, file), 'utf8').trim() === '') continue;

    mkdirSync(join(OUT_DIR, entry), { recursive: true });
    cpSync(join(dir, file), join(OUT_DIR, entry, file));
    console.log(`source asset: ${entry}/${file}`);
    copied++;
  }
}
console.log(`generate-source-assets: ${copied} file(s) copied to ${OUT_DIR}`);
