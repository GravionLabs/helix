import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as sass from 'sass';
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
    ['accordion', 'accordion/accordion.ts'],
    ['button', 'button/button.ts'],
    ['input', 'input/input.ts'],
    ['card', 'card/card.ts'],
    ['checkbox', 'checkbox/checkbox.ts'],
    ['radio', 'radio/radio.ts'],
    ['breadcrumb', 'breadcrumb/breadcrumb.ts'],
    ['divider', 'divider/divider.ts'],
    ['float-label', 'float-label/float-label.ts'],
    ['fieldset', 'fieldset/fieldset.ts'],
    ['icon-field', 'icon-field/icon-field.ts'],
    ['listbox', 'listbox/listbox.ts'],
    ['message', 'message/message.ts'],
    ['multi-select', 'multi-select/multi-select.ts'],
    ['auto-complete', 'auto-complete/auto-complete.ts'],
    ['date-picker', 'date-picker/date-picker.ts'],
    ['file-upload', 'file-upload/file-upload.ts'],
    ['input-group', 'input-group/input-group.ts'],
    ['input-number', 'input-number/input-number.ts'],
    ['panel', 'panel/panel.ts'],
    ['password', 'password/password.ts'],
    ['select', 'select/select.ts'],
    ['rating', 'rating/rating.ts'],
    ['select-button', 'select-button/select-button.ts'],
    ['slider', 'slider/slider.ts'],
    ['toggle-button', 'toggle-button/toggle-button.ts'],
    ['toolbar', 'toolbar/toolbar.ts'],
    ['tabs', 'tabs/tabs.ts'],
    ['toast', 'toast/toast.ts'],
    ['tooltip', 'tooltip/tooltip.ts'],
    ['switch', 'switch/switch.ts'],
  ])('styles every class the %s directive sets', (name, file) => {
    const directive = readFileSync(resolve(ROOT, 'projects/ui/src/lib', file), 'utf8');
    const classes = new Set([
      ...[...directive.matchAll(/'\[class\.(hx-[\w-]+)\]'/g)].map((m) => m[1]),
      ...[...directive.matchAll(/\bclass: '(hx-[\w-]+)'/g)].map((m) => m[1]),
    ]);
    // `hx-filled` is the shared "holds a value" state; `float-label.scss` styles it
    classes.delete('hx-filled');
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

describe('helix-ui icons (styles/_icons.scss)', () => {
  const STYLES = resolve(ROOT, 'projects/ui/styles');
  const compile = (source: string) =>
    sass.compileString(`@use 'icons' as *;\n${source}`, { loadPaths: [STYLES] }).css;
  const iconSource = readFileSync(resolve(STYLES, '_icons.scss'), 'utf8');
  const iconMap = iconSource.slice(iconSource.indexOf('$hx-icons: ('), iconSource.indexOf('\n);'));
  const names = [...iconMap.matchAll(/^ {2}([a-z-]+): /gm)].map((m) => m[1]);

  it('is a partial: it is no component stylesheet and emits no CSS of its own', () => {
    expect(componentStyles().map((s) => s.name)).not.toContain('icons');
    expect(compile('')).toBe('');
  });

  it('knows the icons the components need', () => {
    for (const icon of [
      'chevron-down',
      'chevron-up',
      'chevron-left',
      'chevron-right',
      'check',
      'close',
      'plus',
      'minus',
      'search',
      'calendar',
      'eye',
      'eye-off',
      'upload',
      'spinner',
      'info',
      'success',
      'warn',
      'error',
      'star',
      'star-filled',
      'bars',
    ]) {
      expect(names).toContain(icon);
    }
  });

  it.each(names)('draws %s as a mask in the given colour', (name) => {
    const out = compile(`.i { @include hx-icon(${name}, 2rem, red, 2.5); }`);
    expect(out).toContain('width: 2rem');
    expect(out).toContain('background: red');
    expect(out).toMatch(
      /mask: url\("data:image\/svg\+xml,%3Csvg[^"]+"\) center\/contain no-repeat/,
    );
    expect(out).toMatch(/-webkit-mask: url\(/);
    expect(out).not.toMatch(/[<>#]/); // a data URI must be escaped
  });

  it('fills solid icons and strokes the others with the requested width', () => {
    expect(compile('.i { @include hx-icon(star-filled); }')).toContain("fill='black'");
    expect(compile('.i { @include hx-icon(check, 1em, red, 3.4); }')).toContain(
      "stroke-width='3.4'",
    );
  });

  it('fails on an unknown icon, naming the known ones', () => {
    expect(() => compile('.i { @include hx-icon(nope); }')).toThrow(
      /Unknown helix-ui icon `nope`.*chevron-down/,
    );
  });
});
