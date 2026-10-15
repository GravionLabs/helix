/**
 * Copies the demo app's page sources into the public assets folder so
 * the SourceTabsComponent can fetch and display them at runtime.
 *
 * Files end up served at `/source/{page-dir}/{filename}` for the uikit pages
 * and at `/source/{group}/{page-dir}/{filename}` for the other groups
 * (`ag-grid/overview`, `charts/overview`), so page names may repeat across
 * groups. Groups that do not exist yet are skipped.
 * Run via `pnpm demo:generate-sources` (wired into `start` and demo builds).
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PAGES = 'apps/helix-demo/src/app/pages';
/** group directory -> output prefix under `source/` */
const PAGE_GROUPS = [
  { dir: `${PAGES}/uikit`, prefix: '' },
  { dir: `${PAGES}/ag-grid`, prefix: 'ag-grid/' },
  { dir: `${PAGES}/charts`, prefix: 'charts/' },
];
const OUT_DIR = 'apps/helix-demo/public/source';

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

let copied = 0;
for (const { dir: group, prefix } of PAGE_GROUPS) {
  if (!existsSync(group)) continue;
  for (const entry of readdirSync(group)) {
    const dir = join(group, entry);
    if (!statSync(dir).isDirectory()) continue;

    const out = `${prefix}${entry}`;

    for (const file of readdirSync(dir)) {
      if (!/\.(ts|html|scss)$/.test(file) || file.endsWith('.spec.ts')) continue;
      // Skip empty stylesheets — SourceTabs hides the SCSS tab on 404.
      if (file.endsWith('.scss') && readFileSync(join(dir, file), 'utf8').trim() === '') continue;

      mkdirSync(join(OUT_DIR, out), { recursive: true });
      cpSync(join(dir, file), join(OUT_DIR, out, file));
      console.log(`source asset: ${out}/${file}`);
      copied++;
    }
  }
}
console.log(`generate-source-assets: ${copied} file(s) copied to ${OUT_DIR}`);
