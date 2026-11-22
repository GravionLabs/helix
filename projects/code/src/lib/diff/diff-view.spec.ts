import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import {
  language,
  LanguageDescription,
  LanguageSupport,
  StreamLanguage,
} from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { HX_CODE_LANGUAGES } from '../language/language';
import { HxDiffView } from './diff-view';

@Component({
  imports: [HxDiffView],
  template: `<hx-diff-view
    aria-label="Changes"
    [original]="original()"
    [modified]="modified()"
    [path]="path()"
    [layout]="layout()"
    [collapseUnchanged]="collapse()"
  />`,
})
class Host {
  readonly original = signal('one\ntwo\nthree');
  readonly modified = signal('one\ntwo changed\nthree');
  readonly path = signal('');
  readonly layout = signal<'split' | 'unified'>('split');
  readonly collapse = signal<boolean | { margin?: number; minSize?: number }>(true);
}

const lines = (n: number) => Array.from({ length: n }, (_, i) => `line ${i}`).join('\n');

describe('HxDiffView', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  let pending: (() => void)[];
  let loads: number;

  const el = () => fixture.nativeElement as HTMLElement;
  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const flush = async () => {
    pending.splice(0).forEach((resolve) => resolve());
    await new Promise((r) => setTimeout(r));
    await settle();
  };
  const token = (name: string) =>
    LanguageDescription.of({
      name,
      extensions: [name],
      load: () =>
        new Promise<LanguageSupport>((resolve) => {
          loads++;
          pending.push(() =>
            resolve(
              new LanguageSupport(
                StreamLanguage.define({
                  name,
                  token: (s) => {
                    s.next();
                    return null;
                  },
                }),
              ),
            ),
          );
        }),
    });

  beforeEach(async () => {
    pending = [];
    loads = 0;
    TestBed.configureTestingModule({
      providers: [{ provide: HX_CODE_LANGUAGES, useValue: [token('aaa'), token('bbb')] }],
    });
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
  });

  it('shows both versions side by side', () => {
    const editors = el().querySelectorAll('.cm-editor');
    expect(editors.length).toBe(2);
    expect(el().querySelector('.cm-merge-a .cm-content')?.textContent).toContain('two');
    expect(el().querySelector('.cm-merge-b .cm-content')?.textContent).toContain('two changed');
    expect(el().querySelector('.cm-changeGutter')).not.toBeNull();
  });

  it('marks the changed words', () => {
    expect(el().querySelector('.cm-merge-b .cm-changedText')?.textContent).toContain('changed');
  });

  it('shows one column with the removed lines inline when unified', async () => {
    host.layout.set('unified');
    await settle();
    expect(el().querySelectorAll('.cm-editor').length).toBe(1);
    expect(el().querySelector('.cm-deletedChunk')?.textContent).toContain('two');
    expect(el().querySelector('.cm-content')?.textContent).toContain('two changed');
    expect(el().querySelector('.cm-deletedLineGutter')).not.toBeNull();
    expect(el().querySelector('.cm-inlineChangedLineGutter, .cm-changedLineGutter')).not.toBeNull();
  });

  it('is read-only with an accessible name', () => {
    const content = el().querySelector<HTMLElement>('.cm-content')!;
    expect(content.getAttribute('contenteditable')).toBe('false');
    expect(content.getAttribute('aria-label')).toBe('Changes');
    expect(el().getAttribute('aria-label')).toBeNull();
  });

  it('defines the colors by CSS variables with defaults, so no rebuild is needed', () => {
    const css = [...document.querySelectorAll('style')].map((s) => s.textContent).join('\n');
    expect(css).toContain('--hx-diff-added-background');
    expect(css).toContain('--hx-diff-removed-background');
    expect(css).toContain('--hx-diff-default-added-background');
    expect(css).toContain('.app-dark');
    const before = el().querySelector('.cm-editor');
    document.documentElement.classList.add('app-dark');
    try {
      fixture.detectChanges();
      expect(el().querySelector('.cm-editor')).toBe(before);
    } finally {
      document.documentElement.classList.remove('app-dark');
    }
  });

  it('adds sign characters for added and removed gutter lines', () => {
    const css = [...document.querySelectorAll('style')].map((s) => s.textContent).join('\n');
    expect(css).toContain('content: "+"');
    expect(css).toContain('content: "-"');
  });

  it('collapses unchanged regions by default and not when switched off', async () => {
    host.original.set(lines(40));
    host.modified.set(lines(40).replace('line 20', 'line twenty'));
    await settle();
    expect(el().querySelector('.cm-collapsedLines')).not.toBeNull();
    host.collapse.set(false);
    await settle();
    expect(el().querySelector('.cm-collapsedLines')).toBeNull();
    host.collapse.set({ margin: 1 });
    await settle();
    expect(el().querySelector('.cm-collapsedLines')).not.toBeNull();
  });

  it('renders a new file (empty original) and a deleted file (empty modified)', async () => {
    host.original.set('');
    host.modified.set('a\nb');
    await settle();
    expect(el().querySelector('.cm-merge-b .cm-content')?.textContent).toContain('a');
    host.original.set('a\nb');
    host.modified.set('');
    await settle();
    expect(el().querySelector('.cm-merge-a .cm-content')?.textContent).toContain('a');
    host.layout.set('unified');
    await settle();
    expect(el().querySelector('.cm-deletedChunk')?.textContent).toContain('a');
    host.original.set('');
    await settle();
    expect(el().querySelector('.cm-editor')).not.toBeNull();
  });

  it('drops a late language load after a newer input change', async () => {
    const languageOf = () =>
      EditorView.findFromDOM(el().querySelector<HTMLElement>('.cm-merge-b')!)!.state.facet(language)
        ?.name;
    host.path.set('x.aaa');
    await settle();
    host.path.set('x.bbb');
    await settle();
    expect(loads).toBe(2);
    const [first, second] = pending.splice(0);
    second();
    await new Promise((r) => setTimeout(r));
    expect(languageOf()).toBe('bbb');
    // The older load resolves last: it must not replace the language of the newer path.
    first();
    await new Promise((r) => setTimeout(r));
    await settle();
    expect(languageOf()).toBe('bbb');
  });

  it('destroys the views with the component', async () => {
    const container = el();
    expect(container.querySelector('.cm-editor')).not.toBeNull();
    fixture.destroy();
    expect(container.querySelector('.cm-editor')).toBeNull();
  });
});
