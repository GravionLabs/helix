import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import { assemble, PIECES } from '../scripts/assemble.mjs';

let repo: string;
let out: string;

const build = (piece: keyof typeof PIECES, files: Record<string, string>) => {
  for (const [name, content] of Object.entries(files)) {
    const file = join(repo, PIECES[piece], name);
    mkdirSync(join(file, '..'), { recursive: true });
    writeFileSync(file, content);
  }
};

beforeEach(() => {
  repo = mkdtempSync(join(tmpdir(), 'helix-assemble-'));
  out = join(repo, 'pages');
});
afterEach(() => rmSync(repo, { recursive: true, force: true }));

describe('assemble', () => {
  it('puts the site at the root and the demo under /demo/', () => {
    build('site', { 'index.html': 'site', 'components/button.html': 'button' });
    build('demo', { 'index.html': 'demo', 'main.js': 'js' });

    assemble(repo, out);

    expect(readFileSync(join(out, 'index.html'), 'utf8')).toBe('site');
    expect(readFileSync(join(out, 'components/button.html'), 'utf8')).toBe('button');
    expect(readFileSync(join(out, 'demo/index.html'), 'utf8')).toBe('demo');
    expect(readFileSync(join(out, 'demo/main.js'), 'utf8')).toBe('js');
  });

  it('adds .nojekyll and the deep-link 404.html', () => {
    build('site', { 'index.html': 'site', '404.html': 'vitepress 404' });
    build('demo', { 'index.html': 'demo' });

    assemble(repo, out);

    expect(existsSync(join(out, '.nojekyll'))).toBe(true);
    expect(readFileSync(join(out, '404.html'), 'utf8')).toContain('helix-demo-redirect');
  });

  it('empties the output folder first', () => {
    build('site', { 'index.html': 'site' });
    build('demo', { 'index.html': 'demo' });
    mkdirSync(out, { recursive: true });
    writeFileSync(join(out, 'stale.html'), 'old');

    assemble(repo, out);

    expect(existsSync(join(out, 'stale.html'))).toBe(false);
  });

  it.each(['site', 'demo'] as const)(
    'throws, naming the piece, when the %s is not built',
    (missing) => {
      for (const piece of ['site', 'demo'] as const) {
        if (piece !== missing) build(piece, { 'index.html': piece });
      }

      expect(() => assemble(repo, out)).toThrow(new RegExp(`The ${missing} is not built`));
      expect(existsSync(out)).toBe(false);
    },
  );
});

describe('the deep-link 404.html', () => {
  const html = readFileSync(join(__dirname, '../scripts/404.html'), 'utf8');
  const script = /<script>([\s\S]*?)<\/script>/.exec(html)?.[1] ?? '';

  const visit = (pathname: string) => {
    const storage: Record<string, string> = {};
    const replaced: string[] = [];
    runInNewContext(script, {
      location: {
        pathname,
        search: '?a=1',
        hash: '#x',
        replace: (to: string) => replaced.push(to),
      },
      sessionStorage: { setItem: (k: string, v: string) => (storage[k] = v) },
    });
    return { storage, replaced };
  };

  it('sends a deep link of the demo to the demo root and remembers the address', () => {
    const { storage, replaced } = visit('/helix/demo/uikit/table');
    expect(replaced).toEqual(['/helix/demo/']);
    expect(storage['helix-demo-redirect']).toBe('/helix/demo/uikit/table?a=1#x');
  });

  it('works without a repository prefix too', () => {
    expect(visit('/demo/uikit/table').replaced).toEqual(['/demo/']);
  });

  it('leaves every other missing page on the 404 page', () => {
    const { storage, replaced } = visit('/helix/components/nope');
    expect(replaced).toEqual([]);
    expect(storage).toEqual({});
  });
});
