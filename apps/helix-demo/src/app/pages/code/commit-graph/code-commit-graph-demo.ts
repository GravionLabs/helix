import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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

/** `hx-commit-graph`: lanes, refs, selection by mouse and keyboard, and a slot per row. */
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
}
