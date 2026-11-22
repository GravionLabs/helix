import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';
import { type HxCommit, HxCommitGraph, HxCommitGraphRowCell } from '@gravionlabs/helix-code/git';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

const NOW = Math.floor(Date.now() / 1000);
const H = 3600;

const COMMITS: HxCommit[] = [
  {
    id: 'a1f3c9d',
    parents: ['b72e4a1', 'c90d5e2'],
    message: 'Merge branch feature/graph',
    author: 'Ada',
    time: NOW - 0.5 * H,
    refs: [
      { name: 'HEAD', kind: 'head' },
      { name: 'main', kind: 'branch' },
      { name: 'origin/main', kind: 'remote' },
    ],
  },
  {
    id: 'c90d5e2',
    parents: ['d41b7f0'],
    message: 'feat: draw the graph as SVG',
    author: 'Bob',
    time: NOW - 5 * H,
    refs: [{ name: 'feature/graph', kind: 'branch' }],
  },
  {
    id: 'b72e4a1',
    parents: ['d41b7f0'],
    message: 'fix: trim the ref names',
    author: 'Ada',
    time: NOW - 20 * H,
  },
  {
    id: 'd41b7f0',
    parents: ['e5502ab'],
    message: 'chore: release 1.2.0',
    author: 'Cy',
    time: NOW - 3 * 86400,
    refs: [{ name: 'v1.2.0', kind: 'tag' }],
  },
  { id: 'e5502ab', parents: [], message: 'Initial commit', author: 'Ada', time: NOW - 90 * 86400 },
];

const PAGE_SIZE = 500;
const TOTAL = 10_000;

/** Generates commits `from` to `to` of a history with a side branch merged every 25 commits. */
function generate(from: number, to: number): HxCommit[] {
  const out: HxCommit[] = [];
  for (let i = from; i < Math.min(to, TOTAL); i++) {
    const parents = i + 1 < TOTAL ? [`g${i + 1}`] : [];
    // A merge picks the commit 3 further down as second parent: it opens a short-lived lane.
    if (i % 25 === 0 && i + 4 < TOTAL) parents.push(`g${i + 4}`);
    out.push({
      id: `g${i}`,
      parents,
      message: parents.length > 1 ? `Merge branch topic-${i}` : `Commit ${i}`,
      author: ['Ada', 'Bob', 'Cy'][i % 3],
      time: NOW - i * 1800,
      refs: i === 0 ? [{ name: 'main', kind: 'branch' }] : undefined,
    });
  }
  return out;
}

/**
 * `hx-commit-graph`: lanes, refs, selection by mouse and keyboard, a slot per row, and a long
 * history with virtual scrolling and paging.
 */
@Component({
  selector: 'app-code-commit-graph-demo',
  imports: [HxCommitGraph, HxCommitGraphRowCell, SourceTabsComponent],
  templateUrl: './code-commit-graph-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeCommitGraphDemo {
  protected readonly commits = COMMITS;
  protected readonly selected = signal<string | null>('a1f3c9d');
  protected readonly copied = signal<string | null>(null);

  protected readonly graph = viewChild<HxCommitGraph>('big');
  protected readonly bigCommits = signal<readonly HxCommit[]>(generate(0, PAGE_SIZE));
  protected readonly bigSelected = signal<string | null>(null);
  protected readonly loading = signal(false);
  protected readonly hasMore = computed(() => this.bigCommits().length < TOTAL);
  protected readonly revealMissing = signal(false);

  /** Loads the next page after a short delay, like a request would. */
  protected loadMore(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.bigCommits.update((c) => [...c, ...generate(c.length, c.length + PAGE_SIZE)]);
      this.loading.set(false);
    }, 300);
  }

  /** Scrolls to a commit; a commit that is not loaded yet is reported. */
  protected reveal(index: number): void {
    this.revealMissing.set(!this.graph()?.reveal(`g${index}`));
  }
}
