import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  language,
  LanguageDescription,
  LanguageSupport,
  StreamLanguage,
} from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { HX_CODE_LANGUAGES } from '../language/language';
import { HxDiffView, type HxDiffLayout } from './diff-view';

@Component({
  imports: [HxDiffView],
  template: `<hx-diff-view
    aria-label="Changes"
    [original]="original()"
    [modified]="modified()"
    [path]="path()"
    [layout]="layout()"
    [splitMinWidth]="minWidth()"
    [collapseUnchanged]="collapse()"
  />`,
})
class Host {
  readonly original = signal('one\ntwo\nthree');
  readonly modified = signal('one\ntwo changed\nthree');
  readonly path = signal('');
  readonly layout = signal<HxDiffLayout>('split');
  readonly minWidth = signal(900);
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

  describe('navigation', () => {
    const view = () =>
      fixture.debugElement.query(By.directive(HxDiffView)).componentInstance as HxDiffView;
    const three = async () => {
      host.original.set(lines(60));
      host.modified.set(
        lines(60)
          .replace('line 5\n', 'line five\n')
          .replace('line 30\n', 'line thirty\n')
          .replace('line 55\n', 'line fifty\n'),
      );
      await settle();
    };
    const head = () =>
      EditorView.findFromDOM(el().querySelector<HTMLElement>('.cm-merge-b')!)!.state.selection.main
        .head;

    it('counts the changes', async () => {
      expect(view().changeCount()).toBe(1);
      expect(view().currentChange()).toBe(0);
      await three();
      expect(view().changeCount()).toBe(3);
      expect(view().currentChange()).toBe(0);
    });

    it('moves to the next change and wraps at the last', async () => {
      await three();
      const seen: number[] = [];
      for (let i = 0; i < 4; i++) {
        view().next();
        seen.push(view().currentChange());
      }
      expect(seen).toEqual([1, 2, 3, 1]);
      expect(head()).toBe('line 0\nline 1\nline 2\nline 3\nline 4\n'.length);
    });

    it('moves to the previous change and wraps at the first', async () => {
      await three();
      const seen: number[] = [];
      for (let i = 0; i < 4; i++) {
        view().previous();
        seen.push(view().currentChange());
      }
      expect(seen).toEqual([3, 2, 1, 3]);
    });

    it('does nothing without changes, and counts in the unified layout', async () => {
      host.modified.set(host.original());
      await settle();
      expect(view().changeCount()).toBe(0);
      view().next();
      view().previous();
      expect(view().currentChange()).toBe(0);
      await three();
      host.layout.set('unified');
      await settle();
      expect(view().changeCount()).toBe(3);
      view().next();
      view().next();
      expect(view().currentChange()).toBe(2);
    });

    it('follows the cursor', async () => {
      await three();
      const b = EditorView.findFromDOM(el().querySelector<HTMLElement>('.cm-merge-b')!)!;
      const pos = b.state.doc.line(31).from;
      b.dispatch({ selection: { anchor: pos } });
      expect(view().currentChange()).toBe(2);
    });

    it('reveals a line of the modified text and expands the collapsed region', async () => {
      await three();
      expect(el().querySelectorAll('.cm-merge-b .cm-collapsedLines').length).toBe(2);
      view().revealLine(15, 'modified');
      await settle();
      expect(el().querySelectorAll('.cm-merge-b .cm-collapsedLines').length).toBe(1);
      expect(head()).toBe(
        EditorView.findFromDOM(el().querySelector<HTMLElement>('.cm-merge-b')!)!.state.doc.line(15)
          .from,
      );
    });

    it('reveals a line of the original text, in both layouts, and clamps', async () => {
      await three();
      view().revealLine(15, 'original');
      await settle();
      expect(el().querySelectorAll('.cm-merge-a .cm-collapsedLines').length).toBe(1);
      host.layout.set('unified');
      await settle();
      expect(el().querySelectorAll('.cm-collapsedLines').length).toBe(2);
      view().revealLine(15, 'original');
      await settle();
      expect(el().querySelectorAll('.cm-collapsedLines').length).toBe(1);
      view().revealLine(9999, 'original');
      view().revealLine(-3, 'modified');
      await settle();
      expect(el().querySelector('.cm-content')).not.toBeNull();
    });
  });

  describe('layout auto', () => {
    let observers: { callback: ResizeObserverCallback; disconnected: boolean }[];
    const resize = async (width: number) => {
      for (const o of observers) {
        o.callback([{ contentRect: { width } } as ResizeObserverEntry], {} as ResizeObserver);
      }
      await settle();
    };

    beforeEach(async () => {
      observers = [];
      vi.stubGlobal(
        'ResizeObserver',
        class {
          readonly #entry: { callback: ResizeObserverCallback; disconnected: boolean };
          constructor(callback: ResizeObserverCallback) {
            this.#entry = { callback, disconnected: false };
            observers.push(this.#entry);
          }
          observe(): void {}
          unobserve(): void {}
          disconnect(): void {
            this.#entry.disconnected = true;
          }
        },
      );
      fixture.destroy();
      fixture = TestBed.createComponent(Host);
      host = fixture.componentInstance;
      host.layout.set('auto');
      await settle();
    });
    afterEach(() => vi.unstubAllGlobals());

    it('waits for the first measurement of the host', () => {
      expect(el().querySelector('.cm-editor')).toBeNull();
    });

    it('is split from the minimum width and unified below, following the host', async () => {
      await resize(900);
      expect(el().querySelectorAll('.cm-editor').length).toBe(2);
      await resize(899);
      expect(el().querySelectorAll('.cm-editor').length).toBe(1);
      await resize(1200);
      expect(el().querySelectorAll('.cm-editor').length).toBe(2);
    });

    it('does not rebuild while the layout stays the same', async () => {
      await resize(1000);
      const before = el().querySelector('.cm-editor');
      await resize(1100);
      expect(el().querySelector('.cm-editor')).toBe(before);
    });

    it('uses splitMinWidth', async () => {
      host.minWidth.set(500);
      await resize(600);
      expect(el().querySelectorAll('.cm-editor').length).toBe(2);
      host.minWidth.set(700);
      await settle();
      expect(el().querySelectorAll('.cm-editor').length).toBe(1);
    });

    it('stops observing with the component', () => {
      fixture.destroy();
      expect(observers.every((o) => o.disconnected)).toBe(true);
    });
  });
});

