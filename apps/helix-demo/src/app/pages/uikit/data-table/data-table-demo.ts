import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  HxButton,
  HxCell,
  type HxColumn,
  HxColumnHeader,
  HxDataTable,
  HxInput,
  HxRowExpansion,
} from '@gravionlabs/helix-ui';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

/** The data table of `@gravionlabs/helix-ui`: column model, templates, sorting, paging, selection, filters. */
@Component({
  selector: 'app-data-table-demo',
  standalone: true,
  imports: [
    SourceTabsComponent,
    HxButton,
    HxCell,
    HxColumnHeader,
    HxDataTable,
    HxInput,
    HxRowExpansion,
    JsonPipe,
  ],
  templateUrl: './data-table-demo.html',
  styleUrl: './data-table-demo.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DataTableDemo {
  readonly columns: HxColumn[] = [
    { field: 'code', header: 'Code', width: '8rem' },
    { field: 'name', header: 'Name', sortable: true },
    { field: 'category', header: 'Category', title: 'The product group', sortable: true },
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
  /** Dims the cheap products (the `rowClass` demo). */
  readonly dimCheap = (row: { price: number }) => (row.price < 30 ? 'data-table-dim' : null);
  readonly selected = signal<unknown[]>([]);
  readonly filters = signal<Record<string, string>>({});
  readonly filterColumns: HxColumn[] = [
    { field: 'name', header: 'Name', filter: true, sortable: true },
    { field: 'category', header: 'Category', filter: true },
    { field: 'price', header: 'Price', align: 'right', sortable: true },
  ];
  readonly menuFilters = signal<Record<string, string>>({});
  readonly menuColumns: HxColumn[] = [
    { field: 'name', header: 'Name', filter: true, sortable: true },
    { field: 'category', header: 'Category', filter: true },
    { field: 'price', header: 'Price', align: 'right', filter: true, sortable: true },
  ];
  readonly tableLoading = signal(false);
  readonly tableRows = signal(this.products);
  toggleLoading(): void {
    this.tableLoading.update((v) => !v);
  }
  toggleEmpty(): void {
    this.tableRows.update((rows) => (rows.length ? [] : this.products));
  }
}
