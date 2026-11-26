// The UX style guide in @gravionlabs/helix-ui (#1236, ADR 0008): docs/styleguide/*.md copied to dist/ui/styleguide/,
// so an app reads the guide of the version it installs. Run by scripts/build-ui-css.mjs.
//
// Links inside the folder stay relative. Links that leave it become absolute: to the docs site for a page of the site,
// to GitHub for what the site does not publish (the ADRs), as the site itself does.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isSitePage, REPO_BRANCH, REPO_URL } from '../apps/site/.vitepress/repo-links.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = 'docs/styleguide';
export const DOCS_SITE_URL = 'https://gravionlabs.github.io/helix';

/** Not a relative path: another site, an anchor, or an address from the root. */
const NOT_RELATIVE = /^([a-z][a-z0-9+.-]*:|\/|#)/i;

/** The address of a page of the docs site (clean URLs; `components/README.md` is the index of its folder). */
function siteUrl(repoPath) {
  const page = repoPath
    .slice('docs/'.length)
    .replace(/\.md$/, '')
    .replace(/^components\/README$/, 'components/')
    .replace(/(^|\/)index$/, '$1');
  return `${DOCS_SITE_URL}/${page}`;
}

/** The address a link of a guide file has in the package. A link to nothing in the repository is an error. */
export function packagedLink(href) {
  if (NOT_RELATIVE.test(href)) return href;
  const [target, ...rest] = href.split(/(?=[?#])/);
  const repoPath = path.posix.join(SOURCE, target);
  if (repoPath.startsWith(`${SOURCE}/`) && fs.existsSync(path.join(ROOT, repoPath))) return href;
  const stat = fs.statSync(path.join(ROOT, repoPath), { throwIfNoEntry: false });
  if (!stat || repoPath.startsWith('../')) throw new Error(`${SOURCE}: the link "${href}" leads nowhere`);
  const url = isSitePage(repoPath)
    ? siteUrl(repoPath)
    : `${REPO_URL}/${stat.isDirectory() ? 'tree' : 'blob'}/${REPO_BRANCH}/${repoPath.replace(/\/$/, '')}`;
  return `${url}${rest.join('')}`;
}

/** The Markdown with the targets of `[text](target)` and `[label]: target` rewritten; fenced code stays as it is. */
export function rewriteLinks(markdown) {
  let fence = null;
  return markdown
    .split('\n')
    .map((line) => {
      const marker = /^\s*(`{3,}|~{3,})/.exec(line)?.[1];
      if (fence) {
        if (marker?.startsWith(fence) && line.trim() === marker) fence = null;
        return line;
      }
      if (marker) {
        fence = marker;
        return line;
      }
      return line.replace(/(\]\(\s*|^\s{0,3}\[[^\]]+\]:\s+)([^()\s]+)/g, (_, start, href) => start + packagedLink(href));
    })
    .join('\n');
}

/** Writes `<dist>/styleguide/` anew from docs/styleguide and returns the names of its files. */
export function buildStyleguide(dist) {
  const out = path.join(dist, 'styleguide');
  const files = fs
    .readdirSync(path.join(ROOT, SOURCE))
    .filter((f) => f.endsWith('.md'))
    .sort();
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  for (const file of files) {
    const markdown = fs.readFileSync(path.join(ROOT, SOURCE, file), 'utf8');
    fs.writeFileSync(path.join(out, file), rewriteLinks(markdown));
  }
  return files;
}
