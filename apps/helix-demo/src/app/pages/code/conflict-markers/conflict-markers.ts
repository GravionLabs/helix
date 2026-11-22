import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { keymap, EditorView } from '@codemirror/view';
import {
  HxCodeEditor,
  hxConflictCount,
  hxConflictMarkers,
  hxNextConflict,
  hxPreviousConflict,
} from '@gravionlabs/helix-code';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

const SAMPLE = `export function greet(name: string): string {
<<<<<<< HEAD
  return 'Hello, ' + name;
=======
  return \`Hi \${name}!\`;
>>>>>>> feature/short-greeting
}

export function total(items: number[]): number {
<<<<<<< HEAD
  return items.reduce((a, b) => a + b, 0);
||||||| merged common ancestors
  let sum = 0;
  for (const item of items) sum += item;
  return sum;
=======
  return items.reduce((sum, item) => sum + item, 0);
>>>>>>> feature/reduce
}
`;

/** `hxConflictMarkers()`: conflict blocks with accept actions; the app binds the commands. */
@Component({
  selector: 'app-conflict-markers-demo',
  imports: [HxCodeEditor, SourceTabsComponent],
  templateUrl: './conflict-markers.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConflictMarkersDemo {
  protected readonly text = signal(SAMPLE);
  protected readonly count = signal(0);

  protected readonly extensions = [
    hxConflictMarkers(),
    keymap.of([
      { key: 'Alt-ArrowDown', run: hxNextConflict },
      { key: 'Alt-ArrowUp', run: hxPreviousConflict },
    ]),
    EditorView.updateListener.of((u) => this.count.set(hxConflictCount(u.state))),
  ];

  protected reset(): void {
    this.text.set(SAMPLE);
  }
}
