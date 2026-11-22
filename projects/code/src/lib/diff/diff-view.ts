import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  untracked,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  type Chunk,
  getChunks,
  getOriginalDoc,
  MergeView,
  uncollapseUnchanged,
  unifiedMergeView,
} from '@codemirror/merge';
import {
  Compartment,
  EditorSelection,
  EditorState,
  type Extension,
  type Text,
} from '@codemirror/state';
import { EditorView, lineNumbers } from '@codemirror/view';
import { HX_CODE_LANGUAGES, hxLoadLanguage } from '../language/language';
import { hxCodeHighlight } from '../theme/code-highlight';
import { hxCodeTheme } from '../theme/code-theme';
import { hxDiffTheme } from './diff-theme';

/** How the two versions are laid out. `auto`: split when the host is wide enough, else unified. */
export type HxDiffLayout = 'auto' | 'split' | 'unified';

/** The text a line number refers to. */
export type HxDiffSide = 'original' | 'modified';

/** The collapsing of unchanged regions: `margin` lines stay visible, at least `minSize` collapse. */
export interface HxDiffCollapse {
  readonly margin?: number;
  readonly minSize?: number;
}

const DEFAULT_SPLIT_MIN_WIDTH = 900;
const DEFAULT_COLLAPSE = { margin: 3, minSize: 4 } as const;

/**
 * Shows two versions of a text, side by side or unified, read-only: syntax highlighting, marked
 * changed words, a change gutter with `+` and `-`, and collapsed unchanged regions.
 *
 * ```html
 * <hx-diff-view aria-label="Changes" path="app.ts" [original]="before" [modified]="after" />
 * ```
 *
 * The view is rebuilt when a text, `layout`, `path` or `collapseUnchanged` changes; a theme switch
 * needs no rebuild (colors are CSS variables `--hx-diff-added-*`, `--hx-diff-removed-*`).
 */
@Component({
  selector: 'hx-diff-view',
  templateUrl: './diff-view.html',
  styleUrl: './diff-view.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-diff-view',
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
  },
})
export class HxDiffView {
  readonly #languages = inject(HX_CODE_LANGUAGES);

  /** The old version. Empty: a new file. */
  readonly original = input.required<string>();
  /** The new version. Empty: a deleted file. */
  readonly modified = input.required<string>();
  /** A file name or path; it selects the language. Empty: plain text. */
  readonly path = input('');
  /** `split` (default), `unified`, or `auto`: split from `splitMinWidth` of the host, else unified. */
  readonly layout = input<HxDiffLayout>('split');
  /** With `layout="auto"`: the host width in px from which the split layout is used. */
  readonly splitMinWidth = input(DEFAULT_SPLIT_MIN_WIDTH);
  /** `true` (default): margin 3, minimum 4. `false`: show everything. Or set both numbers. */
  readonly collapseUnchanged = input<boolean | HxDiffCollapse>(true);
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  readonly ariaLabelledby = input<string | null>(null, {
    alias: 'aria-labelledby',
  });

  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #width = signal<number | null>(null);
  readonly #changes = signal(0);
  readonly #current = signal(0);
  /** The number of changes (chunks) of the diff. */
  readonly changeCount = this.#changes.asReadonly();
  /** The 1-based number of the change at the cursor; 0 when no change is selected yet. */
  readonly currentChange = this.#current.asReadonly();
  /** The layout in use: `auto` resolved by the host width. `null` while `auto` is not measured. */
  readonly effectiveLayout = computed<'split' | 'unified' | null>(() => {
    const layout = this.layout();
    if (layout !== 'auto') return layout;
    const width = this.#width();
    if (width === null) return null;
    return width >= this.splitMinWidth() ? 'split' : 'unified';
  });

  private readonly container = viewChild.required<ElementRef<HTMLElement>>('container');
  readonly #ready = signal(false);
  readonly #language = new Compartment();
  #generation = 0;
  #destroy: (() => void) | null = null;
  #views: { original: EditorView; modified: EditorView } | null = null;

