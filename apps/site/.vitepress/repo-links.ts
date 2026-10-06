import { existsSync, statSync } from 'node:fs';
import { posix, resolve } from 'node:path';

/** Where the repository is, for links to files that are not pages of the site. */
export const REPO_URL = 'https://github.com/GravionLabs/helix';
export const REPO_BRANCH = 'main';

/** What a link needs to know about the files of the repository; replaced in tests. */
export interface RepoFiles {
  /** `file`, `directory`, or null when there is nothing at that path of the repository. */
  kind(repoPath: string): 'file' | 'directory' | null;
}

/** The files of this repository on disk (`repoRoot` is its top folder). */
export function repoFilesOnDisk(repoRoot: string): RepoFiles {
  return {
    kind(repoPath) {
      const full = resolve(repoRoot, repoPath);
      if (!existsSync(full)) return null;
      return statSync(full).isDirectory() ? 'directory' : 'file';
    },
  };
}

/**
 * The pages of the site, as paths in the repository: the Markdown files of `docs`, except the ones the
 * site leaves out (`srcExclude` in the config).
 */
export function isSitePage(repoPath: string): boolean {
  if (!repoPath.startsWith('docs/') || !repoPath.endsWith('.md')) return false;
  const page = repoPath.slice('docs/'.length);
  return !(
    page.startsWith('CONTRIBUTING-') ||
    page.startsWith('migrations/') ||
    page === 'components/_TEMPLATE.md'
  );
}

/** Not a path of the repository: another site, an anchor, or an address on this site (`/demo/`). */
const EXTERNAL = /^([a-z][a-z0-9+.-]*:|\/|#)/i;

/**
 * The address a link of a page should have. A link to another page of the site stays as it is. A link
 * to anything else in the repository (a source file, the README of a package, a folder) becomes a link
 * to GitHub, because the site does not contain it. A link to something that is not in the repository is
 * left alone: VitePress then reports it as dead. `relativePath` is the page, relative to `docs`
 * (`components/button.md`).
 */
export function repoLink(href: string, relativePath: string, files: RepoFiles): string {
  if (EXTERNAL.test(href)) return href;
  const [target, ...rest] = href.split(/(?=[?#])/);
  if (!target) return href;
  const suffix = rest.join('');
  const repoPath = posix.normalize(posix.join('docs', posix.dirname(relativePath), target));
  if (repoPath.startsWith('../')) return href;
  const path = repoPath.replace(/\/$/, '');
  if (isSitePage(path)) return href;
  const kind = files.kind(path);
  if (!kind) return href;
  return `${REPO_URL}/${kind === 'directory' ? 'tree' : 'blob'}/${REPO_BRANCH}/${path}${suffix}`;
}

/** The shape of the markdown-it renderer that the plugin needs (what VitePress gives to `config`). */
interface Token {
  type: string;
  children: Token[] | null;
  attrGet(name: string): string | null;
  attrSet(name: string, value: string): void;
}
interface Markdown {
  core: {
    ruler: {
      push(
        name: string,
        rule: (state: { tokens: Token[]; env: { relativePath?: string } }) => void,
      ): void;
    };
  };
}

/** A markdown-it plugin: the links of every page go through {@link repoLink}. */
export function repoLinksPlugin(md: Markdown, files: RepoFiles): void {
  md.core.ruler.push('helix_repo_links', (state) => {
    const page = state.env.relativePath;
    if (!page) return;
    for (const block of state.tokens) {
      for (const token of block.children ?? []) {
        if (token.type !== 'link_open') continue;
        const href = token.attrGet('href');
        if (href) token.attrSet('href', repoLink(href, page, files));
      }
    }
  });
}
