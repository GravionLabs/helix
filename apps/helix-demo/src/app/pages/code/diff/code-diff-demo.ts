import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { HxDiffView, type HxDiffLayout } from '@gravionlabs/helix-code';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

const BEFORE = `import { Component } from '@angular/core';

export function greet(name: string): string {
  return 'Hello ' + name;
}

export const a = 1;
export const b = 2;
export const c = 3;
export const d = 4;
export const e = 5;
export const f = 6;
export const g = 7;
`;

const AFTER = `import { Component } from '@angular/core';

export function greet(name: string, greeting = 'Hello'): string {
  return greeting + ' ' + name;
}

export const a = 1;
export const b = 2;
export const c = 3;
export const d = 4;
export const e = 5;
export const f = 6;
export const g = 8;
`;

/** `hx-diff-view`: split and unified layout, collapsed unchanged lines, new and deleted files. */
@Component({
  selector: 'app-code-diff-demo',
  imports: [HxDiffView, SourceTabsComponent],
  templateUrl: './code-diff-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeDiffDemo {
  protected readonly diff = viewChild.required(HxDiffView);
  protected readonly layout = signal<HxDiffLayout>('split');
  protected readonly width = signal(600);
  protected readonly collapse = signal(true);
  protected readonly original = signal(BEFORE);
  protected readonly modified = signal(AFTER);

  protected readonly modes = [
    { label: 'Changed file', before: BEFORE, after: AFTER },
    { label: 'New file', before: '', after: AFTER },
    { label: 'Deleted file', before: BEFORE, after: '' },
  ];

  protected resize(event: Event): void {
    this.width.set(Number((event.target as HTMLInputElement).value));
  }

  protected show(before: string, after: string): void {
    this.original.set(before);
    this.modified.set(after);
  }
}
