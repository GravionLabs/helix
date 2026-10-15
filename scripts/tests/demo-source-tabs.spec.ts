import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// Every demo page wraps itself in `app-source-tabs`: it names its library, and its `directory` and
// `componentName` point at files that `generate-source-assets.mjs` really copies (#953).
const ROOT = resolve(__dirname, '../..');
const SCRIPT = join(ROOT, 'scripts/generate-source-assets.mjs');
const PAGES = join(ROOT, 'apps/helix-demo/src/app/pages');
const LIBRARIES = ['helix-ui', 'helix-ag-grid', 'helix-shell', 'helix-zod'];

function* htmlFiles(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}

/** The demo pages: every `*-demo.html` outside the uikit sections, plus the CRUD page. */
const pages = [...htmlFiles(PAGES)]
  .map((f) => relative(PAGES, f))
  .filter(
    (f) => (/-demo\.html$/.test(f) && !f.includes('/sections/')) || f === 'ag-grid/crud/crud.html',
  );

function attr(tag: string, name: string): string | undefined {
  return new RegExp(`(?:^|\\s)${name}="([^"]*)"`).exec(tag)?.[1];
}

let cwd: string;
let out: string;

beforeAll(() => {
  // The script resolves its paths against the working directory: give it the real pages in a scratch tree.
  cwd = mkdtempSync(join(tmpdir(), 'demo-source-tabs-'));
  mkdirSync(join(cwd, 'apps/helix-demo/src/app'), { recursive: true });
  symlinkSync(PAGES, join(cwd, 'apps/helix-demo/src/app/pages'), 'dir');
  const result = spawnSync(process.execPath, [SCRIPT], { cwd, encoding: 'utf8' });
  expect(result.status, result.stderr).toBe(0);
  out = join(cwd, 'apps/helix-demo/public/source');
});
afterAll(() => rmSync(cwd, { recursive: true, force: true }));

describe('demo pages: app-source-tabs', () => {
  it('finds the pages of every group', () => {
    expect(pages.length).toBeGreaterThanOrEqual(20);
    expect(pages).toEqual(
      expect.arrayContaining([
        'ag-grid/overview/table-demo.html',
        'ag-grid/cells/cells-demo.html',
        'ag-grid/crud/crud.html',
        'charts/line/line-chart-demo.html',
        'charts/bar/bar-chart-demo.html',
        'uikit/button/button-demo.html',
      ]),
    );
  });

  it.each(pages)('%s names its library and loads its own sources', (page) => {
    const tag = /<app-source-tabs\b([^>]*)>/.exec(readFileSync(join(PAGES, page), 'utf8'))?.[1];
    expect(tag, 'app-source-tabs').toBeDefined();

    expect(LIBRARIES).toContain(attr(tag!, 'library'));

    const [group, folder] = page.split('/');
    const directory = attr(tag!, 'directory');
    expect(directory).toBe(group === 'uikit' ? folder : `${group}/${folder}`);

    const name = attr(tag!, 'componentName');
    expect(`${name}.html`).toBe(page.split('/').pop());
    const extras = [...(attr(tag!, '\\[extraSources\\]') ?? '').matchAll(/'([^']+)'/g)].map(
      (m) => m[1],
    );
    for (const file of [`${name}.html`, `${name}.ts`, ...extras]) {
      expect(existsSync(join(out, directory!, file)), `${directory}/${file}`).toBe(true);
    }
  });
});
