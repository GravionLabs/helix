import { Facet, StateEffect, StateField, type Extension, type Range } from '@codemirror/state';
import {
  Decoration,
  EditorView,
  lineNumbers,
  WidgetType,
  type DecorationSet,
} from '@codemirror/view';

/** A comment on lines of one side of a diff. Lines are 1-based. */
export interface HxDiffComment {
  readonly id: string;
  readonly side: 'original' | 'modified';
  readonly startLine: number;
  readonly endLine: number;
  readonly text: string;
  readonly author?: string;
  /** ISO 8601, as GitHub `created_at`. */
  readonly time?: string;
}

/** A comment as one editor shows it: `mark` tells whether its lines are tinted. */
export interface HxPlacedComment {
  readonly comment: HxDiffComment;
  readonly start: number;
  readonly end: number;
  readonly mark: boolean;
}

/** What a comment-enabled editor tells its owner. */
export interface HxCommentHandlers {
  /** A draft was opened in this editor (the owner closes drafts of other editors). */
  opened(view: EditorView): void;
  /** The draft was saved; `start` and `end` are line numbers of this editor. */
  saved(view: EditorView, start: number, end: number, text: string): void;
}

interface Draft {
  readonly start: number;
  readonly end: number;
  readonly anchor: number;
  text: string;
}

const setComments = StateEffect.define<readonly HxPlacedComment[]>();
const setDraft = StateEffect.define<Draft | null>();
const handlersFacet = Facet.define<HxCommentHandlers, HxCommentHandlers | null>({
  combine: (values) => values[0] ?? null,
});

const formatTime = (time: string | undefined): string => {
  if (!time) return '';
  const date = new Date(time);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString();
};

const rangeLabel = (start: number, end: number): string =>
  start === end ? `line ${start}` : `lines ${start}-${end}`;

class CommentBox extends WidgetType {
  constructor(private readonly placed: HxPlacedComment) {
    super();
  }
  override eq(other: CommentBox): boolean {
    const a = this.placed;
    const b = other.placed.comment;
    const c = a.comment;
    return (
      c.id === b.id &&
      c.text === b.text &&
      c.author === b.author &&
      c.time === b.time &&
      c.side === b.side &&
      c.startLine === b.startLine &&
      c.endLine === b.endLine &&
      a.end === other.placed.end
    );
  }
  override toDOM(): HTMLElement {
    const c = this.placed.comment;
    const box = document.createElement('div');
    box.className = 'cm-comment-box';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', `Comment on ${rangeLabel(c.startLine, c.endLine)}`);
    const head = document.createElement('div');
    head.className = 'cm-comment-range';
    const parts = [
      c.author,
      c.side === 'original' ? 'old' : '',
      rangeLabel(c.startLine, c.endLine),
    ];
    head.textContent = [...parts.filter(Boolean), formatTime(c.time)].filter(Boolean).join(' · ');
    const text = document.createElement('div');
    text.className = 'cm-comment-text';
    text.textContent = c.text;
    box.append(head, text);
    return box;
  }
  override ignoreEvent(): boolean {
    return false;
  }
}

class DraftBox extends WidgetType {
  constructor(private readonly draft: Draft) {
    super();
  }
  override eq(other: DraftBox): boolean {
    return other.draft.start === this.draft.start && other.draft.end === this.draft.end;
  }
  override toDOM(view: EditorView): HTMLElement {
    const { start, end, text } = this.draft;
    const close = (save: boolean, value: string) => closeDraft(view, save, value);
    const box = document.createElement('div');
    box.className = 'cm-comment-box cm-comment-draft';
    const input = document.createElement('textarea');
    input.className = 'cm-comment-input';
    input.rows = 3;
    input.value = text;
    input.placeholder = `Comment on ${rangeLabel(start, end)}`;
    input.setAttribute('aria-label', input.placeholder);
    const save = document.createElement('button');
    save.type = 'button';
    save.className = 'cm-comment-save';
    save.textContent = 'Add comment';
    save.disabled = !input.value.trim();
    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'cm-comment-cancel';
    cancel.textContent = 'Cancel';
    const submit = () => {
      if (input.value.trim()) close(true, input.value);
    };
    save.addEventListener('click', submit);
    cancel.addEventListener('click', () => close(false, ''));
    input.addEventListener('input', () => {
      this.draft.text = input.value;
      save.disabled = !input.value.trim();
    });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close(false, '');
      else if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) submit();
      else return;
      event.preventDefault();
      event.stopPropagation();
    });
    const actions = document.createElement('div');
    actions.className = 'cm-comment-actions';
    actions.append(save, cancel);
    box.append(input, actions);
    queueMicrotask(() => input.focus());
    return box;
  }
  override ignoreEvent(): boolean {
    return true;
  }
}

