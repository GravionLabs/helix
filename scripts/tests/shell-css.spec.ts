import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '../..');
const tailwind = join(ROOT, 'node_modules/.bin/tailwindcss');

const build = (input: string, out: string, content?: string) =>
  execFileSync(
    tailwind,
    ['-i', join(ROOT, input), '-o', out, ...(content ? ['--content', content] : [])],
    { cwd: ROOT, stdio: 'pipe' },
  );

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
  let stylesCss = '';
  let globalsCss = '';
  beforeAll(() => {
    build(
      'projects/shell/styles-src.css',
      join(dir, 'styles.css'),
      'projects/shell/src/**/*.{html,ts}',
    );
    build('projects/shell/globals-src.css', join(dir, 'globals.css'));
    stylesCss = readFileSync(join(dir, 'styles.css'), 'utf8');
    globalsCss = readFileSync(join(dir, 'globals.css'), 'utf8');
  }, 120_000);
  const pageSelector = (s: string) =>
    /(^|[\s,])(html|body)\s*$/.test(s) || /^(html|body)\b/.test(s);

  it('has no unlayered html or body rule in styles.css', () => {
    expect(unlayeredSelectors(stylesCss).filter(pageSelector)).toEqual([]);
  });

  it('keeps the app-dark surface overrides in styles.css', () => {
    expect(stylesCss).toMatch(/:root\[class\*=["']?app-dark["']?\]/);
  });

  it('keeps the data-theme dark surface overrides and a dark: utility for the attribute', () => {
    expect(stylesCss).toMatch(/:root\[data-theme=["']?dark["']?\]/);
    expect(stylesCss).toMatch(/\.dark\\:[^{]*\[data-theme="dark"\][^{]*\{/);
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

  it('fails on a listed extra file that is missing and leaves package.json untouched', () => {
    const pkgDir = mkdtempSync(join(tmpdir(), 'shell-pkg-'));
    const original = '{"name":"x"}';
    writeFileSync(join(pkgDir, 'package.json'), original);
    writeFileSync(join(pkgDir, 'styles.css'), '');
    let status: number | null = 0;
    let stderr = '';
    try {
      execFileSync('node', [join(ROOT, 'scripts/add-css-export.mjs'), pkgDir, 'globals.css'], {
        stdio: 'pipe',
      });
    } catch (e) {
      const err = e as { status: number | null; stderr: Buffer };
      status = err.status;
      stderr = err.stderr.toString();
    }
    expect(status).not.toBe(0);
    expect(stderr).toContain('globals.css does not exist');
    expect(readFileSync(join(pkgDir, 'package.json'), 'utf8')).toBe(original);
  });

  it('wires globals.css into build:lib:css and the demo styles', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    expect(pkg.scripts['build:lib:css']).toMatch(/add-css-export\.mjs dist\/shell globals\.css/);
    const angular = JSON.parse(readFileSync(join(ROOT, 'angular.json'), 'utf8'));
    expect(JSON.stringify(angular)).toContain('dist/shell/globals.css');
  });
});
