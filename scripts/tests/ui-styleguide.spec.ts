import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { packagedLink, rewriteLinks } from '../build-styleguide.mjs';

const ROOT = resolve(__dirname, '../..');
const SOURCE = join(ROOT, 'docs/styleguide');
const SITE = 'https://gravionlabs.github.io/helix';
const GUIDES = readdirSync(SOURCE).filter((f) => f.endsWith('.md'));

/** The targets of the Markdown links outside fenced code. */
const linksOf = (markdown: string) =>
  [...markdown.replace(/^```[\s\S]*?^```/gm, '').matchAll(/\]\(\s*([^()\s]+)/g)].map((m) => m[1]);

describe('helix-ui style guide in the package (#1236)', () => {
  // a consumer app with the built package in its node_modules
  const app = realpathSync(mkdtempSync(join(tmpdir(), 'helix-ui-styleguide-')));
  const out = join(app, 'node_modules/@gravionlabs/helix-ui');
  const guide = (file: string) => readFileSync(join(out, 'styleguide', file), 'utf8');

  beforeAll(() => {
    mkdirSync(join(out, 'styleguide'), { recursive: true });
    writeFileSync(join(out, 'styleguide/removed.md'), 'left over from an earlier build');
    writeFileSync(join(out, 'package.json'), '{"name":"@gravionlabs/helix-ui","exports":{".":{}}}');
    execFileSync('node', [join(ROOT, 'scripts/build-ui-css.mjs')], {
      cwd: ROOT,
      env: { ...process.env, HELIX_UI_CSS_OUT: out },
      stdio: 'pipe',
    });
  }, 120_000);

  afterAll(() => rmSync(app, { recursive: true, force: true }));

  it('copies the core file and every deep dive, and nothing else', () => {
    expect(GUIDES).toContain('STYLEGUIDE.md');
    expect(GUIDES.length).toBeGreaterThan(1);
    expect(readdirSync(join(out, 'styleguide')).sort((a, b) => a.localeCompare(b))).toEqual(
      [...GUIDES].sort((a, b) => a.localeCompare(b)),
    );
  });

  it.each(GUIDES)('changes nothing but link targets in %s', (file) => {
    const withoutTargets = (s: string) => s.replace(/\]\([^()\s]+/g, '](');
    expect(withoutTargets(guide(file))).toBe(
      withoutTargets(readFileSync(join(SOURCE, file), 'utf8')),
    );
  });

  it.each(GUIDES)('keeps no relative link of %s that leaves the folder', (file) => {
    for (const link of linksOf(guide(file))) {
      if (link.startsWith('https://') || link.startsWith('#')) continue;
      const target = link.split('#')[0];
      expect(target, link).not.toContain('/');
      expect(existsSync(join(out, 'styleguide', target)), link).toBe(true);
    }
  });

  it('rewrites links that leave the folder to the docs site, with clean URLs', () => {
    const core = guide('STYLEGUIDE.md');
    expect(core).toContain(`](${SITE}/components/dialog)`);
    expect(core).toContain(`](${SITE}/THEMING#density)`);
    expect(core).toContain(`](${SITE}/components/)`);
    expect(core).toContain('](forms.md)');
  });

  it('sends links to pages the site does not publish to GitHub', () => {
    expect(guide('STYLEGUIDE.md')).toContain(
      '](https://github.com/GravionLabs/helix/blob/main/docs/adr/0008-',
    );
    expect(GUIDES.map(guide).join('')).not.toContain(`${SITE}/adr/`);
  });

  it('rewrites reference definitions, and leaves fenced code and external links alone', () => {
    const source = [
      '[theming]: ../THEMING.md#density',
      '```md',
      '[x](../LINT.md)',
      '```',
      '[y](../LINT.md "Lint") [z](https://example.com) [a](#top) [b](color.md#focus)',
    ].join('\n');
    expect(rewriteLinks(source).split('\n')).toEqual([
      `[theming]: ${SITE}/THEMING#density`,
      '```md',
      '[x](../LINT.md)',
      '```',
      `[y](${SITE}/LINT "Lint") [z](https://example.com) [a](#top) [b](color.md#focus)`,
    ]);
  });

  it('fails on a link that leads nowhere', () => {
    expect(() => packagedLink('../components/no-such.md')).toThrow(/leads nowhere/);
    expect(() => packagedLink('no-such.md')).toThrow(/leads nowhere/);
  });

  it('exports the guide, so a consumer resolves it by package path', () => {
    const pkg = JSON.parse(readFileSync(join(out, 'package.json'), 'utf8'));
    expect(pkg.exports['./styleguide/*']).toBe('./styleguide/*');
    const require = createRequire(join(app, 'main.js'));
    for (const file of GUIDES) {
      expect(require.resolve(`@gravionlabs/helix-ui/styleguide/${file}`)).toBe(
        join(out, 'styleguide', file),
      );
    }
  });
});
