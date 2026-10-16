import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const SCRIPT = resolve(__dirname, '../generate-build-info.mjs');
const OUT = 'apps/helix-demo/src/app/shell/build-info.ts';

let root: string;

/** The script writes relative to its own location, so a copy runs inside a throwaway repository root. */
function run(env: Record<string, string> = {}) {
  const clean = { ...process.env };
  delete clean.HELIX_VERSION;
  delete clean.HELIX_VERSION_REQUIRED;
  return spawnSync(process.execPath, [join(root, 'scripts/generate-build-info.mjs')], {
    cwd: tmpdir(),
    env: { ...clean, ...env },
    encoding: 'utf8',
  });
}

function generated(): string {
  return readFileSync(join(root, OUT), 'utf8');
}

describe('generate-build-info', () => {
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'build-info-'));
    mkdirSync(join(root, 'scripts'));
    copyFileSync(SCRIPT, join(root, 'scripts/generate-build-info.mjs'));
  });
  afterEach(() => rmSync(root, { recursive: true, force: true }));

  it('embeds HELIX_VERSION, whatever the working directory', () => {
    expect(run({ HELIX_VERSION: '22.2.7' }).status).toBe(0);
    expect(generated()).toContain("export const BUILD_VERSION = '22.2.7';");
  });

  it('trims whitespace around a real version', () => {
    expect(run({ HELIX_VERSION: ' 22.2.7\n' }).status).toBe(0);
    expect(generated()).toContain("BUILD_VERSION = '22.2.7';");
  });

  it('accepts a prerelease and build metadata', () => {
    expect(run({ HELIX_VERSION: '22.3.0-rc.1+abc.5' }).status).toBe(0);
    expect(generated()).toContain("BUILD_VERSION = '22.3.0-rc.1+abc.5';");
  });

  it('falls back to the dev version when HELIX_VERSION is unset', () => {
    expect(run().status).toBe(0);
    expect(generated()).toContain("BUILD_VERSION = '0.0.0-dev';");
  });

  it('falls back to the dev version when HELIX_VERSION is blank', () => {
    expect(run({ HELIX_VERSION: '  ' }).status).toBe(0);
    expect(generated()).toContain("BUILD_VERSION = '0.0.0-dev';");
  });

  it.each([
    ['empty', ''],
    ['blank', '  '],
  ])('fails when the version is required and %s', (_name, value) => {
    const result = run({ HELIX_VERSION: value, HELIX_VERSION_REQUIRED: '1' });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('HELIX_VERSION is empty but required');
  });

  it('fails when the version is required and unset', () => {
    expect(run({ HELIX_VERSION_REQUIRED: '1' }).status).toBe(1);
  });

  it('accepts a real version when it is required', () => {
    expect(run({ HELIX_VERSION: '22.2.7', HELIX_VERSION_REQUIRED: '1' }).status).toBe(0);
  });

  it.each([
    ['a quote', "1.0.0'; evil()"],
    ['a backslash', '1.0.0\\n'],
    ['a newline inside', '1.0.0\n2.0.0'],
    ['a lone carriage return', '1.0.0\r2'],
    ['a line separator', '1.0.0 2'],
    ['a v prefix', 'v22.2.7'],
    ['too few parts', '22.2'],
  ])('rejects a malformed version with %s and writes nothing', (_name, value) => {
    const result = run({ HELIX_VERSION: value });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('is not a version');
    expect(() => generated()).toThrow();
  });
});
