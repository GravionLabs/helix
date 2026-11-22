import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import type { ElementRef } from '@angular/core';
import { MergeView, unifiedMergeView } from '@codemirror/merge';
import { Compartment, type Extension, EditorState } from '@codemirror/state';
import { EditorView, lineNumbers } from '@codemirror/view';
import { HX_CODE_LANGUAGES, hxLoadLanguage } from '../language/language';
import { hxCodeHighlight } from '../theme/code-highlight';
import { hxCodeTheme } from '../theme/code-theme';
import { hxDiffTheme } from './diff-theme';

/** How the two versions are laid out. */
export type HxDiffLayout = 'split' | 'unified';

/** The collapsing of unchanged regions: `margin` lines stay visible, at least `minSize` collapse. */
export interface HxDiffCollapse {
  readonly margin?: number;
  readonly minSize?: number;
}

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
  readonly layout = input<HxDiffLayout>('split');
  /** `true` (default): margin 3, minimum 4. `false`: show everything. Or set both numbers. */
  readonly collapseUnchanged = input<boolean | HxDiffCollapse>(true);
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  readonly ariaLabelledby = input<string | null>(null, {
    alias: 'aria-labelledby',
  });

  private readonly container = viewChild.required<ElementRef<HTMLElement>>('container');
  readonly #ready = signal(false);
  readonly #language = new Compartment();
  #generation = 0;
  #destroy: (() => void) | null = null;

  constructor() {
    afterNextRender(() => this.#ready.set(true));

    inject(DestroyRef).onDestroy(() => {
      this.#generation++;
      this.#teardown();
    });

    effect(() => {
      if (!this.#ready()) return;
      const original = this.original();
      const modified = this.modified();
      const layout = this.layout();
      const path = this.path();
      const collapse = this.#collapse();
      const label = this.#labels();
      const generation = ++this.#generation;
      untracked(() => {
        this.#teardown();
        const views = this.#build(layout, original, modified, collapse, label);
        void hxLoadLanguage(path, this.#languages).then((support) => {
          if (generation !== this.#generation || !support) return;
          for (const view of views) {
            view.dispatch({ effects: this.#language.reconfigure(support) });
          }
        });
      });
    });
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
      labels,
    ];
  }

  #build(
    layout: HxDiffLayout,
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
    return [merge.a, merge.b];
  }

  #teardown(): void {
    this.#destroy?.();
    this.#destroy = null;
  }
}
