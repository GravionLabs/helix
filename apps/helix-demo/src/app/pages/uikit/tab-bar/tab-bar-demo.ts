import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HxTabBar, type HxTabBarItem, type HxTabBarMenuItem } from '@gravionlabs/helix-ui';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

type BarId = 'left' | 'right';

/** Many editor tabs in one bar and two bars between which tabs are dragged. */
@Component({
  selector: 'app-tab-bar-demo',
  standalone: true,
  imports: [SourceTabsComponent, HxTabBar],
  templateUrl: './tab-bar-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class TabBarDemo {
  readonly files = signal<HxTabBarItem[]>(
    Array.from({ length: 24 }, (_, i) => ({
      id: `file-${i}`,
      label: `component-${i + 1}.ts`,
      group: i % 6 === 0 ? 'src' : undefined,
      preview: i === 3,
      attention: i === 17,
      unread: i === 20,
    })),
  );
  readonly pinnedFiles = signal<HxTabBarItem[]>([
    { id: 'readme', label: 'README.md' },
    { id: 'notes', label: 'notes.md' },
  ]);
  readonly activeFile = signal<string | null>('file-0');
  readonly activePinned = signal<string | null>('readme');
  readonly last = signal('Nothing yet');

  readonly menu: HxTabBarMenuItem[] = [
    { action: 'close', label: 'Close', shortcut: 'Ctrl+W' },
    { action: 'close-others', label: 'Close others' },
    { action: 'move', label: 'Move to the other bar' },
    { action: 'attention', label: 'Clear attention', appliesTo: (id) => id === 'file-17' },
  ];

  private bar(id: BarId) {
    return id === 'left' ? this.files : this.pinnedFiles;
  }

  private active(id: BarId) {
    return id === 'left' ? this.activeFile : this.activePinned;
  }

  close(bar: BarId, id: string): void {
    const tabs = this.bar(bar)();
    const at = tabs.findIndex((t) => t.id === id);
    this.bar(bar).set(tabs.filter((t) => t.id !== id));
    if (this.active(bar)() === id)
      this.active(bar).set(tabs[at + 1]?.id ?? tabs[at - 1]?.id ?? null);
    this.last.set(`Closed ${id}`);
  }

  pin(id: string): void {
    this.files.update((tabs) => tabs.map((t) => (t.id === id ? { ...t, preview: false } : t)));
    this.last.set(`Pinned ${id}`);
  }

  move(bar: BarId, { from, to }: { from: number; to: number }): void {
    this.bar(bar).update((tabs) => {
      const next = [...tabs];
      next.splice(to, 0, ...next.splice(from, 1));
      return next;
    });
    this.last.set(`Moved tab ${from + 1} to ${to + 1}`);
  }

  /** A tab dragged from the other bar was dropped on `target` at `index`. */
  receive(target: BarId, event: { from: string; id: string; index: number }): void {
    const source: BarId = target === 'left' ? 'right' : 'left';
    this.transfer(source, target, event.id, event.index);
  }

  private transfer(
    source: BarId,
    target: BarId,
    id: string,
    index = this.bar(target)().length,
  ): void {
    const tab = this.bar(source)().find((t) => t.id === id);
    if (!tab) return;
    this.close(source, id);
    this.bar(target).update((tabs) => [...tabs.slice(0, index), tab, ...tabs.slice(index)]);
    this.active(target).set(id);
    this.last.set(`Moved ${id} to the ${target} bar`);
  }

  run(bar: BarId, { id, action }: { id: string; action: string }): void {
    if (action === 'close') this.close(bar, id);
    else if (action === 'move') this.transfer(bar, bar === 'left' ? 'right' : 'left', id);
    else if (action === 'close-others') {
      this.bar(bar).update((tabs) => tabs.filter((t) => t.id === id));
      this.active(bar).set(id);
      this.last.set(`Closed the others next to ${id}`);
    } else if (action === 'attention') {
      this.files.update((tabs) => tabs.map((t) => (t.id === id ? { ...t, attention: false } : t)));
      this.last.set(`Cleared the attention of ${id}`);
    }
  }
}
