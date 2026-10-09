import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEMO_ROUTES, demoLinkOf, demoLinksPlugin, demoRouteOf } from '../.vitepress/demo-links';

const repo = resolve(__dirname, '../../..');

/** The routes of the demo's UI kit: `path: '<name>'` of each menu item, under `/uikit/`. */
const uikitRoutes = [
  ...readFileSync(
    resolve(repo, 'apps/helix-demo/src/app/pages/uikit/uikit-menu-items.ts'),
    'utf8',
  ).matchAll(/path:\s*'([^']+)'/g),
].map((m) => `uikit/${m[1]}`);

describe('DEMO_ROUTES', () => {
  it('only maps to routes that exist in the demo', () => {
    expect(uikitRoutes.length).toBeGreaterThan(10);
    expect(Object.keys(DEMO_ROUTES).filter((route) => !uikitRoutes.includes(route))).toEqual([]);
  });

  it('only names component pages that exist', () => {
    const pages = new Set(
      readdirSync(resolve(repo, 'docs/components')).map((f) => f.replace(/\.md$/, '')),
    );
    const unknown = Object.values(DEMO_ROUTES)
      .flat()
      .filter((c) => !pages.has(c));
    expect(unknown).toEqual([]);
  });

  it('maps a component to one demo page only', () => {
    const all = Object.values(DEMO_ROUTES).flat();
    expect(all.filter((c, i) => all.indexOf(c) !== i)).toEqual([]);
  });
});

describe('demoLinkOf', () => {
  it('builds the address under the base of the site', () => {
    expect(demoLinkOf('button', '/helix/')).toBe('/helix/demo/uikit/button');
    expect(demoRouteOf('split-button')).toBe('uikit/button');
  });

  it('is null for a component without a demo page', () => {
    expect(demoLinkOf('themes', '/helix/')).toBeNull();
  });
});

describe('demoLinksPlugin', () => {
  const run = (relativePath: string) => {
    let rule: (state: never) => void = () => {};
    demoLinksPlugin({ core: { ruler: { push: (_n, fn) => (rule = fn as never) } } }, '/helix/');
    class Token {
      content = '';
      constructor(
        public type: string,
        public tag: string,
      ) {}
    }
    const tokens = [
      { type: 'heading_open', tag: 'h1', content: '' },
      { type: 'inline', tag: '', content: 'Button' },
      { type: 'heading_close', tag: 'h1', content: '' },
      { type: 'paragraph_open', tag: 'p', content: '' },
    ];
    rule({ tokens, env: { relativePath }, Token } as never);
    return tokens;
  };

  it('adds the link right under the title of a component page', () => {
    const tokens = run('components/button.md');
    expect(tokens[3].type).toBe('html_block');
    expect(tokens[3].content).toContain('href="/helix/demo/uikit/button"');
    expect(tokens[3].content).toContain('Open in the demo');
    expect(tokens).toHaveLength(5);
  });

  it('leaves other pages and components without a demo alone', () => {
    expect(run('HELIX-SHELL.md')).toHaveLength(4);
    expect(run('components/themes.md')).toHaveLength(4);
    expect(run('components/README.md')).toHaveLength(4);
  });
});
