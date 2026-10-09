import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildStyles, buildTokens, componentStyles, undefinedVariables } from '../build-ui-css.mjs';

const ROOT = resolve(__dirname, '../..');

describe('helix-ui styles', () => {
  const styles = componentStyles();
  const css = buildStyles(styles);

  it('has a stylesheet per component, in the components layer', () => {
    expect(styles.map((s) => s.name)).toContain('button');
    expect(css).toMatch(/@layer components \{/);
    expect(css.match(/@layer \w+ \{/g)).toHaveLength(1);
    expect(css).toContain('@layer theme, base, components, utilities;');
  });

  it('reads only --h-* tokens or its own --hx-* locals, never an engine class or helix-core name', () => {
    for (const { name, css: source } of styles) {
      const vars = new Set([...source.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]));
      for (const v of vars)
        expect({ name, v, ok: /^--(h|hx)-/.test(v) }).toEqual({ name, v, ok: true });
      expect(source).not.toMatch(/\.h-[a-z]/); // core's class prefix
      expect(source).not.toMatch(/p-component|primeng|primeuix/i);
    }
  });

  it('lets the select panel fill the overlay pane, which is a flex row', () => {
    const select = styles.find((s) => s.name === 'select')?.css ?? '';
    expect(select).toMatch(/\.hx-select-panel \{[^}]*flex: 1 1 auto/);
  });

  // every class a directive can put on its host must be styled by the stylesheet of its component
  it.each([
    ['button', 'button/button.ts'],
    ['input', 'input/input.ts'],
    ['checkbox', 'checkbox/checkbox.ts'],
    ['radio', 'radio/radio.ts'],
    ['breadcrumb', 'breadcrumb/breadcrumb.ts'],
    ['divider', 'divider/divider.ts'],
    ['password', 'password/password.ts'],
    ['select', 'select/select.ts'],
    ['select-button', 'select-button/select-button.ts'],
    ['tooltip', 'tooltip/tooltip.ts'],
    ['switch', 'switch/switch.ts'],
  ])('styles every class the %s directive sets', (name, file) => {
    const directive = readFileSync(resolve(ROOT, 'projects/ui/src/lib', file), 'utf8');
    const classes = new Set([
      ...[...directive.matchAll(/'\[class\.(hx-[\w-]+)\]'/g)].map((m) => m[1]),
      ...[...directive.matchAll(/\bclass: '(hx-[\w-]+)'/g)].map((m) => m[1]),
    ]);
    expect(classes.size).toBeGreaterThan(0);
    const sheet = styles.find((s) => s.name === name)?.css ?? '';
    for (const c of classes) {
      expect({ c, styled: new RegExp(`\\.${c}(?![\\w-])`).test(sheet) }).toEqual({
        c,
        styled: true,
      });
    }
  });
});

describe('helix-ui tokens', () => {
  it('defines every token the styles read, light and dark', async () => {
    const styles = componentStyles();
    const tokens = buildTokens(styles);
    expect(undefinedVariables(buildStyles(styles), tokens)).toEqual([]);
    expect(tokens).toContain(':root,:host{--h-');
    expect(tokens).toContain('.app-dark');
    expect(tokens).toMatch(/--h-button-primary-background:/);
  });
});
