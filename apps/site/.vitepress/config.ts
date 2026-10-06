import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitepress';
import { sidebarOf } from './sidebar';

const repoRoot = resolve(fileURLToPath(new URL('../../..', import.meta.url)));
const base = process.env['SITE_BASE'] ?? '/';
const REPO_URL = 'https://github.com/GravionLabs/helix';
const componentIndex = readFileSync(resolve(repoRoot, 'docs/components/README.md'), 'utf8');

export default defineConfig({
  title: 'Helix',
  description:
    'Angular 22 UI components: a vendored PrimeNG fork with signals, an application shell, dynamic forms and AG Grid wrappers.',
  lang: 'en',
  // `/<repository>/` on GitHub Pages; the workflow sets SITE_BASE.
  base,
  // The site is the documentation of the repository: its pages are the files of `docs`.
  srcDir: '../../docs',
  srcExclude: ['CONTRIBUTING-*.md', 'migrations/**', 'components/_TEMPLATE.md'],
  // `docs/components/README.md` is what GitHub shows for the folder, and the home of the component pages here.
  rewrites: { 'components/README.md': 'components/index.md' },
  cleanUrls: true,
  lastUpdated: false,
  // TODO(#460): turned back on once repo links are rewritten.
  ignoreDeadLinks: true,
  head: [['link', { rel: 'icon', href: `${base}favicon.ico` }]],
  themeConfig: {
    siteTitle: 'Helix',
    nav: [
      { text: 'Components', link: '/components/' },
      { text: 'Shell API', link: '/HELIX-SHELL' },
      { text: 'Roadmap', link: '/ROADMAP' },
      { text: 'GitHub', link: REPO_URL },
    ],
    sidebar: sidebarOf(componentIndex),
    search: { provider: 'local' },
    editLink: { pattern: `${REPO_URL}/edit/main/docs/:path`, text: 'Edit this page on GitHub' },
    socialLinks: [{ icon: 'github', link: REPO_URL }],
    footer: { message: 'Released under the MIT licence.' },
  },
});
