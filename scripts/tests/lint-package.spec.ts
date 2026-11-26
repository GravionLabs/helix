import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
// @ts-expect-error plain .mjs script without types
import { buildLint } from '../build-lint.mjs';

const src = 'projects/lint';
const pkg = JSON.parse(readFileSync(join(src, 'package.json'), 'utf8'));

describe('@gravionlabs/helix-lint package', () => {
  let out: string | undefined;
  afterEach(() => out && rmSync(dirname(out), { recursive: true, force: true }));

  it('declares the package of ADR 0009', () => {
    expect(pkg.name).toBe('@gravionlabs/helix-lint');
    expect(pkg.type).toBe('module');
    expect(pkg.publishConfig).toEqual({ access: 'public' });
    expect(pkg.repository.directory).toBe('projects/lint');
    expect(pkg.peerDependencies).toEqual({
      '@angular-eslint/template-parser': '^22',
      eslint: '^10',
      stylelint: '^18',
    });
    expect(Object.keys(pkg.exports)).toEqual(expect.arrayContaining(['./stylelint', './eslint']));
  });

  it('build copies the package to the out dir with importable entries', async () => {
    // inside the workspace, so the peer dependencies of the entries resolve
    mkdirSync('dist', { recursive: true });
    out = join(mkdtempSync(resolve('dist/helix-lint-')), 'lint');
    buildLint(src, out);
    for (const file of ['package.json', 'README.md', 'LICENSE.md']) {
      expect(existsSync(join(out, file))).toBe(true);
    }
    const stylelint = (await import(pathToFileURL(join(out, pkg.exports['./stylelint'])).href))
      .default;
    const eslint = (await import(pathToFileURL(join(out, pkg.exports['./eslint'])).href)).default;
    expect(Object.keys(stylelint.rules)).toContain('color-no-hex');
    expect(Object.keys(eslint[0].rules)).toEqual(['helix/no-raw-control']);
  });

  it('ci versions and publishes lint', () => {
    const ci = readFileSync('.github/workflows/ci.yml', 'utf8');
    expect(ci).toMatch(/for dir in [^;]*\blint\b[^;]*; do/);
    expect(ci).toMatch(/publish-packages\.mjs "[^"]*"[^\n]*\blint\b/);
  });
});
