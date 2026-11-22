import { Facet, StateEffect, StateField, type Extension, type Range } from '@codemirror/state';
import { Decoration, EditorView, WidgetType, type DecorationSet } from '@codemirror/view';

/** One comment of a thread. `time` is ISO 8601, as GitHub `created_at`. */
export interface HxDiffThreadComment {
  readonly id: string;
  readonly author: string;
  readonly time: string;
  readonly text: string;
}

/** A review thread on lines of one side of a diff: the first comment, its replies, resolved state. */
export interface HxDiffThread {
  readonly id: string;
  readonly side: 'original' | 'modified';
  readonly startLine: number;
  readonly endLine: number;
  readonly resolved: boolean;
  readonly comments: readonly HxDiffThreadComment[];
}

/** A thread as one editor shows it: `mark` tells whether its lines are tinted. */
export interface HxPlacedThread {
  readonly thread: HxDiffThread;
  readonly start: number;
  readonly end: number;
  readonly mark: boolean;
}

/** What a thread-enabled editor tells its owner. */
export interface HxThreadHandlers {
  reply(view: EditorView, threadId: string, text: string): void;
  resolve(view: EditorView, threadId: string, resolved: boolean): void;
}

/** Turns comment text into safe HTML; `null`: the text is plain. */
export type HxThreadRender = ((text: string) => string) | null;

const setThreads = StateEffect.define<{
  readonly threads: readonly HxPlacedThread[];
  readonly render: HxThreadRender;
}>();
const toggleOpen = StateEffect.define<string>();
const handlersFacet = Facet.define<HxThreadHandlers, HxThreadHandlers | null>({
  combine: (values) => values[0] ?? null,
});

const rangeLabel = (start: number, end: number): string =>
  start === end ? `line ${start}` : `lines ${start}-${end}`;

const UNITS: readonly [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
];

/** "3 hours ago" for an ISO time; empty when it is not a date. */
export function relativeTime(time: string, now = Date.now()): string {
  const date = new Date(time).getTime();
  if (Number.isNaN(date)) return '';
  const seconds = Math.round((date - now) / 1000);
  const format = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit);
  }
  return format.format(seconds, 'second');
}

const fullTime = (time: string): string => {
  const date = new Date(time);
  return Number.isNaN(date.getTime()) ? time : date.toLocaleString();
};

const sameComments = (a: HxDiffThread, b: HxDiffThread): boolean =>
  a.comments.length === b.comments.length &&
  a.comments.every((c, i) => {
    const o = b.comments[i];
    return c.id === o.id && c.author === o.author && c.time === o.time && c.text === o.text;
  });

