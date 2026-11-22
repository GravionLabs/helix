import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HxConflictMerge } from '@gravionlabs/helix-code';
import { HxDialog } from '@gravionlabs/helix-ui';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

const MINE = `# Shopping list
milk
eggs
bread
apples
`;

const THEIRS = `# Shopping list
oat milk
eggs
bread
pears
coffee
`;

/** `hx-conflict-merge`: the app places the component, here inside `hx-dialog`. */
@Component({
  selector: 'app-conflict-merge-demo',
  imports: [HxConflictMerge, HxDialog, SourceTabsComponent],
  templateUrl: './conflict-merge-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConflictMergeDemo {
  protected readonly mine = MINE;
  protected readonly theirs = THEIRS;
  protected readonly visible = signal(false);
  protected readonly merged = signal<string | null>(null);

  protected take(text: string): void {
    this.merged.set(text);
    this.visible.set(false);
  }
}
