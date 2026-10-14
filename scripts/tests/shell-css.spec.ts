import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '../..');
const tailwind = join(ROOT, 'node_modules/.bin/tailwindcss');

const build = (input: string, out: string) =>
  execFileSync(tailwind, ['-i', join(ROOT, input), '-o', out], { cwd: ROOT, stdio: 'pipe' });

// top-level rules only: strips @layer blocks' contents by tracking brace depth
const unlayeredSelectors = (css: string): string[] => {
  const found: string[] = [];
  let depth = 0;
  let buf = '';
  const layerDepths: number[] = [];
  for (const ch of css.replace(/\/\*[\s\S]*?\*\//g, '')) {
    if (ch === '{') {
      const head = buf.trim();
      if (/^@layer/.test(head)) layerDepths.push(depth);
      else if (layerDepths.length === 0 && !head.startsWith('@')) found.push(head);
      depth++;
      buf = '';
    } else if (ch === '}') {
      depth--;
      if (layerDepths.at(-1) === depth) layerDepths.pop();
      buf = '';
    } else if (ch === ';') buf = '';
    else buf += ch;
  }
  return found;
};

describe('shell stylesheet build', () => {
  const dir = mkdtempSync(join(tmpdir(), 'shell-css-'));
  const styles = join(dir, 'styles.css');
  const globals = join(dir, 'globals.css');
  build('projects/shell/styles-src.css', styles);
  build('projects/shell/globals-src.css', globals);
  const stylesCss = readFileSync(styles, 'utf8');
  const globalsCss = readFileSync(globals, 'utf8');
  const pageSelector = (s: string) =>
    /(^|[\s,])(html|body)\s*$/.test(s) || /^(html|body)\b/.test(s);

  it('has no unlayered html or body rule in styles.css', () => {
    expect(unlayeredSelectors(stylesCss).filter(pageSelector)).toEqual([]);
  });

  it('keeps the app-dark surface overrides in styles.css', () => {
    expect(stylesCss).toMatch(/:root\[class\*=["']?app-dark["']?\]/);
  });

  it('carries the page rules in the opt-in globals.css', () => {
    expect(unlayeredSelectors(globalsCss)).toEqual(expect.arrayContaining(['html', 'body']));
    expect(globalsCss).toMatch(/font-size:\s*14px/);
  });

  it('exports globals.css next to styles.css from the package', () => {
    const pkgDir = mkdtempSync(join(tmpdir(), 'shell-pkg-'));
    writeFileSync(join(pkgDir, 'package.json'), '{"name":"x"}');
    writeFileSync(join(pkgDir, 'styles.css'), '');
    writeFileSync(join(pkgDir, 'globals.css'), '');
    execFileSync('node', [join(ROOT, 'scripts/add-css-export.mjs'), pkgDir, 'globals.css'], {
      stdio: 'pipe',
    });
    const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));
    expect(pkg.exports).toEqual({
      './styles.css': './styles.css',
      './globals.css': './globals.css',
    });
    expect(existsSync(join(pkgDir, 'globals.css'))).toBe(true);
  });
});
