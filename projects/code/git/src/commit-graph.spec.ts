import { Component, signal, viewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HxCommitGraph,
  HxCommitGraphRowCell,
  hxFormatCommitTime,
  hxGraphRowShapes,
} from './commit-graph';
import type { HxCommit } from './commit-layout';
import * as api from './public-api';

const COMMITS: HxCommit[] = [
  {
    id: 'm',
    parents: ['a', 'b'],
    message: 'Merge feature\n\nbody',
    author: 'Ada',
    time: 1_000,
    refs: [
      { name: 'main', kind: 'branch' },
      { name: 'HEAD', kind: 'head' },
      { name: 'origin/main', kind: 'remote' },
      { name: 'v1', kind: 'tag' },
    ],
  },
  { id: 'a', parents: ['r'], message: 'Main work', author: 'Bob', time: 900 },
  { id: 'b', parents: ['r'], message: 'Feature work', author: 'Cy', time: 800 },
  { id: 'r', parents: [], message: 'Root', author: 'Ada', time: 700 },
];

@Component({
  imports: [HxCommitGraph, HxCommitGraphRowCell],
  template: `
    <hx-commit-graph
      aria-label="History"
      [commits]="commits()"
      [selected]="selected()"
      [maxLanes]="maxLanes()"
      [rowHeight]="rowHeight()"
      [buffer]="buffer()"
      [hasMore]="hasMore()"
      [loading]="loading()"
      [loadMoreThreshold]="threshold()"
      [formatTime]="fmt"
      (loadMore)="loads = loads + 1"
      (selectedChange)="picked.push($event); selected.set($event)"
    >
      @if (withCell) {
        <ng-template hxCommitGraphRowCell let-commit let-row="row">
          <button type="button" class="cell">{{ commit.id }}@{{ row.lane }}{{ seen(commit.id, row) }}</button>
        </ng-template>
      }
    </hx-commit-graph>
  `,
})
class Host {
  commits = signal<HxCommit[]>(COMMITS);
  selected = signal<string | null>(null);
  maxLanes = signal(12);
  rowHeight = signal(28);
  buffer = signal(5);
  hasMore = signal(false);
  loading = signal(false);
  threshold = signal(20);
  loads = 0;
  picked: string[] = [];
  withCell = false;
  graph = viewChild.required(HxCommitGraph);
  fmt = (s: number) => `t${s}`;
  /** The layout objects each commit showed; one object means its row was never laid out again. */
  layouts = new Map<string, Set<object>>();
  seen(id: string, row: object): string {
    const set = this.layouts.get(id) ?? new Set();
    set.add(row);
    this.layouts.set(id, set);
    return '';
  }
}

/** jsdom has no layout: give every element a viewport height of `px`. */
function mockViewportHeight(px: number): void {
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(px);
  // jsdom has no `scrollTo`; set the offset and tell the viewport.
  HTMLElement.prototype.scrollTo = function (this: HTMLElement, opts?: ScrollToOptions | number) {
    this.scrollTop = typeof opts === 'object' ? (opts.top ?? 0) : 0;
    this.dispatchEvent(new Event('scroll'));
  } as typeof HTMLElement.prototype.scrollTo;
}

