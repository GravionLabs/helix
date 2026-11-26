import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
// @ts-expect-error plain .mjs script without types
import { buildLint } from '../build-lint.mjs';

const src = 'projects/lint';
const pkg = JSON.parse(readFileSync(join(src, 'package.json'), 'utf8'));

describe('@gravionlabs/helix-lint package', () => {
  let out: string | undefined;
  afterEach(() => out && rmSync(out, { recursive: true, force: true }));

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

  it('build copies the package to the out dir with valid placeholder entries', async () => {
    out = join(mkdtempSync(join(tmpdir(), 'helix-lint-')), 'lint');
    buildLint(src, out);
    for (const file of ['package.json', 'README.md', 'LICENSE.md']) {
      expect(existsSync(join(out, file))).toBe(true);
    }
    const stylelint = (await import(pathToFileURL(join(out, pkg.exports['./stylelint'])).href))
      .default;
    const eslint = (await import(pathToFileURL(join(out, pkg.exports['./eslint'])).href)).default;
    expect(stylelint).toEqual({});
    expect(eslint).toEqual([]);
  });

  it('ci versions and publishes lint', () => {
    const ci = readFileSync('.github/workflows/ci.yml', 'utf8');
    expect(ci).toMatch(/for dir in [^;]*\blint\b[^;]*; do/);
    expect(ci).toMatch(/publish-packages\.mjs "[^"]*"[^\n]*\blint\b/);
  });
});
