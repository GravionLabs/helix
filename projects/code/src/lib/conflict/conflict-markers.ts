import {
  EditorSelection,
  StateField,
  type EditorState,
  type Extension,
  type Range,
  type Text,
} from '@codemirror/state';
import { Decoration, EditorView, WidgetType, type DecorationSet } from '@codemirror/view';
import { hxParseConflictLines, type HxConflict } from './conflict-parser';

export type HxConflictChoice = 'ours' | 'theirs' | 'both';

const linesOf = (doc: Text): string[] => {
  const lines: string[] = [];
  for (const line of doc.iterLines()) lines.push(line);
  return lines;
};

/** The conflicts of the document; they follow every edit. */
export const hxConflictField: StateField<readonly HxConflict[]> = StateField.define<
  readonly HxConflict[]
>({
  create: (state) => hxParseConflictLines(linesOf(state.doc)),
  update: (value, tr) => (tr.docChanged ? hxParseConflictLines(linesOf(tr.state.doc)) : value),
});

/** The number of conflicts left in the document; 0 without the extension. */
export function hxConflictCount(state: EditorState): number {
  return state.field(hxConflictField, false)?.length ?? 0;
}

/** The lines (without their breaks) between the marker lines `from` and `to`. */
const content = (doc: Text, from: number, to: number): string[] => {
  const out: string[] = [];
  for (let n = from + 2; n <= to; n++) out.push(doc.line(n).text);
  return out;
};

/** The replacement of `conflict` for `choice`; lines are 0-based, so `doc.line(n + 1)`. */
function resolution(
  doc: Text,
  conflict: HxConflict,
  choice: HxConflictChoice,
): { from: number; to: number; insert: string } {
  const lines = [
    ...(choice === 'theirs' ? [] : content(doc, conflict.ours.from, conflict.ours.to)),
    ...(choice === 'ours' ? [] : content(doc, conflict.theirs.from, conflict.theirs.to)),
  ];
  const first = doc.line(conflict.start + 1);
  const last = doc.line(conflict.end + 1);
  if (lines.length > 0) return { from: first.from, to: last.to, insert: lines.join('\n') };
  // Nothing is left: take the line break with the lines, so no empty line stays behind.
  if (last.to < doc.length) return { from: first.from, to: last.to + 1, insert: '' };
  return { from: Math.max(0, first.from - 1), to: last.to, insert: '' };
}

/** Replaces the conflict that starts on 0-based line `start` with `choice`, as one change. */
function accept(view: EditorView, start: number, choice: HxConflictChoice): boolean {
  const conflict = view.state.field(hxConflictField, false)?.find((c) => c.start === start);
  if (!conflict) return false;
  view.dispatch({
    changes: resolution(view.state.doc, conflict, choice),
    userEvent: 'input.conflict.accept',
    scrollIntoView: true,
  });
  return true;
}

const CHOICES: readonly { choice: HxConflictChoice; text: string }[] = [
  { choice: 'ours', text: 'Accept ours' },
  { choice: 'theirs', text: 'Accept theirs' },
  { choice: 'both', text: 'Accept both' },
];

class ConflictActions extends WidgetType {
  constructor(
    private readonly conflict: HxConflict,
    private readonly index: number,
    private readonly total: number,
  ) {
    super();
  }
  override eq(other: ConflictActions): boolean {
    const a = this.conflict;
    const b = other.conflict;
    return (
      a.start === b.start &&
      a.end === b.end &&
      a.oursLabel === b.oursLabel &&
      a.theirsLabel === b.theirsLabel &&
      this.index === other.index &&
      this.total === other.total
    );
  }
  override toDOM(view: EditorView): HTMLElement {
    const c = this.conflict;
    const row = document.createElement('div');
    row.className = 'cm-hx-conflict-actions';
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', `Conflict ${this.index + 1} of ${this.total}`);
    const title = document.createElement('span');
    title.className = 'cm-hx-conflict-title';
    title.textContent = `Conflict ${this.index + 1} of ${this.total}`;
    row.append(title);
    for (const { choice, text } of CHOICES) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `cm-hx-conflict-action cm-hx-conflict-action-${choice}`;
      button.textContent = text;
      const side =
        choice === 'ours'
          ? c.oursLabel
          : choice === 'theirs'
            ? c.theirsLabel
            : [c.oursLabel, c.theirsLabel].filter(Boolean).join(' and ');
      button.setAttribute('aria-label', side ? `${text}: ${side}` : text);
      button.addEventListener('click', () => {
        // Look the conflict up now: the widget can outlive edits above it.
        const start = view.state.doc.lineAt(view.posAtDOM(row)).number - 1;
        accept(view, start, choice);
      });
      row.append(button);
    }
    return row;
  }
  override ignoreEvent(): boolean {
    return true;
  }
}

