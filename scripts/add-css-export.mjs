#!/usr/bin/env node
/**
 * ng-packagr generates dist/<pkg>/package.json's "exports" map from the TS
 * entry point only; it knows nothing about the styles.css the tailwindcss
 * CLI drops into the same directory afterward (build:lib:css /
 * build:lib:css:ag-grid). Without an explicit "./styles.css" export,
 * Node's strict exports resolution 404s on
 * `@gravionlabs/helix-shell/styles.css` even though the file exists.
 *
 * Run after the CSS build step: `node scripts/add-css-export.mjs dist/shell`
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const distDir = process.argv[2];
if (!distDir) {
  console.error('usage: add-css-export.mjs <dist-dir>');
  process.exit(1);
}

const pkgPath = join(distDir, 'package.json');
const cssPath = join(distDir, 'styles.css');

if (!existsSync(cssPath)) {
  console.error(`add-css-export: ${cssPath} does not exist — run the CSS build first`);
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
pkg.exports ??= {};
pkg.exports['./styles.css'] = './styles.css';
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
console.log(`add-css-export: added "./styles.css" to ${pkgPath}`);