interface Shown {
  readonly comments: readonly HxPlacedComment[];
  readonly draft: Draft | null;
  readonly decorations: DecorationSet;
}

const closeDraft = (view: EditorView, save: boolean, text: string): void => {
  const draft = view.state.field(field).draft;
  if (!draft) return;
  view.dispatch({ effects: setDraft.of(null) });
  if (save) view.state.facet(handlersFacet)?.saved(view, draft.start, draft.end, text);
  view.focus();
};

const field: StateField<Shown> = StateField.define<Shown>({
  create: () => ({ comments: [], draft: null, decorations: Decoration.none }),
  update(value, tr) {
    let { comments, draft } = value;
    let changed = false;
    for (const effect of tr.effects) {
      if (effect.is(setComments)) {
        comments = effect.value;
        changed = true;
      } else if (effect.is(setDraft)) {
        draft = effect.value;
        changed = true;
      }
    }
    if (!changed) return value;
    return { comments, draft, decorations: decorate(tr.state.doc, comments, draft) };
  },
  provide: (f) => EditorView.decorations.from(f, (v) => v.decorations),
});

function decorate(
  doc: EditorView['state']['doc'],
  comments: readonly HxPlacedComment[],
  draft: Draft | null,
): DecorationSet {
  const ranges: Range<Decoration>[] = [];
  const place = (start: number, end: number, widget: WidgetType, mark: boolean) => {
    if (start < 1 || end < start || end > doc.lines) return;
    if (mark) {
      for (let n = start; n <= end; n++) {
        ranges.push(Decoration.line({ class: 'cm-commented-line' }).range(doc.line(n).from));
      }
    }
    ranges.push(Decoration.widget({ widget, block: true, side: 1 }).range(doc.line(end).to));
  };
  for (const c of comments) place(c.start, c.end, new CommentBox(c), c.mark);
  if (draft) {
    place(draft.start, draft.end, new DraftBox(draft), false);
    for (let n = draft.start; n <= draft.end && n <= doc.lines; n++) {
      ranges.push(Decoration.line({ class: 'cm-draft-line' }).range(doc.line(n).from));
    }
  }
  return Decoration.set(ranges, true);
}

/** Shows `comments` (already placed on this editor's lines) as boxes below their last line. */
export function showComments(view: EditorView, comments: readonly HxPlacedComment[]): void {
  view.dispatch({ effects: setComments.of(comments) });
}

/** Closes the draft box of the editor without saving. */
export function discardDraft(view: EditorView): void {
  if (view.state.field(field, false)?.draft) view.dispatch({ effects: setDraft.of(null) });
}

/** The text of the lines `start`..`end` (1-based) of the editor. */
export function quoteOf(view: EditorView, start: number, end: number): string {
  const doc = view.state.doc;
  return doc.sliceString(doc.line(start).from, doc.line(end).to);
}