class ThreadBox extends WidgetType {
  constructor(
    private readonly placed: HxPlacedThread,
    private readonly open: boolean,
    private readonly render: HxThreadRender,
  ) {
    super();
  }
  override eq(other: ThreadBox): boolean {
    const t = this.placed.thread;
    const o = other.placed.thread;
    return (
      t.id === o.id &&
      t.resolved === o.resolved &&
      t.side === o.side &&
      t.startLine === o.startLine &&
      t.endLine === o.endLine &&
      sameComments(t, o) &&
      this.placed.end === other.placed.end &&
      this.open === other.open &&
      this.render === other.render
    );
  }
  override toDOM(view: EditorView): HTMLElement {
    const t = this.placed.thread;
    const collapsed = t.resolved && !this.open;
    const box = document.createElement('div');
    box.className = `cm-thread-box${t.resolved ? ' cm-thread-resolved' : ''}${
      collapsed ? ' cm-thread-collapsed' : ''
    }`;
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', `Thread on ${rangeLabel(t.startLine, t.endLine)}`);
    const first = t.comments[0];
    const count = t.comments.length;

    const head = document.createElement('div');
    head.className = 'cm-thread-head';
    if (t.resolved) {
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'cm-thread-toggle';
      toggle.setAttribute('aria-expanded', String(!collapsed));
      toggle.textContent = collapsed
        ? `Resolved · ${first?.author ?? ''} · ${count} comment${count === 1 ? '' : 's'}`
        : 'Resolved';
      toggle.addEventListener('click', () => view.dispatch({ effects: toggleOpen.of(t.id) }));
      head.append(toggle);
    }
    const range = document.createElement('span');
    range.className = 'cm-thread-range';
    range.textContent = `${t.side === 'original' ? 'old ' : ''}${rangeLabel(t.startLine, t.endLine)}`;
    head.append(range);
    const resolve = document.createElement('button');
    resolve.type = 'button';
    resolve.className = 'cm-thread-resolve';
    resolve.textContent = t.resolved ? 'Unresolve' : 'Resolve';
    resolve.addEventListener('click', () =>
      view.state.facet(handlersFacet)?.resolve(view, t.id, !t.resolved),
    );
    head.append(resolve);
    box.append(head);
    if (collapsed) return box;

    for (const c of t.comments) {
      const item = document.createElement('div');
      item.className = 'cm-thread-comment';
      const meta = document.createElement('div');
      meta.className = 'cm-thread-meta';
      const author = document.createElement('span');
      author.className = 'cm-thread-author';
      author.textContent = c.author;
      const time = document.createElement('time');
      time.className = 'cm-thread-time';
      time.dateTime = c.time;
      time.title = fullTime(c.time);
      time.textContent = relativeTime(c.time);
      meta.append(author, time);
      const body = document.createElement('div');
      body.className = 'cm-thread-text';
      if (this.render) body.innerHTML = this.render(c.text);
      else body.textContent = c.text;
      item.append(meta, body);
      box.append(item);
    }

    const input = document.createElement('textarea');
    input.className = 'cm-thread-input';
    input.rows = 2;
    input.placeholder = 'Reply';
    input.setAttribute('aria-label', `Reply to thread on ${rangeLabel(t.startLine, t.endLine)}`);
    const send = document.createElement('button');
    send.type = 'button';
    send.className = 'cm-thread-reply';
    send.textContent = 'Reply';
    send.disabled = true;
    const submit = () => {
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      send.disabled = true;
      view.state.facet(handlersFacet)?.reply(view, t.id, text);
    };
    input.addEventListener('input', () => {
      send.disabled = !input.value.trim();
    });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        submit();
        event.preventDefault();
      }
      event.stopPropagation();
    });
    send.addEventListener('click', submit);
    const actions = document.createElement('div');
    actions.className = 'cm-thread-actions';
    actions.append(send);
    box.append(input, actions);
    return box;
  }
  override ignoreEvent(): boolean {
    return true;
  }
}

interface Shown {
  readonly threads: readonly HxPlacedThread[];
  readonly render: HxThreadRender;
  /** Ids of resolved threads the reader expanded. */
  readonly open: ReadonlySet<string>;
  readonly decorations: DecorationSet;
}

const decorate = (
  doc: EditorView['state']['doc'],
  threads: readonly HxPlacedThread[],
  open: ReadonlySet<string>,
  render: HxThreadRender,
): DecorationSet => {
  const ranges: Range<Decoration>[] = [];
  for (const placed of threads) {
    const { start, end } = placed;
    if (start < 1 || end < start || end > doc.lines) continue;
    if (placed.mark) {
      for (let n = start; n <= end; n++) {
        ranges.push(Decoration.line({ class: 'cm-thread-line' }).range(doc.line(n).from));
      }
    }
    // Side 2: after findings (side 1), before comments (side 3).
    ranges.push(
      Decoration.widget({
        widget: new ThreadBox(placed, open.has(placed.thread.id), render),
        block: true,
        side: 2,
      }).range(doc.line(end).to),
    );
  }
  return Decoration.set(ranges, true);
};

