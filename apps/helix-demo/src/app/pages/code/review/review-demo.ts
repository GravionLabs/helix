import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HxDiffView, type HxDiffComment, type HxDiffCommentAdded } from '@gravionlabs/helix-code';
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

/** `hx-diff-view` with line comments: click a line number, Shift-click for a range. */
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
