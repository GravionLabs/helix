import { REPO_URL, type RepoFiles, repoLink, repoLinksPlugin } from '../.vitepress/repo-links';

const files = (entries: Record<string, 'file' | 'directory'>): RepoFiles => ({
  kind: (path) => entries[path] ?? null,
});

const repo = files({
  'projects/core/README.md': 'file',
  'projects/core/button/button.ts': 'file',
  'projects/shell': 'directory',
  'docs/HELIX-SHELL.md': 'file',
  'docs/components/button.md': 'file',
  'docs/CONTRIBUTING-file-structure.md': 'file',
  'docs/migrations/signals-audit.md': 'file',
});

const main = `${REPO_URL}/blob/main`;

describe('repoLink', () => {
  it('sends a source file to GitHub (blob)', () => {
    expect(repoLink('../../projects/core/button/button.ts', 'components/button.md', repo)).toBe(
      `${main}/projects/core/button/button.ts`,
    );
  });

  it('sends a package README to GitHub, keeping the anchor', () => {
    expect(repoLink('../projects/core/README.md#install', 'COMPONENTS.md', repo)).toBe(
      `${main}/projects/core/README.md#install`,
    );
  });

  it('sends a folder to GitHub (tree)', () => {
    expect(repoLink('../projects/shell', 'COMPONENTS.md', repo)).toBe(
      `${REPO_URL}/tree/main/projects/shell`,
    );
    expect(repoLink('../projects/shell/', 'COMPONENTS.md', repo)).toBe(
      `${REPO_URL}/tree/main/projects/shell`,
    );
  });

  it('leaves links to pages of the site alone', () => {
    expect(repoLink('HELIX-SHELL.md', 'COMPONENTS.md', repo)).toBe('HELIX-SHELL.md');
    expect(repoLink('button.md#inputs', 'components/README.md', repo)).toBe('button.md#inputs');
    expect(repoLink('../HELIX-SHELL.md', 'components/button.md', repo)).toBe('../HELIX-SHELL.md');
  });

  it('sends documents the site leaves out to GitHub', () => {
    expect(repoLink('CONTRIBUTING-file-structure.md', 'COMPONENTS.md', repo)).toBe(
      `${main}/docs/CONTRIBUTING-file-structure.md`,
    );
    expect(repoLink('migrations/signals-audit.md', 'ROADMAP.md', repo)).toBe(
      `${main}/docs/migrations/signals-audit.md`,
    );
  });

  it('leaves a target that is not in the repository alone, so the build reports it', () => {
    expect(repoLink('missing.md', 'COMPONENTS.md', repo)).toBe('missing.md');
    expect(repoLink('../projects/nope/README.md', 'COMPONENTS.md', repo)).toBe(
      '../projects/nope/README.md',
    );
  });

  it('leaves external addresses, site addresses and anchors alone', () => {
    for (const href of ['https://example.com/a', 'mailto:a@b.c', '/demo/', '#section']) {
      expect(repoLink(href, 'COMPONENTS.md', repo)).toBe(href);
    }
  });

  it('leaves a link that climbs out of the repository alone', () => {
    expect(repoLink('../../../etc/passwd', 'COMPONENTS.md', repo)).toBe('../../../etc/passwd');
  });
});

describe('repoLinksPlugin', () => {
  it('rewrites the link tokens of the page being rendered', () => {
    let rule: (state: never) => void = () => {};
    repoLinksPlugin({ core: { ruler: { push: (_name, fn) => (rule = fn as never) } } }, repo);

    const attrs: Record<string, string> = { href: '../projects/core/README.md' };
    const link = {
      type: 'link_open',
      children: null,
      attrGet: (name: string) => attrs[name] ?? null,
      attrSet: (name: string, value: string) => {
        attrs[name] = value;
      },
    };
    const text = { type: 'text', children: null, attrGet: () => null, attrSet: () => {} };
    rule({
      tokens: [{ type: 'inline', children: [link, text], attrGet: () => null, attrSet: () => {} }],
      env: { relativePath: 'COMPONENTS.md' },
    } as never);

    expect(attrs['href']).toBe(`${main}/projects/core/README.md`);
  });

  it('does nothing without a page', () => {
    let rule: (state: never) => void = () => {};
    repoLinksPlugin({ core: { ruler: { push: (_name, fn) => (rule = fn as never) } } }, repo);
    expect(() => rule({ tokens: [], env: {} } as never)).not.toThrow();
  });
});
