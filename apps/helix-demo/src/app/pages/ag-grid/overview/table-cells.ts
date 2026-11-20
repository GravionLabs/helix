import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HxButton, HxProgressBar, HxTag, type HxTagSeverity } from '@gravionlabs/helix-ui';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';
import type { Customer } from '@/app/pages/service/customer.service';

const SEVERITY: Record<string, HxTagSeverity> = {
  unqualified: 'danger',
  qualified: 'success',
  new: 'info',
  negotiation: 'warn',
  renewal: 'secondary',
  proposal: 'contrast',
};

/** The status of a customer as an `hx-tag`. */
@Component({
  selector: 'app-table-status-cell',
  standalone: true,
  imports: [HxTag],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: flex; align-items: center; height: 100%' },
  templateUrl: './status-cell.html',
})
export class StatusCell implements ICellRendererAngularComp {
  protected readonly status = signal('');
  protected readonly severity = signal<HxTagSeverity>('info');

  agInit(params: ICellRendererParams<Customer, string>): void {
    this.refresh(params);
  }

  refresh(params: ICellRendererParams<Customer, string>): boolean {
    this.status.set(params.value ?? '');
    this.severity.set(SEVERITY[params.value ?? ''] ?? 'info');
    return true;
  }
}

/** The activity of a customer (0 to 100) as an `hx-progress-bar`. */
@Component({
  selector: 'app-table-activity-cell',
  standalone: true,
  imports: [HxProgressBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: flex; align-items: center; height: 100%; width: 100%' },
  templateUrl: './activity-cell.html',
})
export class ActivityCell implements ICellRendererAngularComp {
  protected readonly value = signal(0);

  agInit(params: ICellRendererParams<Customer, number>): void {
    this.refresh(params);
  }

  refresh(params: ICellRendererParams<Customer, number>): boolean {
    this.value.set(params.value ?? 0);
    return true;
  }
}

/** The callback the grid hands to the row action through its `context`. */
export interface TableContext {
  view: (customer: Customer) => void;
}

/** One row action, named after the customer. */
@Component({
  selector: 'app-table-action-cell',
  host: { style: 'display: flex; align-items: center; height: 100%' },
  standalone: true,
  imports: [HxButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './action-cell.html',
})
export class ActionCell implements ICellRendererAngularComp {
  #customer: Customer | undefined;
  #context: TableContext | undefined;
  protected readonly name = signal('');

  agInit(params: ICellRendererParams<Customer>): void {
    this.refresh(params);
  }

  refresh(params: ICellRendererParams<Customer>): boolean {
    this.#customer = params.data;
    this.#context = params.context as TableContext;
    this.name.set(params.data?.name ?? '');
    return true;
  }

  protected view(): void {
    if (this.#customer) this.#context?.view(this.#customer);
  }
}
