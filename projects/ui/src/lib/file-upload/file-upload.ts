import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  type ElementRef,
  input,
  numberAttribute,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { HxButton } from '../button/button';
import { nextId } from '../internal/ids';

export type HxFileUploadMode = 'basic' | 'advanced';

/** `1536` → `1.5 KB`. */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${Number.isInteger(value) ? value : value.toFixed(1)} ${units[unit]}`;
}

/** Whether a file matches an `accept` list: `.png`, `image/*`, `application/pdf`, separated by commas. */
export function matchesAccept(file: File, accept: string): boolean {
  const rules = accept
    .split(',')
    .map((r) => r.trim().toLowerCase())
    .filter(Boolean);
  if (rules.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return rules.some((rule) =>
    rule.startsWith('.')
      ? name.endsWith(rule)
      : rule.endsWith('/*')
        ? type.startsWith(rule.slice(0, -1))
        : type === rule,
  );
}

/**
 * Choosing files, with a drop zone and a list. There is no HTTP in it: the component collects the files and
 * emits them, the app uploads.
 *
 * ```html
 * <hx-file-upload accept="image/*,.pdf" multiple [maxFileSize]="1_000_000" [progress]="percent()"
 *                 (select)="onSelect($event)" (upload)="upload($event)" />
 * <hx-file-upload mode="basic" accept=".csv" chooseLabel="Import" (select)="import($event)" />
 * ```
 *
 * The choose control is a native `<input type="file">` inside a button-like label, so it works by keyboard; the
 * drop zone is an extra way to add files. Files that are too large, of the wrong type or beyond `fileLimit` are not
 * added; the reason is shown in a live region.
 */
@Component({
  selector: 'hx-file-upload',
  imports: [HxButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-file-upload',
    '[class.hx-file-upload-basic]': "mode() === 'basic'",
    '[class.hx-file-upload-disabled]': 'disabled()',
    '[class.hx-file-upload-highlight]': 'dragging()',
  },
  template: `
    @if (mode() === 'basic') {
      <label class="hx-button hx-file-upload-choose" [class.hx-button-disabled]="disabled()" [attr.aria-disabled]="disabled() ? 'true' : null">
        <input #picker type="file" class="hx-file-upload-input" [accept]="accept()" [multiple]="multiple()" [disabled]="disabled()" (change)="onPick($event)" />
        {{ chooseLabel() }}
      </label>
      @if (files().length) {
        <span class="hx-file-upload-names">{{ names() }}</span>
      }
    } @else {
      <div class="hx-file-upload-header">
        <label class="hx-button hx-file-upload-choose" [attr.aria-disabled]="disabled() ? 'true' : null">
          <input #picker type="file" class="hx-file-upload-input" [accept]="accept()" [multiple]="multiple()" [disabled]="disabled()" (change)="onPick($event)" />
          {{ chooseLabel() }}
        </label>
        @if (showUploadButton()) {
          <button hx-button type="button" severity="secondary" [disabled]="disabled() || !files().length" (click)="doUpload()">{{ uploadLabel() }}</button>
        }
        @if (showCancelButton()) {
          <button hx-button type="button" severity="secondary" [disabled]="disabled() || !files().length" (click)="cancel()">{{ cancelLabel() }}</button>
        }
      </div>
      <div
        class="hx-file-upload-content"
        (dragenter)="onDrag($event, true)"
        (dragover)="onDrag($event, true)"
        (dragleave)="onDrag($event, false)"
        (drop)="onDrop($event)"
      >
        @if (progress() !== null && progress() !== undefined) {
          <div
            class="hx-file-upload-progress"
            role="progressbar"
            aria-label="Upload progress"
            aria-valuemin="0"
            aria-valuemax="100"
            [attr.aria-valuenow]="progress()"
          >
            <div class="hx-file-upload-progress-bar" [style.width.%]="progress()"></div>
          </div>
        }
        <div class="hx-file-upload-messages" [id]="messagesId" role="status" aria-live="polite">
          @for (message of messages(); track $index) {
            <p class="hx-file-upload-message">{{ message }}</p>
          }
        </div>
        @if (files().length) {
          <ul class="hx-file-upload-list">
            @for (file of files(); track file) {
              <li class="hx-file-upload-file">
                <span class="hx-file-upload-file-info">
                  <span class="hx-file-upload-file-name">{{ file.name }}</span>
                  <span class="hx-file-upload-file-size">{{ size(file) }}</span>
                </span>
                <button hx-button type="button" variant="outlined" severity="danger" size="small" [attr.aria-label]="'Remove ' + file.name" [disabled]="disabled()" (click)="removeFile(file)">{{ removeLabel() }}</button>
              </li>
            }
          </ul>
        } @else {
          <p class="hx-file-upload-empty">{{ dropLabel() }}</p>
        }
      </div>
    }
    @if (mode() === 'basic') {
      <div class="hx-file-upload-messages" [id]="messagesId" role="status" aria-live="polite">
        @for (message of messages(); track $index) {
          <p class="hx-file-upload-message">{{ message }}</p>
        }
      </div>
    }
  `,
})
export class HxFileUpload {
  readonly mode = input<HxFileUploadMode>('advanced');
  /** Allowed types: `.png`, `image/*`, `application/pdf`, separated by commas. */
  readonly accept = input('');
  readonly multiple = input(false, { transform: booleanAttribute });
  /** The largest file in bytes. */
  readonly maxFileSize = input(undefined, {
    transform: (v: unknown) => (v == null || v === '' ? undefined : numberAttribute(v)),
  });
  /** The most files in the list. */
  readonly fileLimit = input(undefined, {
    transform: (v: unknown) => (v == null || v === '' ? undefined : numberAttribute(v)),
  });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly chooseLabel = input('Choose');
  readonly uploadLabel = input('Upload');
  readonly cancelLabel = input('Cancel');
  readonly removeLabel = input('Remove');
  readonly dropLabel = input('Drag and drop files here');
  readonly showUploadButton = input(true, { transform: booleanAttribute });
  readonly showCancelButton = input(true, { transform: booleanAttribute });
  /** Upload progress, 0 to 100; the bar shows while it is set. */
  readonly progress = input<number | null>(null);
  readonly invalidFileSizeMessage = input(
    '{0}: Invalid file size, file size should be smaller than {1}.',
  );
  readonly invalidFileTypeMessage = input('{0}: Invalid file type, allowed file types: {1}.');
  readonly invalidFileLimitMessage = input(
    'Maximum number of files exceeded, limit is {0} at most.',
  );

  /** The files that were added by one choice or drop. */
  readonly select = output<File[]>();
  /** The file the user removed from the list. */
  readonly remove = output<File>();
  /** The user emptied the list with Cancel. */
  readonly clear = output<void>();
  /** The files in the list, when the user presses Upload. */
  readonly upload = output<File[]>();

  protected readonly messagesId = nextId('hx-file-upload-messages');
  readonly files = signal<File[]>([]);
  protected readonly messages = signal<string[]>([]);
  protected readonly dragging = signal(false);
  protected readonly names = computed(() =>
    this.files()
      .map((f) => f.name)
      .join(', '),
  );
  private readonly picker = viewChild<ElementRef<HTMLInputElement>>('picker');

  protected size(file: File): string {
    return formatFileSize(file.size);
  }

  protected onPick(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.add([...(input.files ?? [])]);
    input.value = ''; // the same file can be chosen again
  }

  protected onDrag(event: DragEvent, over: boolean): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.dragging.set(over);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    if (this.disabled()) return;
    this.add([...(event.dataTransfer?.files ?? [])]);
  }

  /** Adds files after checking type, size and limit; the first problem of each file is reported. */
  add(candidates: File[]): void {
    const messages: string[] = [];
    const accepted: File[] = [];
    const kept = this.multiple() ? this.files() : [];
    const limit = this.fileLimit();
    const fill = (template: string, ...values: (string | number)[]) =>
      values.reduce<string>((text, v, i) => text.replace(`{${i}}`, String(v)), template);
    for (const file of this.multiple() ? candidates : candidates.slice(0, 1)) {
      if (this.accept() && !matchesAccept(file, this.accept())) {
        messages.push(fill(this.invalidFileTypeMessage(), file.name, this.accept()));
      } else if (this.maxFileSize() !== undefined && file.size > (this.maxFileSize() as number)) {
        messages.push(
          fill(
            this.invalidFileSizeMessage(),
            file.name,
            formatFileSize(this.maxFileSize() as number),
          ),
        );
      } else if (limit !== undefined && kept.length + accepted.length >= limit) {
        messages.push(fill(this.invalidFileLimitMessage(), limit));
        break;
      } else {
        accepted.push(file);
      }
    }
    this.messages.set(messages);
    if (accepted.length === 0) return;
    this.files.set([...kept, ...accepted]);
    this.select.emit(accepted);
  }

  protected removeFile(file: File): void {
    this.files.set(this.files().filter((f) => f !== file));
    this.messages.set([]);
    this.remove.emit(file);
  }

  protected cancel(): void {
    this.reset();
    this.clear.emit();
  }

  protected doUpload(): void {
    this.upload.emit(this.files());
  }

  /** Empties the list and the messages (the app calls it after an upload). */
  reset(): void {
    this.files.set([]);
    this.messages.set([]);
  }
}
