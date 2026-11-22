import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  HxDiffView,
  type HxDiffChangeDecided,
  type HxDiffComment,
  type HxDiffCommentAdded,
  type HxDiffFinding,
  type HxDiffFindingAction,
  type HxDiffReplyAdded,
  type HxDiffResolvedChange,
  type HxDiffThread,
} from '@gravionlabs/helix-code';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

const BEFORE = `export function total(items: number[]): number {
  let sum = 0;
  for (const item of items) {
    sum += item;
  }
  return sum;
}
`;

const AFTER = `export function total(items: number[], tax = 0): number {
  let sum = 0;
  for (const item of items) {
    sum += item;
  }
  return sum * (1 + tax);
}
`;

/** `hx-diff-view` with line comments (click a line number, Shift-click for a range) and review findings. */
@Component({
  selector: 'app-review-demo',
  imports: [HxDiffView, SourceTabsComponent],
  templateUrl: './review-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewDemo {
  protected readonly original = BEFORE;
  protected readonly modified = AFTER;
  protected readonly commentable = signal(true);
  protected readonly comments = signal<readonly HxDiffComment[]>([
    {
      id: 'c1',
      side: 'modified',
      startLine: 6,
      endLine: 6,
      text: 'Should a negative tax be rejected?',
      author: 'Ada',
      time: '2026-11-20T09:30:00Z',
    },
  ]);

  protected readonly findings: readonly HxDiffFinding[] = [
    {
      id: 'f1',
      side: 'modified',
      startLine: 6,
      endLine: 6,
      severity: 'blocking',
      title: 'Negative tax gives a wrong total',
      detail: 'A tax below -1 makes the total negative; reject or clamp it.',
    },
    {
      id: 'f2',
      side: 'modified',
      startLine: 1,
      endLine: 1,
      severity: 'note',
      title: 'Document the new parameter',
      detail: 'Say that tax is a rate, 0.2 for 20 percent.',
    },
  ];
  protected readonly threads = signal<readonly HxDiffThread[]>([
    {
      id: 't1',
      side: 'modified',
      startLine: 5,
      endLine: 5,
      resolved: false,
      comments: [
        { id: 't1a', author: 'Ada', time: '2026-11-21T10:00:00Z', text: 'Why not `reduce`?' },
        {
          id: 't1b',
          author: 'Bob',
          time: '2026-11-21T11:30:00Z',
          text: 'The loop is easier to debug.',
        },
      ],
    },
    {
      id: 't2',
      side: 'modified',
      startLine: 2,
      endLine: 2,
      resolved: true,
      comments: [
        { id: 't2a', author: 'Ada', time: '2026-11-19T08:00:00Z', text: 'Start at zero.' },
      ],
    },
  ]);
  protected readonly decisions = signal<readonly HxDiffChangeDecided[]>([]);
  protected readonly sent = signal<HxDiffFindingAction | null>(null);

  protected decide(decided: HxDiffChangeDecided): void {
    this.decisions.update((list) => [...list, decided]);
  }

  protected reply(added: HxDiffReplyAdded): void {
    this.threads.update((list) =>
      list.map((t) =>
        t.id === added.threadId
          ? {
              ...t,
              comments: [
                ...t.comments,
                {
                  id: `${t.id}-${t.comments.length + 1}`,
                  author: 'You',
                  time: new Date().toISOString(),
                  text: added.text,
                },
              ],
            }
          : t,
      ),
    );
  }

  protected resolve(change: HxDiffResolvedChange): void {
    this.threads.update((list) =>
      list.map((t) => (t.id === change.threadId ? { ...t, resolved: change.resolved } : t)),
    );
  }

  protected add(added: HxDiffCommentAdded): void {
    this.comments.update((list) => [
      ...list,
      {
        id: `c${list.length + 1}`,
        side: added.side,
        startLine: added.startLine,
        endLine: added.endLine,
        text: added.text,
        author: 'You',
        time: new Date().toISOString(),
      },
    ]);
  }
}