const decorate = (state: EditorState): DecorationSet => {
  const conflicts = state.field(hxConflictField);
  const doc = state.doc;
  const ranges: Range<Decoration>[] = [];
  const line = (n: number, cls: string) =>
    ranges.push(Decoration.line({ class: cls }).range(doc.line(n + 1).from));
  conflicts.forEach((c, index) => {
    ranges.push(
      Decoration.widget({
        widget: new ConflictActions(c, index, conflicts.length),
        block: true,
        side: -1,
      }).range(doc.line(c.start + 1).from),
    );
    for (let n = c.start; n <= c.end; n++) {
      const marker = n === c.ours.from || n === c.theirs.from || n === c.end || n === c.base?.from;
      if (marker) line(n, 'cm-hx-conflict-marker');
      else if (n < (c.base?.from ?? c.ours.to)) line(n, 'cm-hx-conflict-ours');
      else if (c.base && n < c.base.to) line(n, 'cm-hx-conflict-base');
      else line(n, 'cm-hx-conflict-theirs');
    }
  });
  return Decoration.set(ranges, true);
};

/** Moves the cursor to the start of the conflict that `pick` chooses; false when there is none. */
const move =
  (pick: (conflicts: readonly HxConflict[], line: number) => HxConflict | undefined) =>
  (view: EditorView): boolean => {
    const conflicts = view.state.field(hxConflictField, false);
    if (!conflicts?.length) return false;
    const line = view.state.doc.lineAt(view.state.selection.main.head).number - 1;
    const target = pick(conflicts, line) ?? undefined;
    if (!target) return false;
    view.dispatch({
      selection: EditorSelection.cursor(view.state.doc.line(target.start + 1).from),
      scrollIntoView: true,
      userEvent: 'select',
    });
    return true;
  };

/** Moves the cursor to the next conflict after the cursor line; wraps around. */
export const hxNextConflict: (view: EditorView) => boolean = move(
  (conflicts, line) => conflicts.find((c) => c.start > line) ?? conflicts[0],
);

/** Moves the cursor to the previous conflict before the cursor line; wraps around. */
export const hxPreviousConflict: (view: EditorView) => boolean = move(
  (conflicts, line) =>
    [...conflicts].reverse().find((c) => c.start < line) ?? conflicts[conflicts.length - 1],
);

/**
 * Shows Git conflict markers as blocks: the ours, base and theirs lines colored, the marker lines
 * dimmed, and a row above each conflict with Accept ours, Accept theirs and Accept both. An
 * action is one undoable change. There is no key map: bind {@link hxNextConflict} and
 * {@link hxPreviousConflict} in the app.
 *
 * Colors: `--hx-code-conflict-ours-bg`, `--hx-code-conflict-theirs-bg` and
 * `--hx-code-conflict-marker-opacity`, with defaults for the light and the dark theme.
 */
export function hxConflictMarkers(): Extension {
  return [
    hxConflictField,
    EditorView.decorations.compute([hxConflictField], decorate),
    EditorView.baseTheme({
      '&light .cm-hx-conflict-ours': {
        backgroundColor: 'var(--hx-code-conflict-ours-bg, rgba(46, 160, 67, 0.16))',
      },
      '&dark .cm-hx-conflict-ours': {
        backgroundColor: 'var(--hx-code-conflict-ours-bg, rgba(46, 160, 67, 0.24))',
      },
      '&light .cm-hx-conflict-theirs': {
        backgroundColor: 'var(--hx-code-conflict-theirs-bg, rgba(31, 111, 235, 0.16))',
      },
      '&dark .cm-hx-conflict-theirs': {
        backgroundColor: 'var(--hx-code-conflict-theirs-bg, rgba(56, 139, 253, 0.26))',
      },
      '.cm-hx-conflict-base': { backgroundColor: 'rgba(128, 128, 128, 0.14)' },
      '.cm-hx-conflict-marker': {
        opacity: 'var(--hx-code-conflict-marker-opacity, 0.6)',
        fontStyle: 'italic',
      },
      '.cm-hx-conflict-actions': {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '6px',
        padding: '2px 8px',
        fontFamily: 'inherit',
        color: 'var(--h-text-color)',
      },
      '.cm-hx-conflict-title': {
        color: 'var(--h-text-muted-color)',
        fontSize: '0.75em',
        marginRight: '4px',
      },
      '.cm-hx-conflict-action': {
        font: 'inherit',
        fontSize: '0.8em',
        color: 'inherit',
        background: 'transparent',
        border: '1px solid var(--h-content-border-color)',
        borderRadius: 'var(--h-border-radius, 4px)',
        padding: '1px 8px',
        cursor: 'pointer',
      },
      '.cm-hx-conflict-action:focus-visible': {
        outline: '2px solid var(--h-primary-color)',
        outlineOffset: '1px',
      },
    }),
  ];
}