  constructor() {
    const destroyRef = inject(DestroyRef);
    let observer: ResizeObserver | null = null;
    afterNextRender(() => {
      this.#ready.set(true);
      if (typeof ResizeObserver === 'undefined') {
        this.#width.set(this.#host.nativeElement.getBoundingClientRect().width);
        return;
      }
      // The host element is observed, not the window: a resizable panel switches the layout too.
      observer = new ResizeObserver((entries) => {
        const entry = entries[entries.length - 1];
        if (entry) this.#width.set(entry.contentRect.width);
      });
      observer.observe(this.#host.nativeElement);
    });

    destroyRef.onDestroy(() => {
      observer?.disconnect();
      this.#generation++;
      this.#teardown();
    });

    effect(() => {
      if (!this.#ready()) return;
      const original = this.original();
      const modified = this.modified();
      const layout = this.effectiveLayout();
      if (layout === null) return;
      const path = this.path();
      const collapse = this.#collapse();
      const label = this.#labels();
      const generation = ++this.#generation;
      untracked(() => {
        this.#teardown();
        const views = this.#build(layout, original, modified, collapse, label);
        this.#changes.set(this.#chunks(views[views.length - 1]).length);
        void hxLoadLanguage(path, this.#languages).then((support) => {
          if (generation !== this.#generation || !support) return;
          for (const view of views) {
            view.dispatch({ effects: this.#language.reconfigure(support) });
          }
        });
      });
    });
  }

  /** Moves to the next change; after the last one it wraps to the first. */
  next(): void {
    const count = this.#changes();
    if (count) this.#goTo(this.#current() % count);
  }

  /** Moves to the previous change; before the first one it wraps to the last. */
  previous(): void {
    const count = this.#changes();
    if (count) this.#goTo(this.#current() <= 1 ? count - 1 : this.#current() - 2);
  }

  /**
   * Scrolls to a 1-based line of the original or the modified text and expands a collapsed region
   * around it. A line outside the text is clamped.
   */
  revealLine(line: number, side: HxDiffSide = 'modified'): void {
    const views = this.#views;
    if (!views) return;
    const split = this.effectiveLayout() === 'split';
    const original = side === 'original';
    const view = split && original ? views.original : views.modified;
    const doc = !split && original ? getOriginalDoc(view.state) : view.state.doc;
    const own = this.#lineStart(doc, line);
    // Position in the modified text and, in split layout, in the original text.
    const b = original ? this.#map(view, own, true) : own;
    const a = original ? own : this.#map(views.modified, own, false);
    this.#uncollapse(views.modified, b);
    if (split) this.#uncollapse(views.original, a);
    const pos = original && split ? a : b;
    view.dispatch({
      effects: EditorView.scrollIntoView(pos, { y: 'center' }),
      selection: { anchor: pos },
    });
  }

  #lineStart(doc: Text, line: number): number {
    const n = Math.min(Math.max(Math.trunc(line) || 1, 1), doc.lines);
    return doc.line(n).from;
  }

  /** Maps a position of the original text (`fromA`) or of the modified text to the other one. */
  #map(view: EditorView, pos: number, fromA: boolean): number {
    let delta = 0;
    for (const chunk of this.#chunks(view)) {
      const [from, to] = fromA ? [chunk.fromA, chunk.toA] : [chunk.fromB, chunk.toB];
      if (pos < from) break;
      if (pos < to) return fromA ? chunk.fromB : chunk.fromA;
      delta += fromA
        ? chunk.toB - chunk.fromB - (chunk.toA - chunk.fromA)
        : chunk.toA - chunk.fromA - (chunk.toB - chunk.fromB);
    }
    return Math.max(pos + delta, 0);
  }

  /** Expands the collapsed region that contains `pos`. */
  #uncollapse(view: EditorView, pos: number): void {
    const starts: number[] = [];
    for (const source of view.state.facet(EditorView.decorations)) {
      if (typeof source === 'function') continue;
      source.between(0, view.state.doc.length, (from, to, deco) => {
        const widget = deco.spec.widget as { type?: string } | undefined;
        if (widget?.type === 'collapsed-unchanged-code' && from <= pos && pos <= to)
          starts.push(from);
      });
    }
    if (starts.length) {
      view.dispatch({ effects: starts.map((from) => uncollapseUnchanged.of(from)) });
    }
  }

  #goTo(index: number): void {
    const view = this.#views?.modified;
    const chunk = view && this.#chunks(view)[index];
    if (!view || !chunk) return;
    view.dispatch({
      selection: { anchor: chunk.fromB },
      userEvent: 'select.byChunk',
      effects: EditorView.scrollIntoView(EditorSelection.range(chunk.endB, chunk.fromB), {
        y: 'center',
      }),
    });
  }

  /** The 1-based number of the change that contains the cursor; 0 when there is none. */
  #indexAt(view: EditorView): number {
    const head = view.state.selection.main.head;
    return this.#chunks(view).findIndex((c) => c.fromB <= head && head <= c.endB) + 1;
  }

  #chunks(view: EditorView): readonly Chunk[] {
    return getChunks(view.state)?.chunks ?? [];
  }

  #collapse(): HxDiffCollapse | null {
    const value = this.collapseUnchanged();
    if (value === false) return null;
    if (value === true) return DEFAULT_COLLAPSE;
    return { ...DEFAULT_COLLAPSE, ...value };
  }

  #labels(): Extension {
    const attributes: Record<string, string> = { 'aria-readonly': 'true' };
    const label = this.ariaLabel();
    const labelledby = this.ariaLabelledby();
    if (label) attributes['aria-label'] = label;
    if (labelledby) attributes['aria-labelledby'] = labelledby;
    return EditorView.contentAttributes.of(attributes);
  }

  #shared(labels: Extension): Extension[] {
    return [
      hxCodeTheme(),
      hxCodeHighlight(),
      hxDiffTheme(),
      EditorState.readOnly.of(true),
      EditorView.editable.of(false),
      lineNumbers(),
      this.#language.of([]),
      EditorView.updateListener.of((update) => {
        if (update.selectionSet && !update.docChanged && update.view === this.#views?.modified) {
          this.#current.set(this.#indexAt(update.view));
        }
      }),
      labels,
    ];
  }

  #build(
    layout: 'split' | 'unified',
    original: string,
    modified: string,
    collapse: HxDiffCollapse | null,
    labels: Extension,
  ): EditorView[] {
    const parent = this.container().nativeElement;
    const collapseUnchanged = collapse ?? undefined;
    if (layout === 'unified') {
      const view = new EditorView({
        parent,
        doc: modified,
        extensions: [
          ...this.#shared(labels),
          unifiedMergeView({
            original,
            mergeControls: false,
            gutter: true,
            highlightChanges: true,
            collapseUnchanged,
          }),
        ],
      });
      this.#destroy = () => view.destroy();
      this.#views = { original: view, modified: view };
      return [view];
    }
    const extensions = this.#shared(labels);
    const merge = new MergeView({
      parent,
      a: { doc: original, extensions },
      b: { doc: modified, extensions },
      gutter: true,
      highlightChanges: true,
      collapseUnchanged,
    });
    this.#destroy = () => merge.destroy();
    this.#views = { original: merge.a, modified: merge.b };
    return [merge.a, merge.b];
  }

  #teardown(): void {
    this.#destroy?.();
    this.#destroy = null;
    this.#views = null;
    this.#changes.set(0);
    this.#current.set(0);
  }
}
