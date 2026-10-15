import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const SCRIPT = resolve(__dirname, '../generate-source-assets.mjs');
const PAGES = 'apps/helix-demo/src/app/pages';
const OUT = 'apps/helix-demo/public/source';

let cwd: string;

function write(rel: string, content = 'x'): void {
  mkdirSync(dirname(join(cwd, rel)), { recursive: true });
  writeFileSync(join(cwd, rel), content);
}

/** The script resolves all its paths against the working directory, so it runs against a fixture tree. */
function run() {
  return spawnSync(process.execPath, [SCRIPT], { cwd, encoding: 'utf8' });
}

describe('generate-source-assets', () => {
  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), 'source-assets-'));
  });
  afterEach(() => rmSync(cwd, { recursive: true, force: true }));

  it('copies uikit pages to source/{page}, skipping specs and empty stylesheets', () => {
    write(`${PAGES}/uikit/button/button-demo.ts`, 'ts');
    write(`${PAGES}/uikit/button/button-demo.html`, 'html');
    write(`${PAGES}/uikit/button/button-demo.scss`, '  \n');
    write(`${PAGES}/uikit/button/button-demo.spec.ts`);

    expect(run().status).toBe(0);
    expect(readFileSync(join(cwd, OUT, 'button/button-demo.ts'), 'utf8')).toBe('ts');
    expect(existsSync(join(cwd, OUT, 'button/button-demo.html'))).toBe(true);
    expect(existsSync(join(cwd, OUT, 'button/button-demo.scss'))).toBe(false);
    expect(existsSync(join(cwd, OUT, 'button/button-demo.spec.ts'))).toBe(false);
  });

  it('collects pages from the ag-grid and charts groups too', () => {
    write(`${PAGES}/uikit/button/button-demo.ts`);
    write(`${PAGES}/ag-grid/table/table-demo.ts`);
    write(`${PAGES}/charts/chart/chart-demo.ts`);

    expect(run().status).toBe(0);
    expect(existsSync(join(cwd, OUT, 'button/button-demo.ts'))).toBe(true);
    expect(existsSync(join(cwd, OUT, 'table/table-demo.ts'))).toBe(true);
    expect(existsSync(join(cwd, OUT, 'chart/chart-demo.ts'))).toBe(true);
  });

  it('skips groups that do not exist', () => {
    write(`${PAGES}/uikit/button/button-demo.ts`);

    const result = run();
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('1 file(s) copied');
  });

  it('fails loudly when two groups have a page of the same name', () => {
    write(`${PAGES}/uikit/table/table-demo.ts`);
    write(`${PAGES}/ag-grid/table/table-demo.ts`);

    const result = run();
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('page directory "table" exists in both');
  });
});
