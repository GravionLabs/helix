import { ChangeDetectionStrategy, Component, inject, type OnInit, signal } from '@angular/core';
import {
  HxTree,
  type HxTreeNode,
  type HxTreeNodeEvent,
  type HxTreeSelection,
} from '@gravionlabs/helix-ui';
import { NodeService } from '@/app/pages/service/node.service';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

/** The tree of `@gravionlabs/helix-ui` (the tree table is not part of it: use AG Grid). */
@Component({
  selector: 'app-tree-demo',
  standalone: true,
  imports: [SourceTabsComponent, HxTree],
  templateUrl: './tree-demo.html',
  styleUrl: './tree-demo.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [NodeService],
})
export class TreeDemo implements OnInit {
  readonly #nodes = inject(NodeService);

  readonly treeValue = signal<HxTreeNode[]>([]);
  readonly selected = signal<HxTreeSelection>([]);

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

  ngOnInit() {
    this.#nodes.getFiles().then((files) => this.treeValue.set(files as HxTreeNode[]));
  }
}
