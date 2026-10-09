import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  HxTree,
  type HxTreeNode,
  type HxTreeNodeEvent,
  type HxTreeSelection,
} from '@gravionlabs/helix-ui';

/** `@gravionlabs/helix-ui` data components: Tree. */
@Component({
  selector: 'app-hx-data-demo',
  standalone: true,
  imports: [HxTree],
  templateUrl: './hx-data-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hx-data-demo.scss',
})
export class HxDataDemo {
  readonly files = signal<HxTreeNode[]>([
    {
      key: 'docs',
      label: 'Documents',
      icon: 'pi pi-folder',
      expanded: true,
      children: [
        {
          key: 'work',
          label: 'Work',
          icon: 'pi pi-folder',
          children: [
            { key: 'report', label: 'Report.pdf', icon: 'pi pi-file-pdf' },
            { key: 'plan', label: 'Plan.docx', icon: 'pi pi-file' },
          ],
        },
        {
          key: 'home',
          label: 'Home',
          icon: 'pi pi-folder',
          children: [
            { key: 'tax', label: 'Taxes.xlsx', icon: 'pi pi-file-excel' },
            { key: 'pic', label: 'Picture.png', icon: 'pi pi-image' },
          ],
        },
      ],
    },
    {
      key: 'music',
      label: 'Music',
      icon: 'pi pi-folder',
      children: [{ key: 'song', label: 'Song.mp3', icon: 'pi pi-volume-up' }],
    },
    { key: 'locked', label: 'Locked.txt', icon: 'pi pi-lock', disabled: true },
  ]);
  readonly single = signal<HxTreeSelection>('report');
  readonly checked = signal<HxTreeSelection>([]);

  readonly lazy = signal<HxTreeNode[]>([
    { key: 'a', label: 'Server A (loads when opened)', leaf: false, icon: 'pi pi-server' },
    { key: 'b', label: 'Server B (loads when opened)', leaf: false, icon: 'pi pi-server' },
  ]);

  load(event: HxTreeNodeEvent): void {
    const key = event.node.key;
    if (event.node.children?.length) return;
    this.#patch(key, { loading: true });
    setTimeout(
      () =>
        this.#patch(key, {
          loading: false,
          children: [
            { key: `${key}-1`, label: 'Disk 1', icon: 'pi pi-database' },
            { key: `${key}-2`, label: 'Disk 2', icon: 'pi pi-database' },
          ],
        }),
      800,
    );
  }

  #patch(key: string, patch: Partial<HxTreeNode>): void {
    this.lazy.update((nodes) => nodes.map((n) => (n.key === key ? { ...n, ...patch } : n)));
  }
}
