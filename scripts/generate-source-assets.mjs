/**
 * Copies the demo app's page sources into the public assets folder so
 * the SourceTabsComponent can fetch and display them at runtime.
 *
 * Files end up served at `/source/{page-dir}/{filename}`. Page directories
 * are collected from several groups (`PAGE_GROUPS`); groups that do not exist
 * yet are skipped, and a page directory name used by two groups fails the run.
 * Run via `pnpm demo:generate-sources` (wired into `start` and demo builds).
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PAGE_GROUPS = [
  'apps/helix-demo/src/app/pages/uikit',
  'apps/helix-demo/src/app/pages/ag-grid',
  'apps/helix-demo/src/app/pages/charts',
];
const OUT_DIR = 'apps/helix-demo/public/source';

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

let copied = 0;
/** page directory name -> group it came from */
const seen = new Map();
for (const group of PAGE_GROUPS) {
  if (!existsSync(group)) continue;
  for (const entry of readdirSync(group)) {
    const dir = join(group, entry);
    if (!statSync(dir).isDirectory()) continue;

    if (seen.has(entry)) {
      throw new Error(
        `generate-source-assets: page directory "${entry}" exists in both ${seen.get(entry)} and ${group}`,
      );
    }
    seen.set(entry, group);

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
}
console.log(`generate-source-assets: ${copied} file(s) copied to ${OUT_DIR}`);
