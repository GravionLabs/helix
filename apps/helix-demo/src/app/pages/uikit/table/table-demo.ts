import { ChangeDetectionStrategy, Component, inject, type OnInit, signal } from '@angular/core';
import { helixGridTheme } from '@gravionlabs/helix-ag-grid';
import { HxButton, HxIconField, HxInput, HxMessageService, HxToast } from '@gravionlabs/helix-ui';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  type ColDef,
  type GridApi,
  type GridReadyEvent,
  ModuleRegistry,
  type ValueFormatterParams,
} from 'ag-grid-community';
import { type Customer, CustomerService } from '@/app/pages/service/customer.service';
import { HxGridSection } from '../sections/grid/grid-section';
import { ActionCell, ActivityCell, StatusCell, type TableContext } from './table-cells';

ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * An AG Grid showcase on helix-ui: the Helix grid theme, text, number and date filters, a quick filter, multi-row
 * selection, a row action, tags and progress bars in cells, paging and the loading overlay. Row grouping, master/detail
 * and Excel export are AG Grid Enterprise and are not shown.
 */
@Component({
  selector: 'app-table-demo',
  standalone: true,
  imports: [HxGridSection, AgGridAngular, HxButton, HxIconField, HxInput, HxToast],
  templateUrl: './table-demo.html',
  styleUrl: './table-demo.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [CustomerService],
})
export class TableDemo implements OnInit {
  readonly #customers = inject(CustomerService);
  readonly #messages = inject(HxMessageService);
  #api: GridApi<Customer> | undefined;

  protected readonly theme = helixGridTheme;
  readonly rows = signal<Customer[]>([]);
  readonly loading = signal(true);
  readonly quickFilter = signal('');
  readonly selectedCount = signal(0);

  protected readonly context: TableContext = {
    view: (customer) =>
      this.#messages.add({
        severity: 'info',
        summary: customer.name ?? '',
        detail: `${customer.company} · ${customer.country?.name}`,
        life: 3000,
      }),
  };

  protected readonly defaultColDef: ColDef<Customer> = {
    sortable: true,
    filter: true,
    resizable: true,
  };
  protected readonly columns: ColDef<Customer>[] = [
    {
      field: 'name',
      headerName: 'Name',
      pinned: 'left',
      minWidth: 170,
      filter: 'agTextColumnFilter',
    },
    { field: 'country.name', headerName: 'Country', minWidth: 150, filter: 'agTextColumnFilter' },
    { field: 'company', headerName: 'Company', minWidth: 200, filter: 'agTextColumnFilter' },
    {
      field: 'representative.name',
      headerName: 'Representative',
      minWidth: 170,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'date',
      headerName: 'Date',
      minWidth: 130,
      filter: 'agDateColumnFilter',
      valueFormatter: (p: ValueFormatterParams) =>
        p.value ? new Date(p.value).toLocaleDateString('en-US') : '',
      filterValueGetter: (p) => (p.data?.date ? new Date(p.data.date) : null),
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 140,
      filter: 'agTextColumnFilter',
      cellRenderer: StatusCell,
    },
    {
      field: 'activity',
      headerName: 'Activity',
      minWidth: 170,
      filter: 'agNumberColumnFilter',
      cellRenderer: ActivityCell,
    },
    {
      headerName: '',
      width: 110,
      sortable: false,
      filter: false,
      resizable: false,
      cellRenderer: ActionCell,
    },
  ];

  ngOnInit() {
    this.#customers.getCustomersMedium().then((customers) => {
      this.rows.set(customers);
      this.loading.set(false);
    });
  }

  onGridReady(event: GridReadyEvent<Customer>) {
    this.#api = event.api;
  }

  onSelectionChanged() {
    this.selectedCount.set(this.#api?.getSelectedRows().length ?? 0);
  }

  clearFilters() {
    this.#api?.setFilterModel(null);
    this.quickFilter.set('');
  }

  clearSelection() {
    this.#api?.deselectAll();
  }
}