@Component({
  imports: [HxDiffView],
  template: `<hx-diff-view
    aria-label="Changes"
    [original]="original"
    [modified]="modified"
    [layout]="layout()"
    [reviewable]="reviewable()"
    [collapseUnchanged]="false"
    (changeDecided)="decided.push($event)"
  />`,
})
class ReviewHost {
  readonly original = lines(10);
  readonly modified = lines(10)
    .replace('line 1\n', 'line one\n')
    .replace('line 4\n', 'line 4\nadded\n')
    .replace('line 8\n', '');
  readonly layout = signal<HxDiffLayout>('unified');
  readonly reviewable = signal(true);
  readonly decided: { index: number; decision: string }[] = [];
}

describe('HxDiffView review', () => {
  let fixture: ComponentFixture<ReviewHost>;
  const el = () => fixture.nativeElement as HTMLElement;
  const view = () =>
    fixture.debugElement.query(By.directive(HxDiffView)).componentInstance as HxDiffView;
  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const button = (type: string, n: number) =>
    el().querySelectorAll<HTMLButtonElement>(`.cm-review-${type}`)[n];
  const editor = () => EditorView.findFromDOM(el().querySelector<HTMLElement>('.cm-editor')!)!;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: HX_CODE_LANGUAGES, useValue: [] }],
    });
    fixture = TestBed.createComponent(ReviewHost);
    await settle();
  });

  it('shows accept and reject buttons with names for each change', () => {
    expect(el().querySelectorAll('.cm-review-accept').length).toBe(3);
    expect(button('accept', 0).getAttribute('aria-label')).toBe('Accept this change');
    expect(button('reject', 0).getAttribute('aria-label')).toBe('Reject this change');
    expect(button('accept', 0).tagName).toBe('BUTTON');
    expect(view().pendingChanges()).toBe(3);
  });

  it('has no buttons without reviewable or with the split layout', async () => {
    fixture.componentInstance.reviewable.set(false);
    await settle();
    expect(el().querySelector('.cm-review-button')).toBeNull();
    fixture.componentInstance.reviewable.set(true);
    fixture.componentInstance.layout.set('split');
    await settle();
    expect(el().querySelector('.cm-review-button')).toBeNull();
    expect(view().pendingChanges()).toBe(3);
  });

  it('rejects a change, restores the original and keeps the index stable', async () => {
    button('reject', 0).click();
    await settle();
    expect(view().result()).toContain('line 1\n');
    expect(view().result()).not.toContain('line one');
    expect(view().pendingChanges()).toBe(2);
    expect(view().changeCount()).toBe(2);
    button('accept', 0).click();
    await settle();
    expect(view().result()).toContain('added');
    expect(fixture.componentInstance.decided).toEqual([
      { index: 0, decision: 'reject' },
      { index: 1, decision: 'accept' },
    ]);
    button('reject', 0).click();
    await settle();
    expect(fixture.componentInstance.decided[2]).toEqual({ index: 2, decision: 'reject' });
    expect(view().result()).toBe(lines(10).replace('line 4\n', 'line 4\nadded\n'));
    expect(view().pendingChanges()).toBe(0);
    expect(editor().state.doc.toString()).toBe(view().result());
  });

  it('counts only undecided changes for the navigation', async () => {
    view().next();
    view().next();
    expect(view().currentChange()).toBe(2);
    button('accept', 0).click();
    await settle();
    expect(view().changeCount()).toBe(2);
    expect(view().currentChange()).toBeLessThanOrEqual(2);
  });

  it('accepts all', async () => {
    view().acceptAll();
    await settle();
    expect(view().result()).toBe(fixture.componentInstance.modified);
    expect(view().pendingChanges()).toBe(0);
    expect(fixture.componentInstance.decided.map((d) => d.index)).toEqual([0, 1, 2]);
    expect(fixture.componentInstance.decided.every((d) => d.decision === 'accept')).toBe(true);
  });

  it('rejects all', async () => {
    view().rejectAll();
    await settle();
    expect(view().result()).toBe(fixture.componentInstance.original);
    expect(view().pendingChanges()).toBe(0);
    expect(fixture.componentInstance.decided.map((d) => d.decision)).toEqual([
      'reject',
      'reject',
      'reject',
    ]);
  });

  it('ignores acceptAll and rejectAll with the split layout', async () => {
    fixture.componentInstance.layout.set('split');
    await settle();
    view().rejectAll();
    expect(fixture.componentInstance.decided).toEqual([]);
    expect(view().pendingChanges()).toBe(3);
  });
});
