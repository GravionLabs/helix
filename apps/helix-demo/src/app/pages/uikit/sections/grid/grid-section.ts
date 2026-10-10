import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { currencyFormatter, helixGridTheme, numberCellStyle } from '@gravionlabs/helix-ag-grid';
import { HxButton, HxInput, HxTag, type HxTagSeverity } from '@gravionlabs/helix-ui';
import { AgGridAngular, type ICellRendererAngularComp } from 'ag-grid-angular';
import {
  AllCommunityModule,
  type ColDef,
  type ICellRendererParams,
  ModuleRegistry,
} from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

interface Invoice {
  no: number;
  customer: string;
  status: 'Paid' | 'Open' | 'Late';
  amount: number;
}

const SEVERITY: Record<Invoice['status'], HxTagSeverity> = {
  Paid: 'success',
  Open: 'info',
  Late: 'danger',
};

/** A cell renderer built from `hx-tag`. */
@Component({
  selector: 'app-status-cell',
  standalone: true,
  imports: [HxTag],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<hx-tag [value]="status()" [severity]="severity()" rounded />`,
})
export class StatusCell implements ICellRendererAngularComp {
  protected readonly status = signal('');
  protected readonly severity = signal<HxTagSeverity>('primary');

  agInit(params: ICellRendererParams<Invoice, Invoice['status']>): void {
    this.refresh(params);
  }

  refresh(params: ICellRendererParams<Invoice, Invoice['status']>): boolean {
    this.status.set(params.value ?? '');
    this.severity.set(params.value ? SEVERITY[params.value] : 'primary');
    return true;
  }
}

/** A cell renderer built from `button[hx-button]`: the row actions. */
@Component({
  selector: 'app-actions-cell',
  standalone: true,
  imports: [HxButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button hx-button type="button" variant="text" size="small" (click)="act('edit')">Edit</button>
    <button hx-button type="button" variant="text" severity="danger" size="small" (click)="act('delete')">Delete</button>
  `,
})
export class ActionsCell implements ICellRendererAngularComp {
  #params: ICellRendererParams<Invoice> | undefined;

  agInit(params: ICellRendererParams<Invoice>): void {
    this.#params = params;
  }

  refresh(params: ICellRendererParams<Invoice>): boolean {
    this.#params = params;
    return true;
  }

  act(action: 'edit' | 'delete'): void {
    const onAction = (
      this.#params?.context as { onAction?: (a: string, row: Invoice) => void } | undefined
    )?.onAction;
    if (this.#params?.data) onAction?.(action, this.#params.data);
  }
}

/** `@gravionlabs/helix-ag-grid` and AG Grid Community: the Helix theme and the usual patterns. */
@Component({
  selector: 'app-grid-section',
  standalone: true,
  imports: [AgGridAngular, HxButton, HxInput],
  templateUrl: './grid-section.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './grid-section.scss',
})
export class HxGridSection {
  protected readonly theme = helixGridTheme;
  protected readonly context = {
    onAction: (action: string, row: Invoice) =>
      this.last.set(`${action} ${row.customer} (#${row.no})`),
  };
  protected readonly last = signal('none');
  protected readonly quick = signal('');
  protected readonly loading = signal(false);
  protected readonly empty = signal(false);

  private readonly all: Invoice[] = [
    { no: 1001, customer: 'Amy Elsner', status: 'Paid', amount: 120 },
    { no: 1002, customer: 'Anna Fali', status: 'Open', amount: 80.5 },
    { no: 1003, customer: 'Asiya Javayant', status: 'Paid', amount: 245 },
    { no: 1004, customer: 'Bernardo Dominic', status: 'Late', amount: 39.9 },
    { no: 1005, customer: 'Elwin Sharvill', status: 'Open', amount: 310 },
    { no: 1006, customer: 'Ioni Bowcher', status: 'Paid', amount: 72 },
    { no: 1007, customer: 'Ivan Magalhaes', status: 'Paid', amount: 15 },
    { no: 1008, customer: 'Onyama Limba', status: 'Late', amount: 560 },
    { no: 1009, customer: 'Stephen Shaw', status: 'Open', amount: 98 },
    { no: 1010, customer: 'Xuxue Feng', status: 'Paid', amount: 1200 },
  ];
  protected readonly rows = signal<Invoice[]>(this.all);

  protected readonly columns: ColDef<Invoice>[] = [
    { field: 'no', headerName: 'No.', width: 110 },
    {
      field: 'customer',
      headerName: 'Customer',
      flex: 1,
      minWidth: 160,
      filter: 'agTextColumnFilter',
    },
    { field: 'status', headerName: 'Status', width: 130, cellRenderer: StatusCell },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 140,
      filter: 'agNumberColumnFilter',
      valueFormatter: currencyFormatter('EUR'),
      cellStyle: numberCellStyle,
    },
    { headerName: '', width: 170, sortable: false, filter: false, cellRenderer: ActionsCell },
  ];
  protected readonly defaultColDef: ColDef = { sortable: true, filter: true, resizable: true };

  protected setEmpty(empty: boolean): void {
    this.empty.set(empty);
    this.rows.set(empty ? [] : this.all);
  }

  protected simulateLoading(): void {
    this.loading.set(true);
    setTimeout(() => this.loading.set(false), 1500);
  }
}
