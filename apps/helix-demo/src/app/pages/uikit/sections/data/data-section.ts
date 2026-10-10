import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  HxButton,
  HxCell,
  HxChart,
  type HxChartSelectEvent,
  type HxColumn,
  HxDataTable,
  HxTable,
  HxTree,
  type HxTreeNode,
  type HxTreeNodeEvent,
  type HxTreeSelection,
} from '@gravionlabs/helix-ui';

/** `@gravionlabs/helix-ui` data components: Tree, Chart, Table, Data table. */
@Component({
  selector: 'app-data-section',
  standalone: true,
  imports: [HxButton, HxCell, HxChart, HxDataTable, HxTable, HxTree],
  templateUrl: './data-section.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './data-section.scss',
})
export class HxDataSection {
  readonly columns: HxColumn[] = [
    { field: 'code', header: 'Code', width: '8rem' },
    { field: 'name', header: 'Name', sortable: true },
    { field: 'category', header: 'Category', sortable: true },
    { field: 'price', header: 'Price', align: 'right', sortable: true },
  ];
  readonly products = [
    { id: 1, code: 'f230fh0g3', name: 'Bamboo Watch', category: 'Accessories', price: 65 },
    { id: 2, code: 'nvklal433', name: 'Black Watch', category: 'Accessories', price: 72 },
    { id: 3, code: 'zz21cz3c1', name: 'Blue Band', category: 'Fitness', price: 79 },
    { id: 4, code: '244wgerg2', name: 'Blue T-Shirt', category: 'Clothing', price: 29 },
  ];
  readonly manyProducts = Array.from({ length: 47 }, (_, i) => ({
    id: i + 1,
    code: `p${String(i + 1).padStart(4, '0')}`,
    name: `Product ${i + 1}`,
    category: ['Accessories', 'Fitness', 'Clothing'][i % 3],
    price: 10 + ((i * 17) % 90),
  }));
  readonly tableLoading = signal(false);
  readonly tableRows = signal(this.products);
  toggleLoading(): void {
    this.tableLoading.update((v) => !v);
  }
  toggleEmpty(): void {
    this.tableRows.update((rows) => (rows.length ? [] : this.products));
  }

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

  readonly invoices = [
    { no: 1001, customer: 'Amy Elsner', amount: 120, status: 'Paid' },
    { no: 1002, customer: 'Anna Fali', amount: 80.5, status: 'Open' },
    { no: 1003, customer: 'Asiya Javayant', amount: 245, status: 'Paid' },
    { no: 1004, customer: 'Bernardo Dominic', amount: 39.9, status: 'Late' },
    { no: 1005, customer: 'Elwin Sharvill', amount: 310, status: 'Open' },
    { no: 1006, customer: 'Ioni Bowcher', amount: 72, status: 'Paid' },
    { no: 1007, customer: 'Ivan Magalhaes', amount: 15, status: 'Paid' },
    { no: 1008, customer: 'Onyama Limba', amount: 560, status: 'Late' },
  ];
  readonly total = this.invoices.reduce((sum, i) => sum + i.amount, 0);
  readonly months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  readonly sales = [65, 59, 80, 81, 56, 55];
  readonly costs = [28, 48, 40, 19, 86, 27];
  readonly barData = {
    labels: this.months,
    datasets: [
      { label: 'Sales', data: this.sales },
      { label: 'Costs', data: this.costs },
    ],
  };
  readonly lineData = {
    labels: this.months,
    datasets: [{ label: 'Sales', data: this.sales, fill: true, tension: 0.4 }],
  };
  readonly doughnutData = {
    labels: ['Direct', 'Referral', 'Social'],
    datasets: [{ data: [540, 325, 702] }],
  };
  readonly picked = signal('none');
  pick(event: HxChartSelectEvent) {
    const { datasetIndex, index } = event.element as { datasetIndex: number; index: number };
    this.picked.set(`${this.barData.datasets[datasetIndex].label}, ${this.months[index]}`);
  }

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
