import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  Directive,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  type HxCommit,
  type HxCommitRef,
  type HxGraphRow,
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

/** Width of one lane and height of one row, in SVG units (px). */
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

/** Builds the SVG shapes of one row; lanes from `maxLanes - 1` on are folded into the last lane. */
export function hxGraphRowShapes(
  layout: HxGraphRow,
  maxLanes: number,
  merge: boolean,
): { paths: Path[]; dot: Dot } {
  const last = Math.max(1, maxLanes) - 1;
  const x = (lane: number) => Math.min(lane, last) * LANE_WIDTH + LANE_WIDTH / 2;
  const cy = ROW_HEIGHT / 2;

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
        if (s.fromLane === layout.lane) line(x(s.fromLane), cy, x(s.toLane), ROW_HEIGHT, color);
        else line(x(s.fromLane), 0, x(s.toLane), ROW_HEIGHT, colorAt(s.fromLane, s.color));
        break;
      case 'merge-in':
        line(x(s.fromLane), 0, x(s.toLane), cy, colorAt(s.fromLane, s.color));
        break;
      case 'branch-out':
        line(x(s.fromLane), cy, x(s.toLane), ROW_HEIGHT, colorAt(s.toLane, s.color));
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

/**
 * Shows a commit history as rows: the graph, ref labels, message, author and time. One commit is
 * selected; arrow keys, Home and End move.
 *
 * ```html
 * <hx-commit-graph aria-label="History" [commits]="commits" [(selected)]="id" />
 * ```
 */
@Component({
  selector: 'hx-commit-graph',
  imports: [NgTemplateOutlet],
  templateUrl: './commit-graph.html',
  styleUrl: './commit-graph.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-commit-graph',
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
  },
})
export class HxCommitGraph {
  readonly #uid = `hx-commit-graph-${nextId++}`;

  /** The commits, a commit before its parents. */
  readonly commits = input.required<readonly HxCommit[]>();
  /** The id of the selected commit. */
  readonly selected = input<string | null>(null);
  /** Maximum number of lanes drawn; further lanes are folded into the last one. */
  readonly maxLanes = input(12);
  /** Formats a Unix time in seconds; the default is relative ("5 min ago"). */
  readonly formatTime = input<(secs: number) => string>(hxFormatCommitTime);
  /** The accessible name of the list. */
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });
  /** Emits the id of the commit the user selects. */
  readonly selectedChange = output<string>();

  protected readonly rowCell = contentChild(HxCommitGraphRowCell);
  protected readonly active = signal(-1);
  protected readonly rowHeight = ROW_HEIGHT;
  protected readonly dotRadius = DOT_RADIUS;

  protected readonly layout = computed(() => hxLayoutCommits(this.commits()).rows);

  /** Number of lanes the graph column shows. */
  protected readonly laneCount = computed(() => {
    const max = Math.max(1, this.maxLanes());
    let n = 1;
    for (const row of this.layout()) {
      n = Math.max(n, row.lane + 1);
      for (const s of row.segments) n = Math.max(n, s.fromLane + 1, s.toLane + 1);
    }
    return Math.min(n, max);
  });

  protected readonly graphWidth = computed(() => this.laneCount() * LANE_WIDTH);

  protected readonly rows = computed<readonly Row[]>(() => {
    const format = this.formatTime();
    const max = this.maxLanes();
    const layout = this.layout();
    return this.commits().map((commit, i) => {
      const shapes = hxGraphRowShapes(layout[i], max, commit.parents.length > 1);
      return {
        id: `${this.#uid}-${i}`,
        commit,
        layout: layout[i],
        ...shapes,
        name: commit.author,
        time: format(commit.time),
        subject: commit.message.split('\n', 1)[0],
        refs: (commit.refs ?? []).map((r) => ({ name: r.name, kind: r.kind })),
      };
    });
  });

  protected readonly activeIndex = computed(() => {
    const n = this.rows().length;
    if (n === 0) return -1;
    const a = this.active();
    if (a >= 0) return Math.min(a, n - 1);
    const s = this.rows().findIndex((r) => r.commit.id === this.selected());
    return s >= 0 ? s : 0;
  });

  protected readonly activeId = computed(() => this.rows()[this.activeIndex()]?.id ?? null);

  protected refLabel(kind: HxCommitRef['kind']): string {
    return REF_LABEL[kind];
  }

  protected label(row: Row): string {
    return `${row.subject}, ${row.name}, ${row.time}`;
  }

  protected select(index: number): void {
    const row = this.rows()[index];
    if (!row) return;
    this.active.set(index);
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
    document.getElementById(this.rows()[next].id)?.scrollIntoView?.({ block: 'nearest' });
  }
}
