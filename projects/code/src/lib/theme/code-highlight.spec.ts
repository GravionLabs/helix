import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { HX_CODE_PALETTE, type HxCodeRole, hxCodeHighlight } from './code-highlight';

const BACKGROUND = { light: '#ffffff', dark: '#1b1b1f' };

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const roles = Object.keys(HX_CODE_PALETTE) as HxCodeRole[];

describe('HX_CODE_PALETTE', () => {
  for (const theme of ['light', 'dark'] as const) {
    it.each(roles)(`${theme}: %s reaches 4.5:1 on the editor background`, (role) => {
      expect(contrast(HX_CODE_PALETTE[role][theme], BACKGROUND[theme])).toBeGreaterThanOrEqual(4.5);
    });
  }
});

describe('hxCodeHighlight', () => {
  let view: EditorView;
  afterEach(() => view?.destroy());

  function styles(): string {
    return [...document.querySelectorAll('style')].map((s) => s.textContent).join('\n');
  }

  it('is an extension an editor accepts', () => {
    const parent = document.createElement('div');
    document.body.append(parent);
    view = new EditorView({
      state: EditorState.create({ doc: 'x', extensions: [hxCodeHighlight()] }),
      parent,
    });
    expect(view.dom.classList.contains('cm-editor')).toBe(true);
  });

  it('sets the light and dark defaults inside the extension and reads the public variables', () => {
    const parent = document.createElement('div');
    document.body.append(parent);
    view = new EditorView({
      state: EditorState.create({ doc: 'x', extensions: [hxCodeHighlight()] }),
      parent,
    });
    const css = styles();
    expect(css).toContain(`--hx-code-default-keyword: ${HX_CODE_PALETTE.keyword.light}`);
    expect(css).toMatch(/\.app-dark [^{]*\{[^}]*--hx-code-default-keyword: #c4b5fd/);
    expect(css).toContain('var(--hx-code-keyword, var(--hx-code-default-keyword))');
  });
});
