import { Component, signal } from '@angular/core';
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
      [formatTime]="fmt"
      (selectedChange)="picked.push($event); selected.set($event)"
    >
      @if (withCell) {
        <ng-template hxCommitGraphRowCell let-commit let-row="row">
          <button type="button" class="cell">{{ commit.id }}@{{ row.lane }}</button>
        </ng-template>
      }
    </hx-commit-graph>
  `,
})
class Host {
  commits = signal<HxCommit[]>(COMMITS);
  selected = signal<string | null>(null);
  maxLanes = signal(12);
  picked: string[] = [];
  withCell = false;
  fmt = (s: number) => `t${s}`;
}

describe('HxCommitGraph', () => {
  let fixture: ComponentFixture<Host>;
  const el = () => fixture.nativeElement as HTMLElement;
  const list = () => el().querySelector<HTMLElement>('[role=listbox]')!;
  const options = () => [...el().querySelectorAll<HTMLElement>('[role=option]')];

  function create(withCell = false): void {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(Host);
    fixture.componentInstance.withCell = withCell;
    fixture.detectChanges();
  }

  function key(k: string): void {
    list().dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
    fixture.detectChanges();
  }

  it('renders a listbox with one option per commit and an accessible name', () => {
    create();
    expect(list().getAttribute('aria-label')).toBe('History');
    expect(options().length).toBe(4);
    expect(options()[1].getAttribute('aria-label')).toBe('Main work, Bob, t900');
  });

  it('shows the first line of the message with the full text as tooltip, author and time', () => {
    create();
    const first = options()[0];
    const msg = first.querySelector<HTMLElement>('.hx-commit-graph-message')!;
    expect(msg.textContent).toBe('Merge feature');
    expect(msg.title).toBe('Merge feature\n\nbody');
    expect(first.querySelector('.hx-commit-graph-author')!.textContent).toBe('Ada');
    expect(first.querySelector('.hx-commit-graph-time')!.textContent).toBe('t1000');
  });

  it('draws an SVG per row with a distinct dot for a merge commit', () => {
    create();
    expect(options().every((o) => o.querySelector('svg path'))).toBe(true);
    const dots = options().map((o) => o.querySelector('circle')!);
    expect(dots[0].classList.contains('is-merge')).toBe(true);
    expect(dots[1].classList.contains('is-merge')).toBe(false);
  });

  it('renders ref labels by kind before the message', () => {
    create();
    const refs = [...options()[0].querySelectorAll<HTMLElement>('.hx-commit-graph-ref')];
    expect(refs.map((r) => r.dataset['kind'])).toEqual(['branch', 'head', 'remote', 'tag']);
    const msg = options()[0].querySelector('.hx-commit-graph-message')!;
    expect(refs[0].compareDocumentPosition(msg) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('selects on click and marks aria-selected', () => {
    create();
    options()[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.picked).toEqual(['b']);
    expect(options()[2].getAttribute('aria-selected')).toBe('true');
  });

  it('moves the selection with arrows, Home and End', () => {
    create();
    key('ArrowDown');
    key('ArrowDown');
    expect(fixture.componentInstance.picked).toEqual(['a', 'b']);
    key('ArrowUp');
    key('End');
    key('Home');
    expect(fixture.componentInstance.picked).toEqual(['a', 'b', 'a', 'r', 'm']);
    expect(list().getAttribute('aria-activedescendant')).toBe(options()[0].id);
  });

  it('renders the row cell template per row with the commit and its layout', () => {
    create(true);
    const cells = [...el().querySelectorAll('.cell')].map((c) => c.textContent);
    expect(cells).toEqual(['m@0', 'a@0', 'b@1', 'r@0']);
  });

  it('exports the directive and the component', () => {
    expect(api.HxCommitGraph).toBe(HxCommitGraph);
    expect(api.HxCommitGraphRowCell).toBe(HxCommitGraphRowCell);
  });

  it('limits the graph width to maxLanes', () => {
    create();
    const wide = options()[0].querySelector('svg')!.getAttribute('width');
    fixture.componentInstance.maxLanes.set(1);
    fixture.detectChanges();
    expect(options()[0].querySelector('svg')!.getAttribute('width')).toBe('16');
    expect(Number(wide)).toBeGreaterThan(16);
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
    // maxLanes 3: last lane is index 2 (x = 2*16+8 = 40), color 5.
    const { paths, dot } = hxGraphRowShapes(layout(4, 1), 3, false);
    expect(dot.cx).toBe(40);
    expect(dot.color).toBe(5);
    expect(paths.every((p) => p.color === 5)).toBe(true);
    expect(
      paths.every((p) => !/M(4[1-9]|[5-9]\d)/.test(p.d) && !/ 4[1-9]| [5-9]\d/.test(p.d)),
    ).toBe(true);
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
