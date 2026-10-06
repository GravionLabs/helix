// Puts the pieces of the public site into one folder, the artifact that GitHub Pages serves:
//
//   /        the documentation site (VitePress, apps/site)
//   /demo/   the Angular demo (helix-demo, built with --base-href <base>demo/)
//
// Usage: node scripts/assemble.mjs <out>   (from apps/site, after both builds; see pages.yml)
import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Where each piece is built, relative to the top folder of the repository. */
export const PIECES = {
  site: 'apps/site/.vitepress/dist',
  demo: 'dist/helix-demo/browser',
};

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Copies the built pieces from `repo` into `out` (which is emptied first).
 * Throws, naming the piece, when one is missing: a half-built site must not be published.
 */
export function assemble(repo, out) {
  const from = (piece) => resolve(repo, PIECES[piece]);
  for (const piece of Object.keys(PIECES)) {
    if (!existsSync(from(piece))) {
      throw new Error(`The ${piece} is not built: ${PIECES[piece]} is missing.`);
    }
  }
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  cpSync(from('site'), out, { recursive: true });
  cpSync(from('demo'), join(out, 'demo'), { recursive: true });
  // Pages only honours the 404.html of the root: it sends deep links of the demo into its router.
  copyFileSync(join(here, '404.html'), join(out, '404.html'));
  writeFileSync(join(out, '.nojekyll'), '');
  return out;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = process.argv[2];
  if (!out) {
    console.error('Usage: node scripts/assemble.mjs <out>');
    process.exit(2);
  }
  try {
    console.log(`Assembled the site in ${assemble(resolve(here, '../../..'), resolve(out))}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
