import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  Directive,
  effect,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  untracked,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import {
  type HxCommit,
  type HxCommitRef,
  type HxGraphRow,
  type HxLayoutState,
  HX_GRAPH_COLORS,
  hxLayoutCommits,
} from './commit-layout';

/** Context of the `hxCommitGraphRowCell` template: `$implicit` is the commit, `row` its layout. */
export interface HxCommitGraphRowCellContext {
  $implicit: HxCommit;
  row: HxGraphRow;
}

/**
 * Marks the `<ng-template>` that renders extra content at the end of each row of `hx-commit-graph`.
 *
 * ```html
 * <hx-commit-graph [commits]="commits">
 *   <ng-template hxCommitGraphRowCell let-commit let-row="row"><button>Pick</button></ng-template>
 * </hx-commit-graph>
 * ```
 */
@Directive({ selector: 'ng-template[hxCommitGraphRowCell]' })
export class HxCommitGraphRowCell {
  readonly template = inject<TemplateRef<HxCommitGraphRowCellContext>>(TemplateRef);

  static ngTemplateContextGuard(
    _dir: HxCommitGraphRowCell,
    _ctx: unknown,
  ): _ctx is HxCommitGraphRowCellContext {
    return true;
  }
}

/** Width of one lane in SVG units (px); the default height of one row. */
const LANE_WIDTH = 16;
const ROW_HEIGHT = 28;
const DOT_RADIUS = 4;

interface Path {
  readonly d: string;
  readonly color: number;
}

interface Dot {
  readonly cx: number;
  readonly color: number;
  readonly merge: boolean;
}

interface Row {
  readonly id: string;
  readonly commit: HxCommit;
  readonly layout: HxGraphRow;
  readonly paths: readonly Path[];
  readonly dot: Dot;
  readonly name: string;
  readonly time: string;
  readonly refs: readonly { name: string; kind: HxCommitRef['kind'] }[];
  readonly subject: string;
}

/**
 * Builds the SVG shapes of one row of `rowHeight` px; lanes from `maxLanes - 1` on are folded into
 * the last lane.
 */
export function hxGraphRowShapes(
  layout: HxGraphRow,
  maxLanes: number,
  merge: boolean,
  rowHeight = ROW_HEIGHT,
): { paths: Path[]; dot: Dot } {
  const last = Math.max(1, maxLanes) - 1;
  const x = (lane: number) => Math.min(lane, last) * LANE_WIDTH + LANE_WIDTH / 2;
  const cy = rowHeight / 2;

  // The line color of the last lane is fixed, so a folded line keeps its color from row to row.
  const lastColor = last % HX_GRAPH_COLORS;
  const colorAt = (lane: number, own: number) => (lane >= last ? lastColor : own);

  const paths: Path[] = [];
  const line = (x1: number, y1: number, x2: number, y2: number, color: number) => {
    if (x1 === x2) {
      paths.push({ d: `M${x1} ${y1}V${y2}`, color });
    } else {
      const ym = (y1 + y2) / 2;
      paths.push({ d: `M${x1} ${y1}C${x1} ${ym} ${x2} ${ym} ${x2} ${y2}`, color });
    }
  };

  if (layout.hasIncoming)
    line(x(layout.lane), 0, x(layout.lane), cy, colorAt(layout.lane, layout.color));
  for (const s of layout.segments) {
    const color = colorAt(Math.max(s.fromLane, s.toLane), s.color);
    switch (s.kind) {
      case 'pass-through':
        if (s.fromLane === layout.lane) line(x(s.fromLane), cy, x(s.toLane), rowHeight, color);
        else line(x(s.fromLane), 0, x(s.toLane), rowHeight, colorAt(s.fromLane, s.color));
        break;
      case 'merge-in':
        line(x(s.fromLane), 0, x(s.toLane), cy, colorAt(s.fromLane, s.color));
        break;
      case 'branch-out':
        line(x(s.fromLane), cy, x(s.toLane), rowHeight, colorAt(s.toLane, s.color));
        break;
    }
  }
  return {
    paths,
    dot: { cx: x(layout.lane), color: colorAt(layout.lane, layout.color), merge },
  };
}

const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;

