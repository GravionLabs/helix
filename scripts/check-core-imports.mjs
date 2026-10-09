#!/usr/bin/env node
// Guards the migration away from helix-core (#575): the libraries that have moved to @gravionlabs/helix-ui may
// import only the non-visual entry points of @gravionlabs/helix-core that have no replacement there. A
// component, directive or style entry point (button, tooltip, ripple, …) in one of them is an error.
//
// Run: node scripts/check-core-imports.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Entry points of helix-core (`@gravionlabs/helix-core/<entry>`) each library may still import. */
export const ALLOWED = {
  // MenuItem type and the message validators the form field shows (the theme runs on helix-ui's HxTheme)
  shell: ['api', 'validators'],
  // no helix-core at all (the validators come from @gravionlabs/helix-ui/validators)
  zod: [],
  // no helix-core at all
  'ag-grid': [],
};

const IMPORT = /['"]@gravionlabs\/helix-core(?:\/([\w-]+))?(?:\/[^'"]*)?['"]/g;

function* files(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* files(full);
    else if (/\.(ts|html)$/.test(entry.name)) yield full;
  }
}

/** `{ file, line, entry }` for every import of a helix-core entry point the library may not use. */
export function forbiddenCoreImports(root = ROOT, allowed = ALLOWED) {
  const found = [];
  for (const [lib, entries] of Object.entries(allowed)) {
    const src = path.join(root, 'projects', lib, 'src');
    if (!fs.existsSync(src)) continue;
    for (const file of files(src)) {
      const lines = fs.readFileSync(file, 'utf8').split('\n');
      lines.forEach((text, i) => {
        for (const m of text.matchAll(IMPORT)) {
          const entry = m[1] ?? '(root)';
          if (!entries.includes(entry)) found.push({ file: path.relative(root, file), line: i + 1, entry });
        }
      });
    }
  }
  return found;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const found = forbiddenCoreImports();
  for (const { file, line, entry } of found) {
    console.error(`${file}:${line} imports @gravionlabs/helix-core/${entry}; use @gravionlabs/helix-ui instead`);
  }
  if (found.length) process.exit(1);
}
