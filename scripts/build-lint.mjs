#!/usr/bin/env node
// Copies the plain-file lint package (projects/lint) to dist/lint; it has no Angular build (ADR 0009).
// Usage: node scripts/build-lint.mjs [<src> <out>]
import { cpSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/** Copies the package files of `src` to a fresh `out`. */
export function buildLint(src = 'projects/lint', out = 'dist/lint') {
  rmSync(out, { recursive: true, force: true });
  cpSync(src, out, { recursive: true });
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const [src, out] = process.argv.slice(2);
  buildLint(src, out);
}
