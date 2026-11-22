import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { hxCodeTheme } from './code-theme';

describe('hxCodeTheme', () => {
  let view: EditorView;
  afterEach(() => view?.destroy());

  function mount(): string {
    const parent = document.createElement('div');
    document.body.append(parent);
    view = new EditorView({
      state: EditorState.create({ doc: 'x', extensions: [hxCodeTheme()] }),
      parent,
    });
    return [...document.querySelectorAll('style')].map((s) => s.textContent).join('\n');
  }

  it('is an extension an editor accepts', () => {
    mount();
    expect(view.dom.classList.contains('cm-editor')).toBe(true);
  });

  it('uses var(--h-*) values for every colour, with no literal colour', () => {
    const css = mount();
    const block = css
      .split('\n')
      .filter((line) => line.includes('var(--h-'))
      .join('\n');
    expect(block).toContain('var(--h-text-color)');
    expect(block).toContain('var(--h-content-background)');
    expect(block).toContain('var(--h-primary-color)');
    expect(block).toContain('var(--h-highlight-background)');
    expect(block).toContain('var(--h-text-muted-color)');
    expect(block).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });

  it('takes font family and size from variables with defaults', () => {
    const css = mount();
    expect(css).toContain('var(--hx-code-font-size, 0.875rem)');
    expect(css).toContain('var(--hx-code-font-family, ui-monospace');
  });
});
