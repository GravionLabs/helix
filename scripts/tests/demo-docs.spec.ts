import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DEMO_ROUTES } from '../../apps/site/.vitepress/demo-links';

const ROOT = resolve(__dirname, '../..');
const PAGES = join(ROOT, 'apps/helix-demo/src/app/pages');
const SECTIONS = ['uikit', 'charts'];

/** The `docs` slugs each demo page passes to `app-source-tabs`. */
function pageDocs(): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const section of SECTIONS) {
    for (const dir of readdirSync(join(PAGES, section), { withFileTypes: true })) {
      if (!dir.isDirectory() || dir.name === 'sections') continue;
      const folder = join(PAGES, section, dir.name);
      const html = readdirSync(folder).find((f) => f.endsWith('-demo.html'));
      if (!html) continue;
      const source = readFileSync(join(folder, html), 'utf8');
      const match = /<app-source-tabs[^>]*\[docs\]="\[([^\]]*)\]"/.exec(source);
      result[`${section}/${dir.name}`] = match
        ? [...match[1].matchAll(/'([\w-]+)'/g)].map((m) => m[1])
        : [];
    }
  }
  return result;
}

describe('demo pages: Docs tab', () => {
  const docs = pageDocs();

  it('every demo page wraps app-source-tabs', () => {
    expect(Object.keys(docs).length).toBeGreaterThan(15);
  });

  it('links the same component pages as the site maps to the demo route', () => {
    for (const [route, slugs] of Object.entries(DEMO_ROUTES)) {
      expect(docs[route], route).toEqual([...slugs]);
    }
    for (const [page, slugs] of Object.entries(docs)) {
      if (slugs.length) expect(DEMO_ROUTES[page], page).toBeDefined();
    }
  });

  it('every linked slug is a page of docs/components', () => {
    for (const slugs of Object.values(docs))
      for (const slug of slugs)
        expect(existsSync(join(ROOT, 'docs/components', `${slug}.md`)), slug).toBe(true);
  });
});