const field: StateField<Shown> = StateField.define<Shown>({
  create: () => ({
    threads: [],
    render: null,
    open: new Set(),
    decorations: Decoration.none,
  }),
  update(value, tr) {
    let { threads, render, open } = value;
    let changed = false;
    for (const effect of tr.effects) {
      if (effect.is(setThreads)) {
        threads = effect.value.threads;
        render = effect.value.render;
        changed = true;
      } else if (effect.is(toggleOpen)) {
        const next = new Set(open);
        if (!next.delete(effect.value)) next.add(effect.value);
        open = next;
        changed = true;
      }
    }
    if (!changed) return value;
    return {
      threads,
      render,
      open,
      decorations: decorate(tr.state.doc, threads, open, render),
    };
  },
  provide: (f) => EditorView.decorations.from(f, (v) => v.decorations),
});

/**
 * Shows `threads` (already placed on this editor's lines) as boxes below their last line.
 * `render` turns comment text into HTML that is already sanitized; `null` shows plain text.
 */
export function showThreads(
  view: EditorView,
  threads: readonly HxPlacedThread[],
  render: HxThreadRender,
): void {
  view.dispatch({ effects: setThreads.of({ threads, render }) });
}

/**
 * Review threads for one editor: a box with the comments in order, a reply field and a resolve
 * button; a resolved thread is one line until it is clicked. Fed by {@link showThreads}.
 */
export function threadExtension(handlers: HxThreadHandlers): Extension {
  return [
    handlersFacet.of(handlers),
    field,
    EditorView.baseTheme({
      '.cm-thread-line': { backgroundColor: 'var(--h-highlight-background)' },
      '.cm-thread-box': {
        margin: '4px 8px 4px 48px',
        padding: '6px 8px',
        border: '1px solid var(--h-content-border-color)',
        borderLeft: '3px solid var(--h-primary-color)',
        borderRadius: 'var(--h-border-radius, 4px)',
        backgroundColor: 'var(--h-content-background)',
        color: 'var(--h-text-color)',
        fontFamily: 'inherit',
      },
      '.cm-thread-resolved': {
        borderLeftColor: 'var(--h-content-border-color)',
      },
      '.cm-thread-head': { display: 'flex', gap: '8px', alignItems: 'center' },
      '.cm-thread-range': {
        color: 'var(--h-text-muted-color)',
        fontSize: '0.75em',
        marginLeft: 'auto',
      },
      '.cm-thread-comment': {
        marginTop: '6px',
        paddingTop: '6px',
        borderTop: '1px solid var(--h-content-border-color)',
      },
      '.cm-thread-comment:first-of-type': {
        borderTop: 'none',
        paddingTop: '0',
      },
      '.cm-thread-meta': { display: 'flex', gap: '8px', fontSize: '0.75em' },
      '.cm-thread-author': { fontWeight: '600' },
      '.cm-thread-time': { color: 'var(--h-text-muted-color)' },
      '.cm-thread-text': { whiteSpace: 'pre-wrap' },
      '.cm-thread-input': {
        display: 'block',
        width: '100%',
        boxSizing: 'border-box',
        marginTop: '8px',
        font: 'inherit',
        color: 'inherit',
        background: 'transparent',
        border: '1px solid var(--h-content-border-color)',
        borderRadius: 'var(--h-border-radius, 4px)',
        resize: 'vertical',
      },
      '.cm-thread-actions': { display: 'flex', gap: '6px', marginTop: '6px' },
      '.cm-thread-box button': {
        font: 'inherit',
        color: 'inherit',
        background: 'transparent',
        border: '1px solid var(--h-content-border-color)',
        borderRadius: 'var(--h-border-radius, 4px)',
        padding: '2px 10px',
        cursor: 'pointer',
      },
      '.cm-thread-box button.cm-thread-toggle': {
        border: 'none',
        padding: '0',
        textAlign: 'left',
      },
      '.cm-thread-box button:disabled': { opacity: '0.6', cursor: 'default' },
      '.cm-thread-box button:focus-visible, .cm-thread-input:focus-visible': {
        outline: '2px solid var(--h-primary-color)',
        outlineOffset: '1px',
      },
    }),
  ];
}
