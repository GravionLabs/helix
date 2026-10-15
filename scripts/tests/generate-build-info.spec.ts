import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const SCRIPT = resolve(__dirname, '../generate-build-info.mjs');
const OUT = 'apps/helix-demo/src/app/shell/build-info.ts';

let cwd: string;

/** The script resolves its output path against the working directory, so it runs in a temp dir. */
function run(version?: string) {
  const env = { ...process.env };
  delete env.HELIX_VERSION;
  if (version !== undefined) env.HELIX_VERSION = version;
  return spawnSync(process.execPath, [SCRIPT], { cwd, env, encoding: 'utf8' });
}

function generated(): string {
  return readFileSync(join(cwd, OUT), 'utf8');
}

describe('generate-build-info', () => {
  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), 'build-info-'));
  });
  afterEach(() => rmSync(cwd, { recursive: true, force: true }));

  it('embeds HELIX_VERSION', () => {
    expect(run('22.2.7').status).toBe(0);
    expect(generated()).toContain("export const BUILD_VERSION = '22.2.7';");
  });

  it('falls back to the dev version when HELIX_VERSION is unset', () => {
    expect(run().status).toBe(0);
    expect(generated()).toContain("export const BUILD_VERSION = '0.0.0-dev';");
  });

  it('falls back to the dev version when HELIX_VERSION is empty or blank', () => {
    expect(run('  ').status).toBe(0);
    expect(generated()).toContain("BUILD_VERSION = '0.0.0-dev';");
  });

  it('escapes the value so an odd version cannot break the file', () => {
    expect(run("1.0.0'; evil()").status).toBe(0);
    expect(generated()).toContain("BUILD_VERSION = '1.0.0\\'; evil()';");
  });
});
