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

/** The state of a file in a change set. */
export type HxChangeStatus =
  | 'added'
  | 'modified'
  | 'deleted'
  | 'renamed'
  | 'untracked'
  | 'conflicted';

/** One file of a change set. */
export interface HxChangedFile {
  readonly path: string;
  /** The previous path of a renamed file. */
  readonly oldPath?: string;
  readonly status: HxChangeStatus;
  readonly additions?: number;
  readonly deletions?: number;
  /** A binary file has no line counts. */
  readonly binary?: boolean;
}

const STATUS: Record<HxChangeStatus, { letter: string; label: string }> = {
  added: { letter: 'A', label: 'Added' },
  modified: { letter: 'M', label: 'Modified' },
  deleted: { letter: 'D', label: 'Deleted' },
  renamed: { letter: 'R', label: 'Renamed' },
  untracked: { letter: 'U', label: 'Untracked' },
  conflicted: { letter: 'C', label: 'Conflicted' },
};

/**
 * Marks the `<ng-template>` that adds actions to each row of `hx-changed-files`. The context
 * `$implicit` is the `HxChangedFile` of the row.
 *
 * ```html
 * <hx-changed-files [files]="files">
 *   <ng-template hxChangedFileActions let-file><button>Stage {{ file.path }}</button></ng-template>
 * </hx-changed-files>
 * ```
 */
@Directive({ selector: 'ng-template[hxChangedFileActions]' })
export class HxChangedFileActions {
  readonly template = inject<TemplateRef<{ $implicit: HxChangedFile }>>(TemplateRef);
}

interface Row {
  readonly id: string;
  readonly file: HxChangedFile;
  readonly name: string;
  readonly folder: string;
  readonly letter: string;
  readonly label: string;
  readonly counts: boolean;
}

let nextId = 0;

/**
 * Lists the files of a change set with status, line counts and a header with the totals. One file
 * is selected; arrow keys move, Enter or Space selects.
 *
 * ```html
 * <hx-changed-files aria-label="Changes" [files]="files" [selected]="path" (selectedChange)="path = $event" />
 * ```
 */
@Component({
  selector: 'hx-changed-files',
  imports: [NgTemplateOutlet],
  templateUrl: './changed-files.html',
  styleUrl: './changed-files.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-changed-files',
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
  },
})
export class HxChangedFiles {
  readonly #uid = `hx-changed-files-${nextId++}`;

  /** The files of the change set. */
  readonly files = input.required<readonly HxChangedFile[]>();
  /** The path of the selected file. */
  readonly selected = input<string | null>(null);
  /** The accessible name of the list. */
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });
  /** Emits the path of the file the user selects. */
  readonly selectedChange = output<string>();

  protected readonly actions = contentChild(HxChangedFileActions);
  protected readonly active = signal(-1);

  protected readonly rows = computed<readonly Row[]>(() =>
    this.files().map((file, i) => {
      const slash = file.path.lastIndexOf('/');
      const { letter, label } = STATUS[file.status];
      return {
        id: `${this.#uid}-${i}`,
        file,
        name: file.path.slice(slash + 1),
        folder: slash < 0 ? '' : file.path.slice(0, slash),
        letter,
        label,
        counts: !file.binary && (file.additions !== undefined || file.deletions !== undefined),
      };
    }),
  );

  /** The index that holds the keyboard focus mark: the one moved to, else the selected one, else 0. */
  protected readonly activeIndex = computed(() => {
    const n = this.rows().length;
    if (n === 0) return -1;
    const a = this.active();
    if (a >= 0) return Math.min(a, n - 1);
    const s = this.rows().findIndex((r) => r.file.path === this.selected());
    return s >= 0 ? s : 0;
  });

  protected readonly activeId = computed(() => this.rows()[this.activeIndex()]?.id ?? null);

  protected readonly totals = computed(() => {
    let additions = 0;
    let deletions = 0;
    for (const f of this.files()) {
      additions += f.additions ?? 0;
      deletions += f.deletions ?? 0;
    }
    return { count: this.files().length, additions, deletions };
  });

  protected select(index: number): void {
    const row = this.rows()[index];
    if (!row) return;
    this.active.set(index);
    this.selectedChange.emit(row.file.path);
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
    this.active.set(next);
    document.getElementById(this.rows()[next].id)?.scrollIntoView?.({ block: 'nearest' });
  }
}
