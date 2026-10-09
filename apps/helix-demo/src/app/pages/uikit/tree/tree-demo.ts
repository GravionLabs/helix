import { ChangeDetectionStrategy, Component, inject, type OnInit, signal } from '@angular/core';
import { HxTree, type HxTreeNode, type HxTreeSelection } from '@gravionlabs/helix-ui';
import { NodeService } from '@/app/pages/service/node.service';
import { HxDataSection } from '../sections/data/data-section';

/** The tree of `@gravionlabs/helix-ui` (the tree table is not part of it: use the data grid for tabular data). */
@Component({
  selector: 'app-tree-demo',
  standalone: true,
  imports: [HxDataSection, HxTree],
  templateUrl: './tree-demo.html',
  styleUrl: './tree-demo.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [NodeService],
})
export class TreeDemo implements OnInit {
  readonly #nodes = inject(NodeService);

  readonly treeValue = signal<HxTreeNode[]>([]);
  readonly selected = signal<HxTreeSelection>([]);

  ngOnInit() {
    this.#nodes.getFiles().then((files) => this.treeValue.set(files as HxTreeNode[]));
  }
}