function openDraft(view: EditorView, line: number, extend: boolean): boolean {
  const state = view.state.field(field, false);
  if (!state) return false;
  const doc = view.state.doc;
  if (line < 1 || line > doc.lines) return false;
  const old = state.draft;
  const textarea = view.dom.querySelector<HTMLTextAreaElement>('.cm-comment-input');
  const text = textarea ? textarea.value : (old?.text ?? '');
  const anchor = extend && old ? old.anchor : line;
  const draft: Draft = {
    start: Math.min(anchor, line),
    end: Math.max(anchor, line),
    anchor,
    text: old ? text : '',
  };
  view.dispatch({ effects: setDraft.of(draft) });
  if (!old) view.state.facet(handlersFacet)?.opened(view);
  return true;
}

/**
 * CodeMirror command: opens the comment draft box on the line of the cursor, so the box is
 * reachable by keyboard; focus moves into its textarea and back to the editor when it closes.
 * It does nothing (returns `false`) in an editor without comments enabled. Bind it to a key:
 * `keymap.of([{ key: 'Mod-Alt-m', run: openCommentDraft }])`.
 */
export function openCommentDraft(view: EditorView): boolean {
  const line = view.state.doc.lineAt(view.state.selection.main.head).number;
  return openDraft(view, line, false);
}

/**
 * Line comments for one editor: a click on a line number opens a draft box (Shift-click extends
 * the range), comments and the draft are block widgets below their last line. Fed by
 * {@link showComments}.
 */
export function commentExtension(handlers: HxCommentHandlers): Extension {
  return [
    handlersFacet.of(handlers),
    field,
    lineNumbers({
      domEventHandlers: {
        mousedown(view, block, event) {
          // The number on the clicked element; the block (found by geometry) is the fallback.
          const label = (event.target as HTMLElement).closest('.cm-gutterElement')?.textContent;
          const shown = /^\d+$/.test(label ?? '') ? Number(label) : 0;
          const line = shown || view.state.doc.lineAt(block.from).number;
          openDraft(view, line, (event as MouseEvent).shiftKey);
          event.preventDefault();
          return true;
        },
      },
    }),
    EditorView.baseTheme({
      '.cm-lineNumbers .cm-gutterElement': { cursor: 'pointer' },
      '.cm-commented-line': { backgroundColor: 'var(--h-highlight-background)' },
      '.cm-draft-line': { backgroundColor: 'var(--h-highlight-focus-background)' },
      '.cm-comment-box': {
        margin: '4px 8px 4px 48px',
        padding: '6px 8px',
        border: '1px solid var(--h-content-border-color)',
        borderLeft: '3px solid var(--h-primary-color)',
        borderRadius: 'var(--h-border-radius, 4px)',
        backgroundColor: 'var(--h-content-background)',
        color: 'var(--h-text-color)',
        fontFamily: 'inherit',
      },
      '.cm-comment-range': { color: 'var(--h-text-muted-color)', fontSize: '0.75em' },
      '.cm-comment-text': { whiteSpace: 'pre-wrap' },
      '.cm-comment-input': {
        display: 'block',
        width: '100%',
        boxSizing: 'border-box',
        font: 'inherit',
        color: 'inherit',
        background: 'transparent',
        border: '1px solid var(--h-content-border-color)',
        borderRadius: 'var(--h-border-radius, 4px)',
        resize: 'vertical',
      },
      '.cm-comment-input:focus-visible, .cm-comment-actions button:focus-visible': {
        outline: '2px solid var(--h-primary-color)',
        outlineOffset: '1px',
      },
      '.cm-comment-actions': { display: 'flex', gap: '6px', marginTop: '6px' },
      '.cm-comment-actions button': {
        font: 'inherit',
        color: 'inherit',
        background: 'transparent',
        border: '1px solid var(--h-content-border-color)',
        borderRadius: 'var(--h-border-radius, 4px)',
        padding: '2px 10px',
        cursor: 'pointer',
      },
      '.cm-comment-actions button.cm-comment-save': {
        background: 'var(--h-primary-color)',
        borderColor: 'var(--h-primary-color)',
        color: 'var(--h-primary-contrast-color)',
      },
      '.cm-comment-actions button:disabled': { opacity: '0.6', cursor: 'default' },
    }),
  ];
}
