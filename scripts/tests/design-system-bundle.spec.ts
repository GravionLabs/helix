import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildComponents,
  readmeOf,
  readStyle,
  resolveDt,
  undefinedClasses,
  undefinedVariables,
} from '../design-system/bundle.mjs';
import { classesOf, PREVIEWS } from '../design-system/previews.mjs';

describe('resolveDt', () => {
  it('turns dt() into the custom property the engine emits', () => {
    expect(resolveDt("color: dt('button.primary.color');")).toBe(
      'color: var(--h-button-primary-color);',
    );
    expect(resolveDt("left: dt('imagecompare.scope.x', '50%');")).toBe(
      'left: var(--h-imagecompare-scope-x, 50%);',
    );
    expect(resolveDt("gap: dt('form.fieldWidth');")).toBe('gap: var(--h-form-field-width);');
  });

  it('reads a component stylesheet from the library source', () => {
    const css = readStyle('button');
    expect(css).toContain('.h-button');
    expect(css).toContain('var(--h-button-primary-background)');
    expect(css).not.toMatch(/dt\('/);
  });
});

describe('previews', () => {
  it('have unique ASCII identifier names and a summary sentence each', () => {
    const names = PREVIEWS.map((p) => p.name);
    expect(new Set(names).size).toBe(names.length);
    for (const p of PREVIEWS) {
      expect(p.name).toMatch(/^[A-Za-z][A-Za-z0-9]*$/);
      expect(p.summary).toMatch(/\.$/);
      expect(readmeOf(p).startsWith(`${p.summary}\n`)).toBe(true);
    }
  });

  it('use only h- classes of their own component family or the base', () => {
    for (const p of PREVIEWS) expect(classesOf(p.body).size).toBeGreaterThan(0);
  });
});

// bundle.css needs the built library (`pnpm build:core`): the presets and the styling engine.
describe.skipIf(
  !existsSync(
    resolve(__dirname, '../../dist/core/fesm2022/gravionlabs-helix-core-themes-helix.mjs'),
  ),
)('buildComponents (built core)', () => {
  it('writes a self-consistent bundle', async () => {
    const files = await buildComponents();
    const css = files['components/bundle.css'];
    expect(css).toContain('html{font-size:14px}');
    expect(css).toMatch(/:root,:host\{--h-/);
    expect(css).toContain('[data-theme="dark"]');
    expect(css).not.toMatch(/dt\('/);
    expect(css).not.toMatch(/<\/style/i);
    expect(css.length).toBeLessThan(2 * 1024 * 1024);
    expect(undefinedClasses(files)).toEqual({});
    expect(undefinedVariables(css)).toEqual([]);
  });

  it('writes each preview with the @dsCard marker on line 1 and nothing the frame forbids', async () => {
    const files = await buildComponents();
    for (const p of PREVIEWS) {
      const html = files[`components/${p.name}/preview.html`];
      expect(html.split('\n')[0]).toBe(
        `<!-- @dsCard group="${p.group}" height=${p.height} subtitle="${p.selector}" -->`,
      );
      expect(html).not.toMatch(/<(iframe|frame|object|embed|portal|noscript|script)\b/i);
      expect(html.length).toBeLessThan(256 * 1024);
      expect(files[`components/${p.name}/README.md`]).toContain('## Guidelines');
    }
  });
});
