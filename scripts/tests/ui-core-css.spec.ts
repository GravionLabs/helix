import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  buildCore,
  buildStyles,
  buildTokens,
  CORE_COMPONENTS,
  componentStyles,
  undefinedVariables,
} from '../build-ui-css.mjs';

const ROOT = resolve(__dirname, '../..');
const LAYER_ORDER = '@layer theme, base, components, utilities;';

describe('helix-ui core.css build (#925)', () => {
  const out = mkdtempSync(join(tmpdir(), 'ui-css-'));
  let log = '';
  beforeAll(() => {
    writeFileSync(join(out, 'package.json'), '{"name":"@gravionlabs/helix-ui","exports":{".":{}}}');
    log = execFileSync('node', [join(ROOT, 'scripts/build-ui-css.mjs')], {
      cwd: ROOT,
      env: { ...process.env, HELIX_UI_CSS_OUT: out },
      stdio: 'pipe',
    }).toString();
  }, 120_000);
  const read = (f: string) => readFileSync(join(out, f), 'utf8');

  it('emits core.css next to styles.css and tokens.css', () => {
    expect(readdirSync(out).sort()).toEqual([
      'core.css',
      'package.json',
      'styles.css',
      'tokens.css',
    ]);
  });

  it('keeps core.css smaller than styles.css', () => {
    const core = Buffer.byteLength(read('core.css'));
    const full = Buffer.byteLength(read('styles.css'));
    expect(core).toBeGreaterThan(0);
    expect(core).toBeLessThan(full * 0.6);
  });

  it('keeps the layer order statement and the single components layer in core.css', () => {
    const core = read('core.css');
    expect(core).toContain(LAYER_ORDER);
    expect(core.indexOf(LAYER_ORDER)).toBeLessThan(core.indexOf('@layer components {'));
    expect(core.match(/@layer \w+ \{/g)).toEqual(['@layer components {']);
  });

  it('exports core.css from the package', () => {
    const pkg = JSON.parse(read('package.json'));
    expect(pkg.exports).toEqual({
      '.': {},
      './styles.css': './styles.css',
      './core.css': './core.css',
      './tokens.css': './tokens.css',
    });
  });

  it('logs the raw size of every output', () => {
    expect(log).toMatch(/styles\.css \d+\.\d kB/);
    expect(log).toMatch(/core\.css \d+\.\d kB/);
    expect(log).toMatch(/tokens\.css \d+\.\d kB/);
  });

  it('leaves styles.css as the full set of component stylesheets', () => {
    expect(read('styles.css')).toBe(buildStyles(componentStyles()));
    for (const name of ['chart', 'galleria', 'data-table', 'date-picker']) {
      expect(read('styles.css')).toContain(`/* ${name} */`);
    }
  });
});

describe('helix-ui core.css content', () => {
  const styles = componentStyles();
  const core = buildCore(styles);
  const names = new Set(styles.map((s) => s.name));
  // the `/* <stylesheet> */` heading buildStyles puts before each stylesheet (inner comments name no stylesheet)
  const sections = [...core.matchAll(/^ {2}\/\* ([\w-]+) \*\/$/gm)]
    .map((m) => m[1])
    .filter((n) => names.has(n));

  it('holds exactly the core stylesheets, in name order after the CDK overlay', () => {
    expect(sections).toEqual(styles.map((s) => s.name).filter((n) => CORE_COMPONENTS.includes(n)));
    expect(sections).toEqual(
      expect.arrayContaining(['cdk-overlay', 'button', 'input', 'select', 'dialog', 'toast']),
    );
  });

  it('leaves out the chart, media, data display and date pickers', () => {
    for (const name of [
      'chart',
      'galleria',
      'carousel',
      'image',
      'data-table',
      'table',
      'tree',
      'date-picker',
      'time-picker',
    ]) {
      expect(sections).not.toContain(name);
    }
  });

  it('reads only tokens that tokens.css defines', () => {
    expect(undefinedVariables(core, buildTokens(styles))).toEqual([]);
  });

  // a core component must not depend on a class only an excluded stylesheet styles (split-button on menu, …)
  it.each(CORE_COMPONENTS.filter((n) => n !== 'cdk-overlay'))(
    'styles every hx- class the %s sources use that styles.css styles',
    (name) => {
      const dir = resolve(ROOT, 'projects/ui/src/lib', name);
      expect(existsSync(dir), `${dir} exists`).toBe(true);
      const source = readdirSync(dir)
        .filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts'))
        .map((f) => readFileSync(join(dir, f), 'utf8'))
        .join('\n')
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ''); // comments mention sibling components
      const full = buildStyles(styles);
      const styled = (css: string, c: string) => new RegExp(`\\.${c}(?![\\w-])`).test(css);
      const classes = [...new Set([...source.matchAll(/\b(hx-[a-z][\w-]*)/g)].map((m) => m[1]))];
      const missing = classes.filter((c) => styled(full, c) && !styled(core, c));
      expect(missing).toEqual([]);
    },
  );

  it('fails on a core name without a stylesheet', () => {
    expect(() => buildCore(styles, ['button', 'nope'])).toThrow(
      /CORE_COMPONENTS names no stylesheet: nope/,
    );
  });

  it('is empty of components for an empty selection but keeps the layer order', () => {
    const empty = buildCore(styles, []);
    expect(empty).toContain(LAYER_ORDER);
    expect(empty).not.toMatch(/\/\* [\w-]+ \*\/\n/);
  });
});