describe('HxCommitGraph', () => {
  let fixture: ComponentFixture<Host>;

  beforeEach(() => mockViewportHeight(280));
  afterEach(() => vi.restoreAllMocks());
  const el = () => fixture.nativeElement as HTMLElement;
  const list = () => el().querySelector<HTMLElement>('[role=listbox]')!;
  const options = () => [...el().querySelectorAll<HTMLElement>('[role=option]')];

  /** The viewport measures and renders in a microtask and after change detection. */
  async function flush(): Promise<void> {
    for (let i = 0; i < 3; i++) {
      fixture.detectChanges();
      await fixture.whenStable();
      await new Promise((r) => setTimeout(r, 0));
    }
    fixture.detectChanges();
  }

  async function create(withCell = false): Promise<void> {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(Host);
    fixture.componentInstance.withCell = withCell;
    await flush();
  }

  async function key(k: string): Promise<void> {
    list().dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
    await flush();
  }

  it('renders a listbox with one option per commit and an accessible name', async () => {
    await create();
    expect(list().getAttribute('aria-label')).toBe('History');
    expect(options().length).toBe(4);
    expect(options()[1].getAttribute('aria-label')).toBe('Main work, Bob, t900');
  });

  it('shows the first line of the message with the full text as tooltip, author and time', async () => {
    await create();
    const first = options()[0];
    const msg = first.querySelector<HTMLElement>('.hx-commit-graph-message')!;
    expect(msg.textContent).toBe('Merge feature');
    expect(msg.title).toBe('Merge feature\n\nbody');
    expect(first.querySelector('.hx-commit-graph-author')!.textContent).toBe('Ada');
    expect(first.querySelector('.hx-commit-graph-time')!.textContent).toBe('t1000');
  });

  it('draws an SVG per row with a distinct dot for a merge commit', async () => {
    await create();
    expect(options().every((o) => o.querySelector('svg path'))).toBe(true);
    const dots = options().map((o) => o.querySelector('circle')!);
    expect(dots[0].classList.contains('is-merge')).toBe(true);
    expect(dots[1].classList.contains('is-merge')).toBe(false);
  });

  it('renders ref labels by kind before the message', async () => {
    await create();
    const refs = [...options()[0].querySelectorAll<HTMLElement>('.hx-commit-graph-ref')];
    expect(refs.map((r) => r.dataset['kind'])).toEqual(['branch', 'head', 'remote', 'tag']);
    const msg = options()[0].querySelector('.hx-commit-graph-message')!;
    expect(refs[0].compareDocumentPosition(msg) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('selects on click and marks aria-selected', async () => {
    await create();
    options()[2].click();
    await flush();
    expect(fixture.componentInstance.picked).toEqual(['b']);
    expect(options()[2].getAttribute('aria-selected')).toBe('true');
  });

  it('moves the selection with arrows, Home and End', async () => {
    await create();
    await key('ArrowDown');
    await key('ArrowDown');
    expect(fixture.componentInstance.picked).toEqual(['a', 'b']);
    await key('ArrowUp');
    await key('End');
    await key('Home');
    expect(fixture.componentInstance.picked).toEqual(['a', 'b', 'a', 'r', 'm']);
    expect(list().getAttribute('aria-activedescendant')).toBe(options()[0].id);
  });

  it('renders the row cell template per row with the commit and its layout', async () => {
    await create(true);
    const cells = [...el().querySelectorAll('.cell')].map((c) => c.textContent);
    expect(cells).toEqual(['m@0', 'a@0', 'b@1', 'r@0']);
  });

  it('exports the directive and the component', async () => {
    expect(api.HxCommitGraph).toBe(HxCommitGraph);
    expect(api.HxCommitGraphRowCell).toBe(HxCommitGraphRowCell);
  });

  it('limits the graph width to maxLanes', async () => {
    await create();
    const wide = options()[0].querySelector('svg')!.getAttribute('width');
    fixture.componentInstance.maxLanes.set(1);
    await flush();
    expect(options()[0].querySelector('svg')!.getAttribute('width')).toBe('16');
    expect(Number(wide)).toBeGreaterThan(16);
  });
  describe('virtual scrolling and paging', () => {
    const line = (from: number, to: number): HxCommit[] =>
      Array.from({ length: to - from }, (_, k) => {
        const i = from + k;
        return {
          id: `c${i}`,
          parents: [`c${i + 1}`],
          message: `Commit ${i}`,
          author: 'Ada',
          time: 1_000_000 - i,
        };
      });
    const frame = () => new Promise((r) => requestAnimationFrame(r));
    const host = () => fixture.componentInstance;
    const viewport = () => el().querySelector<HTMLElement>('cdk-virtual-scroll-viewport')!;
    async function scrollTo(top: number): Promise<void> {
      viewport().scrollTop = top;
      viewport().dispatchEvent(new Event('scroll'));
      await frame();
      await flush();
    }
    const firstVisible = () => Math.floor(viewport().scrollTop / host().rowHeight());

    it('sets the row height on the host, the rows and the SVG', async () => {
      await create();
      host().rowHeight.set(40);
      await flush();
      const root = el().querySelector<HTMLElement>('hx-commit-graph')!;
      expect(root.style.getPropertyValue('--hx-commit-graph-row-height')).toBe('40px');
      expect(options()[0].querySelector('svg')!.getAttribute('height')).toBe('40');
      // The last segment of a row ends on the row's bottom edge.
      expect(options()[1].querySelector('path')!.getAttribute('d')).toContain('V');
    });

    it('draws segments up to the row height', () => {
      const row = { lane: 0, color: 0, hasIncoming: true, segments: [] };
      const withLine = {
        ...row,
        segments: [{ fromLane: 0, toLane: 0, color: 0, kind: 'pass-through' as const }],
      };
      expect(hxGraphRowShapes(withLine, 12, false, 40).paths.map((p) => p.d)).toEqual([
        'M8 0V20',
        'M8 20V40',
      ]);
    });

    it('renders only the visible rows of 10,000 commits', async () => {
      await create();
      host().commits.set(line(0, 10_000));
      await flush();
      const max = Math.ceil(280 / 28) + 2 * 5;
      expect(options().length).toBeGreaterThan(0);
      expect(options().length).toBeLessThanOrEqual(max);
      await scrollTo(28 * 5000);
      expect(options().length).toBeLessThanOrEqual(max);
      expect(options().some((o) => o.getAttribute('aria-label')!.startsWith('Commit 5000'))).toBe(
        true,
      );
    });

    it('fires loadMore near the end, once, only while hasMore and not loading', async () => {
      await create();
      host().commits.set(line(0, 100));
      host().threshold.set(20);
      await flush();
      expect(host().loads).toBe(0); // hasMore is false

      host().hasMore.set(true);
      await flush();
      expect(host().loads).toBe(0); // the last rendered row is far from the end

      await scrollTo(28 * 100);
      expect(host().loads).toBe(1);
      await scrollTo(28 * 100 - 28);
      expect(host().loads).toBe(1); // once until commits grows

      host().loading.set(true);
      host().commits.set(line(0, 200));
      await flush();
      await scrollTo(28 * 200);
      expect(host().loads).toBe(1); // loading holds it back
      host().loading.set(false);
      await flush();
      expect(host().loads).toBe(2);
    });

    it('shows a loading row with a spinner', async () => {
      await create();
      expect(el().querySelector('.hx-commit-graph-spinner')).toBeNull();
      host().loading.set(true);
      await flush();
      expect(
        el().querySelector('.hx-commit-graph-loading .hx-commit-graph-spinner'),
      ).not.toBeNull();
    });

    it('keeps the scroll offset, the first visible commit and the selection on append', async () => {
      await create();
      host().commits.set(line(0, 100));
      host().selected.set('c30');
      await flush();
      await scrollTo(28 * 40);
      const picked = host().picked.length;
      const first = firstVisible();

      host().commits.set(line(0, 150));
      await flush();
      expect(viewport().scrollTop).toBe(28 * 40);
      expect(firstVisible()).toBe(first);
      expect(host().picked.length).toBe(picked);
      expect(host().selected()).toBe('c30');
      expect(viewport().querySelector('.is-selected')).toBeNull(); // c30 is above the window
      await scrollTo(28 * 25);
      expect(viewport().querySelector('.is-selected')!.getAttribute('aria-label')).toContain(
        'Commit 30',
      );
    });

    it('continues the layout on an append and lays out again on a replace', async () => {
      await create(true);
      host().commits.set(line(0, 100));
      await flush();
      host().commits.set(line(0, 130));
      await flush();
      // c50 was laid out once: the append continued from the saved state.
      await scrollTo(28 * 40);
      expect(host().layouts.get('c50')!.size).toBe(1);

      host().commits.set([{ ...line(0, 1)[0], id: 'x' }, ...line(1, 130)]);
      await flush();
      expect(host().layouts.get('c50')!.size).toBe(2);
    });

    it('lays out in full and clamps the scroll position when the list is replaced', async () => {
      await create();
      host().commits.set(line(0, 1000));
      await flush();
      await scrollTo(28 * 900);
      host().commits.set(line(5000, 5050));
      await flush();
      expect(viewport().scrollTop).toBeLessThanOrEqual(28 * 50 - 280);
      expect(options().length).toBeGreaterThan(0);
    });

    it('keeps the selection by id when the list is replaced, without selectedChange', async () => {
      await create();
      host().commits.set(line(0, 50));
      host().selected.set('c10');
      await flush();
      host().commits.set(line(5, 60));
      await flush();
      expect(host().picked).toEqual([]);
      expect(options().find((o) => o.classList.contains('is-selected'))!.id).toBeTruthy();
      expect(
        options()
          .find((o) => o.classList.contains('is-selected'))!
          .getAttribute('aria-label'),
      ).toContain('Commit 10');
    });

    it('scrolls the selected row into view with the keyboard', async () => {
      await create();
      host().commits.set(line(0, 100));
      await flush();
      await key('End');
      expect(host().picked.at(-1)).toBe('c99');
      expect(viewport().scrollTop).toBe(28 * 100 - 280);
      await key('Home');
      expect(viewport().scrollTop).toBe(0);
    });

    it('reveals a loaded commit at the nearest position and refuses an unknown one', async () => {
      await create();
      host().commits.set(line(0, 100));
      await flush();
      const graph = host().graph();
      expect(graph.reveal('c50')).toBe(true);
      expect(viewport().scrollTop).toBe(28 * 51 - 280);
      await scrollTo(28 * 60);
      expect(graph.reveal('c50')).toBe(true);
      expect(viewport().scrollTop).toBe(28 * 50);
      const before = viewport().scrollTop;
      expect(graph.reveal('nope')).toBe(false);
      expect(viewport().scrollTop).toBe(before);
    });
  });
});

describe('hxGraphRowShapes folding', () => {
  const layout = (lane: number, color: number) => ({
    lane,
    color,
    hasIncoming: true,
    segments: [
      { fromLane: 2, toLane: 2, color: 5, kind: 'pass-through' as const },
      { fromLane: 3, toLane: 3, color: 6, kind: 'pass-through' as const },
      { fromLane: 4, toLane: lane, color: 7, kind: 'merge-in' as const },
    ],
  });

  it('clamps lanes beyond maxLanes - 1 into the last lane in its color', () => {
    // maxLanes 3: last lane is index 2 (x = 2*16+8 = 40), its line color is 2.
    const { paths, dot } = hxGraphRowShapes(layout(4, 1), 3, false);
    expect(dot.cx).toBe(40);
    expect(dot.color).toBe(2);
    expect(paths.every((p) => p.color === 2)).toBe(true);
    expect(
      paths.every((p) => !/M(4[1-9]|[5-9]\d)/.test(p.d) && !/ 4[1-9]| [5-9]\d/.test(p.d)),
    ).toBe(true);
  });

  it('folds to the same color when nothing sits on the last lane itself', () => {
    const row = {
      lane: 0,
      color: 1,
      hasIncoming: false,
      segments: [{ fromLane: 3, toLane: 3, color: 6, kind: 'pass-through' as const }],
    };
    const { paths } = hxGraphRowShapes(row, 3, false);
    expect(paths.map((p) => p.color)).toEqual([2]);
  });

  it('keeps lanes and colors inside the limit', () => {
    const { paths, dot } = hxGraphRowShapes(layout(0, 1), 12, true);
    expect(dot).toEqual({ cx: 8, color: 1, merge: true });
    expect(paths.map((p) => p.color).sort((a, b) => a - b)).toEqual([1, 5, 6, 7]);
  });
});

describe('hxFormatCommitTime', () => {
  it('is relative, then a date', () => {
    expect(hxFormatCommitTime(990, 1000)).toBe('just now');
    expect(hxFormatCommitTime(1000 - 300, 1000)).toBe('5 min ago');
    expect(hxFormatCommitTime(1000 - 7200, 1000)).toBe('2 h ago');
    expect(hxFormatCommitTime(1_000_000 - 3 * 86400, 1_000_000)).toBe('3 d ago');
    expect(hxFormatCommitTime(0, 100 * 86400)).toBe('1970-01-01');
  });
});

/** The spec is built without Node typings; the runner is Node. */
const nodeFs = (
  globalThis as unknown as {
    process: { getBuiltinModule(id: string): { readFileSync(path: string, enc: string): string } };
  }
).process.getBuiltinModule('node:fs');

describe('lane colors', () => {
  const scss = nodeFs.readFileSync('projects/code/git/src/commit-graph.scss', 'utf8');
  const BACKGROUND = { light: '#ffffff', dark: '#1b1b1f' };

  const lum = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a: string, b: string) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };

  function colors(block: string): string[] {
    return [1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
      const m = new RegExp(`--hx-graph-lane-${n}:\\s*(#[0-9a-fA-F]{6})`).exec(block);
      expect(m, `lane ${n}`).not.toBeNull();
      return m![1];
    });
  }

  const [lightBlock, darkBlock] = [
    scss.slice(scss.indexOf(':host {'), scss.indexOf(':host-context(.app-dark)')),
    scss.slice(scss.indexOf(':host-context(.app-dark)'), scss.indexOf('.hx-commit-graph-list')),
  ];

  for (const [theme, block] of [
    ['light', lightBlock],
    ['dark', darkBlock],
  ] as const) {
    it.each([1, 2, 3, 4, 5, 6, 7, 8])(`${theme}: lane %i reaches 3:1`, (n) => {
      expect(contrast(colors(block)[n - 1], BACKGROUND[theme])).toBeGreaterThanOrEqual(3);
    });
  }
});
