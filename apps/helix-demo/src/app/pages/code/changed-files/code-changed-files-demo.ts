import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  type HxChangedFile,
  HxChangedFileActions,
  HxChangedFiles,
} from '@gravionlabs/helix-code/git';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

const FILES: HxChangedFile[] = [
  { path: 'src/app/app.ts', status: 'modified', additions: 12, deletions: 3 },
  { path: 'src/app/greet.ts', status: 'added', additions: 20, deletions: 0 },
  { path: 'src/app/legacy.ts', status: 'deleted', additions: 0, deletions: 41 },
  {
    path: 'src/app/view.ts',
    oldPath: 'src/app/screen.ts',
    status: 'renamed',
    additions: 2,
    deletions: 2,
  },
  { path: 'src/assets/logo.png', status: 'modified', binary: true },
  { path: 'src/app/merge.ts', status: 'conflicted', additions: 5, deletions: 5 },
  { path: 'notes.md', status: 'untracked' },
];

/** `hx-changed-files`: status, counts, selection by mouse and keyboard, and a slot for row actions. */
@Component({
  selector: 'app-code-changed-files-demo',
  imports: [HxChangedFiles, HxChangedFileActions, SourceTabsComponent],
  templateUrl: './code-changed-files-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeChangedFilesDemo {
  protected readonly files = signal<HxChangedFile[]>(FILES);
  protected readonly selected = signal<string | null>('src/app/app.ts');
  protected readonly staged = signal<string[]>([]);
  protected readonly unstaged = computed(() =>
    this.files().filter((f) => !this.staged().includes(f.path)),
  );
  protected readonly stagedFiles = computed(() =>
    this.files().filter((f) => this.staged().includes(f.path)),
  );

  protected stage(path: string): void {
    this.staged.update((s) => [...s, path]);
  }

  protected unstage(path: string): void {
    this.staged.update((s) => s.filter((p) => p !== path));
  }
}
