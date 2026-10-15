import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HxTable } from '@gravionlabs/helix-ui';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

/** The plain `table[hx-table]` of `@gravionlabs/helix-ui`: striped, hoverable, small, gridlines and a sticky header. */
@Component({
  selector: 'app-uikit-table-demo',
  standalone: true,
  imports: [SourceTabsComponent, HxTable],
  templateUrl: './table-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UikitTableDemo {
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
}
