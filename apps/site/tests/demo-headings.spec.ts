import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// #525: section titles of the demo are headings, and every page has one h1. Lives with the site's
// tests because they are the node tests that run in CI (`test:ci`) and already know the demo's pages.
const PAGES = resolve(__dirname, '../../helix-demo/src/app/pages');

function* sources(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* sources(path);
    else if (/\.(html|ts)$/.test(entry.name) && !entry.name.endsWith('.spec.ts')) yield path;
  }
}

const isPage = (path: string) =>
  /uikit\/[^/]+\/[^/]+-demo\.html$/.test(path) ||
  path.endsWith('dashboard/dashboard.html') ||
  path.endsWith('documentation/documentation.ts');

describe('demo headings', () => {
  const files = [...sources(PAGES)];

  it('has no div styled as a section title', () => {
    const offenders = files.filter((f) =>
      /<div class="font-semibold text-(xl|2xl)/.test(readFileSync(f, 'utf8')),
    );
    expect(offenders).toEqual([]);
  });

  it('gives every page exactly one h1', () => {
    const pages = files.filter(isPage);
    expect(pages.length).toBeGreaterThanOrEqual(20);
    for (const page of pages) {
      const h1 = (readFileSync(page, 'utf8').match(/<h1[\s>]/g) ?? []).length;
      expect({ page, h1 }).toEqual({ page, h1: 1 });
    }
  });

  it('never skips a level: no h3 or deeper without an h2 on the page', () => {
    for (const page of files.filter(isPage)) {
      const html = readFileSync(page, 'utf8');
      if (/<h[3-6][\s>]/.test(html))
        expect({ page, h2: /<h2[\s>]/.test(html) }).toEqual({ page, h2: true });
    }
  });
});
