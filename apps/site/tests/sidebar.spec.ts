import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { componentGroups, componentPagesOf, sidebarOf } from '../.vitepress/sidebar';

const docs = resolve(__dirname, '../../../docs');
const index = readFileSync(resolve(docs, 'components/README.md'), 'utf8');

describe('componentGroups', () => {
  const sample = [
    '# Title',
    '## Components (2)',
    '| Module | Description |',
    '| --- | --- |',
    '| [Button](button.md) | A button. |',
    '| [Card](card.md#api) |  |',
    '## Directives (1)',
    '| [Ripple](ripple.md) | Ripple. |',
    '## Empty (0)',
  ].join('\n');

  it('makes one group per heading, without the count', () => {
    expect(componentGroups(sample).map((g) => g.text)).toEqual(['Components', 'Directives']);
  });

  it('turns the table rows into page links, dropping anchors', () => {
    expect(componentGroups(sample)[0].items).toEqual([
      { text: 'Button', link: '/components/button' },
      { text: 'Card', link: '/components/card' },
    ]);
  });

  it('skips groups without rows', () => {
    expect(componentGroups('## Nothing (0)\n')).toEqual([]);
  });
});

describe('the sidebar of the real docs', () => {
  const pages = componentPagesOf(sidebarOf(index));

  it('lists every page under docs/components', () => {
    const files = readdirSync(resolve(docs, 'components'))
      .filter((f) => f.endsWith('.md') && f !== 'README.md' && !f.startsWith('_'))
      .map((f) => f.replace(/\.md$/, ''));
    expect(files.filter((f) => !pages.includes(f))).toEqual([]);
  });

  it('links only to pages that exist', () => {
    const files = new Set(
      readdirSync(resolve(docs, 'components')).map((f) => f.replace(/\.md$/, '')),
    );
    expect(pages.filter((p) => !files.has(p))).toEqual([]);
  });

  it('has no page twice', () => {
    expect(new Set(pages).size).toBe(pages.length);
  });
});

describe('the guides of the sidebar', () => {
  const guides = sidebarOf(index)[0].items;

  it('lists the Helix Code guide, and its file exists', () => {
    expect(guides).toContainEqual({ text: 'Helix Code', link: '/HELIX-CODE' });
    expect(readFileSync(resolve(docs, 'HELIX-CODE.md'), 'utf8')).toContain('# Helix Code');
  });

  it('lists the lint preset guide', () => {
    expect(guides).toContainEqual({ text: 'Lint preset', link: '/LINT' });
  });

  it('lists the UX style guide and the UX rules in its folder', () => {
    expect(guides).toContainEqual({ text: 'UX style guide', link: '/styleguide/STYLEGUIDE' });
    expect(guides).toContainEqual({ text: 'UX rules', link: '/styleguide/ux-rules' });
  });

  it('links every guide to an existing file', () => {
    const missing = guides
      .map((g) => g.link)
      .filter((l) => l !== '/' && l !== '/components/')
      .filter((l) => !existsSync(resolve(docs, `${l.slice(1)}.md`)));
    expect(missing).toEqual([]);
  });
});