/** Relative time ("5 min ago"); a date (`2026-01-31`) from 30 days on. */
export function hxFormatCommitTime(secs: number, now = Date.now() / 1000): string {
  const diff = Math.max(0, now - secs);
  if (diff < MINUTE) return 'just now';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} min ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)} h ago`;
  if (diff < 30 * DAY) return `${Math.floor(diff / DAY)} d ago`;
  return new Date(secs * 1000).toISOString().slice(0, 10);
}

const REF_LABEL: Record<HxCommitRef['kind'], string> = {
  branch: 'Branch',
  remote: 'Remote branch',
  tag: 'Tag',
  head: 'HEAD',
};

let nextId = 0;

interface Model {
  readonly rows: readonly Row[];
  /** Lanes the layout needs, before `maxLanes` limits them. */
  readonly lanes: number;
  /** Index of each commit id. */
  readonly index: ReadonlyMap<string, number>;
  /** `append` when the commits continued the previous list, else `full`. */
  readonly kind: 'append' | 'full';
}

/** What the model needs from the previous run to continue it. */
interface Cache {
  readonly commits: readonly HxCommit[];
  readonly state: HxLayoutState;
  readonly layout: readonly HxGraphRow[];
  readonly rows: readonly Row[];
  readonly lanes: number;
  readonly index: ReadonlyMap<string, number>;
  readonly format: (secs: number) => string;
  readonly maxLanes: number;
  readonly rowHeight: number;
}

function lanesOf(row: HxGraphRow, from: number): number {
  let n = Math.max(from, row.lane + 1);
  for (const s of row.segments) n = Math.max(n, s.fromLane + 1, s.toLane + 1);
  return n;
}

/**
 * Shows a commit history as rows: the graph, ref labels, message, author and time. One commit is
 * selected; arrow keys, Home and End move. Only the visible rows are in the DOM; `loadMore` asks
 * for the next page.
 *
 * ```html
 * <hx-commit-graph aria-label="History" [commits]="commits" [(selected)]="id" />
 * ```
 */
@Component({
  selector: 'hx-commit-graph',
  imports: [NgTemplateOutlet, CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf],
  templateUrl: './commit-graph.html',
  styleUrl: './commit-graph.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-commit-graph',
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
    '[style.--hx-commit-graph-row-height]': 'rowHeight() + "px"',
  },
})
export class HxCommitGraph {
  readonly #uid = `hx-commit-graph-${nextId++}`;
  #cache: Cache | null = null;
  #loadMoreFor = -1;

  /** The commits, a commit before its parents. */
  readonly commits = input.required<readonly HxCommit[]>();
  /** The id of the selected commit. */
  readonly selected = input<string | null>(null);
  /** Maximum number of lanes drawn; further lanes are folded into the last one. */
  readonly maxLanes = input(12);
  /** Height of one row in px. Rows and their SVG have exactly this height. */
  readonly rowHeight = input(ROW_HEIGHT);
  /** Rows rendered above and below the visible rows. */
  readonly buffer = input(5);
  /** Whether more commits can be loaded; `loadMore` fires only while this is true. */
  readonly hasMore = input(false);
  /** Whether a page is loading; shows a row with a spinner and holds back `loadMore`. */
  readonly loading = input(false);
  /** `loadMore` fires when the last rendered row is within this many rows of the end. */
  readonly loadMoreThreshold = input(20);
  /** Formats a Unix time in seconds; the default is relative ("5 min ago"). */
  readonly formatTime = input<(secs: number) => string>(hxFormatCommitTime);
  /** The accessible name of the list. */
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });
  /** Emits the id of the commit the user selects. */
  readonly selectedChange = output<string>();
  /** Emits when the user reaches the end of the loaded commits and `hasMore` is true. */
  readonly loadMore = output<void>();

  protected readonly rowCell = contentChild(HxCommitGraphRowCell);
  protected readonly viewport = viewChild(CdkVirtualScrollViewport);
  protected readonly active = signal<string | null>(null);
  protected readonly dotRadius = DOT_RADIUS;
  readonly #lastRendered = signal(-1);

  protected readonly bufferPx = computed(() => Math.max(0, this.buffer()) * this.rowHeight());

  protected readonly model = computed<Model>(() => {
    const commits = this.commits();
    const format = this.formatTime();
    const maxLanes = this.maxLanes();
    const rowHeight = this.rowHeight();
    const prev = this.#cache;
    const sameLook =
      !!prev &&
      prev.format === format &&
      prev.maxLanes === maxLanes &&
      prev.rowHeight === rowHeight;
    const append =
      !!prev &&
      commits.length >= prev.commits.length &&
      prev.commits.every((c, i) => commits[i]?.id === c.id);

    // A replaced list may have the same length as before: let it page again.
    if (!append) this.#loadMoreFor = -1;

    let state: HxLayoutState;
    let layout: readonly HxGraphRow[];
    if (append) {
      const more = hxLayoutCommits(commits.slice(prev.commits.length), prev.state);
      state = more.state;
      layout = prev.layout.concat(more.rows);
    } else {
      const full = hxLayoutCommits(commits);
      state = full.state;
      layout = full.rows;
    }

    // Rows of an unchanged look stay as they are; a changed look builds them all again.
    // Commit objects that changed (new refs, same id) need new rows.
    const keep = append && sameLook && prev.commits.every((c, i) => commits[i] === c);
    const from = keep ? prev.commits.length : 0;
    const built = keep ? prev.rows.slice() : [];
    const index = keep ? new Map(prev.index) : new Map<string, number>();
    let lanes = keep ? prev.lanes : 1;
    for (let i = from; i < commits.length; i++) {
      const commit = commits[i];
      lanes = lanesOf(layout[i], lanes);
      index.set(commit.id, i);
      built.push({
        id: `${this.#uid}-${i}`,
        commit,
        layout: layout[i],
        ...hxGraphRowShapes(layout[i], maxLanes, commit.parents.length > 1, rowHeight),
        name: commit.author,
        time: format(commit.time),
        subject: commit.message.split('\n', 1)[0],
        refs: (commit.refs ?? []).map((r) => ({ name: r.name, kind: r.kind })),
      });
    }

    this.#cache = {
      commits,
      state,
      layout,
      rows: built,
      lanes,
      index,
      format,
      maxLanes,
      rowHeight,
    };
    return { rows: built, lanes, index, kind: append ? 'append' : 'full' };
  });

  protected readonly rows = computed(() => this.model().rows);

  /** Number of lanes the graph column shows. */
  protected readonly laneCount = computed(() =>
    Math.min(this.model().lanes, Math.max(1, this.maxLanes())),
  );

  protected readonly graphWidth = computed(() => this.laneCount() * LANE_WIDTH);

  protected readonly activeIndex = computed(() => {
    const n = this.rows().length;
    if (n === 0) return -1;
    const index = this.model().index;
    const a = this.active();
    const own = a === null ? undefined : index.get(a);
    if (own !== undefined) return own;
    return index.get(this.selected() ?? '') ?? 0;
  });

  protected readonly activeId = computed(() => this.rows()[this.activeIndex()]?.id ?? null);

  constructor() {
    // Follow the rendered range of the viewport.
    effect((onCleanup) => {
      const viewport = this.viewport();
      if (!viewport) return;
      this.#lastRendered.set(viewport.getRenderedRange().end - 1);
      const sub = viewport.renderedRangeStream.subscribe((r) => this.#lastRendered.set(r.end - 1));
      onCleanup(() => sub.unsubscribe());
    });

    // Page in the next commits once, until the list grows.
    effect(() => {
      this.model(); // a replaced list resets the guard below
      const length = this.commits().length;
      const last = this.#lastRendered();
      const near = last >= length - this.loadMoreThreshold();
      if (!this.hasMore() || this.loading() || length === 0 || !near) return;
      untracked(() => {
        if (this.#loadMoreFor === length) return;
        this.#loadMoreFor = length;
        this.loadMore.emit();
      });
    });

    // A list that did not continue the old one: keep the scroll position inside the new length.
    effect(() => {
      const model = this.model();
      const viewport = this.viewport();
      if (model.kind !== 'full' || !viewport) return;
      untracked(() => {
        const max = Math.max(0, model.rows.length * this.rowHeight() - viewport.getViewportSize());
        if (viewport.measureScrollOffset() > max) viewport.scrollToOffset(max);
      });
    });
  }

  /**
   * Scrolls a loaded commit to the nearest visible position. Returns `false`, without scrolling,
   * when the commit is not loaded.
   */
  reveal(id: string): boolean {
    const index = this.model().index.get(id);
    if (index === undefined) return false;
    this.#scrollTo(index);
    return true;
  }

  #scrollTo(index: number): void {
    const viewport = this.viewport();
    if (!viewport) return;
    const height = this.rowHeight();
    const top = index * height;
    const offset = viewport.measureScrollOffset();
    const size = viewport.getViewportSize();
    if (top < offset) viewport.scrollToOffset(top);
    else if (top + height > offset + size) viewport.scrollToOffset(top + height - size);
  }

  protected trackRow(_index: number, row: Row): string {
    return row.commit.id;
  }

  protected refLabel(kind: HxCommitRef['kind']): string {
    return REF_LABEL[kind];
  }

  protected label(row: Row): string {
    return `${row.subject}, ${row.name}, ${row.time}`;
  }

  protected select(index: number): void {
    const row = this.rows()[index];
    if (!row) return;
    this.active.set(row.commit.id);
    this.selectedChange.emit(row.commit.id);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const n = this.rows().length;
    if (n === 0) return;
    const at = this.activeIndex();
    let next: number;
    switch (event.key) {
      case 'ArrowDown':
        next = Math.min(at + 1, n - 1);
        break;
      case 'ArrowUp':
        next = Math.max(at - 1, 0);
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = n - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.select(at);
        return;
      default:
        return;
    }
    event.preventDefault();
    this.select(next);
    this.#scrollTo(next);
  }
}
