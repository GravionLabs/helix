import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  type ElementRef,
  type OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from '@gravionlabs/helix/api';
import { ButtonModule } from '@gravionlabs/helix/button';
import { IconFieldModule } from '@gravionlabs/helix/iconfield';
import { InputIconModule } from '@gravionlabs/helix/inputicon';
import { InputTextModule } from '@gravionlabs/helix/inputtext';
import { MultiSelectModule } from '@gravionlabs/helix/multiselect';
import { ProgressBarModule } from '@gravionlabs/helix/progressbar';
import { RatingModule } from '@gravionlabs/helix/rating';
import { RippleModule } from '@gravionlabs/helix/ripple';
import { SelectModule } from '@gravionlabs/helix/select';
import { SliderModule } from '@gravionlabs/helix/slider';
import { type Table, TableModule } from '@gravionlabs/helix/table';
import { TagModule } from '@gravionlabs/helix/tag';
import { ToastModule } from '@gravionlabs/helix/toast';
import { ToggleButtonModule } from '@gravionlabs/helix/togglebutton';
import { ObjectUtils } from '@gravionlabs/helix/utils';
import {
  type Customer,
  CustomerService,
  type Representative,
} from '@/app/pages/service/customer.service';
import { type Product, ProductService } from '@/app/pages/service/product.service';

interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'app-table-demo',
  standalone: true,
  imports: [
    TableModule,
    MultiSelectModule,
    SelectModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    ToggleButtonModule,
    ToastModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    RatingModule,
    RippleModule,
    IconFieldModule,
  ],
  templateUrl: './table-demo.html',
  styleUrl: './table-demo.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [ConfirmationService, MessageService, CustomerService, ProductService],
})
export class TableDemo implements OnInit {
  customers1: Customer[] = [];

  customers2: Customer[] = [];

  customers3: Customer[] = [];

  selectedCustomers1: Customer[] = [];

  selectedCustomer: Customer = {};

  representatives: Representative[] = [];

  statuses: any[] = [];

  products: Product[] = [];

  rowGroupMetadata: any;

  expandedRows: expandedRows = {};

  activityValues: number[] = [0, 100];

  isExpanded: boolean = false;

  balanceFrozen: boolean = false;

  loading: boolean = true;

  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private customerService: CustomerService,
    private productService: ProductService,
  ) {}

  ngOnInit() {
    this.customerService.getCustomersLarge().then((customers) => {
      this.customers1 = customers;
      this.loading = false;

      this.customers1.forEach((customer) => {
        if (customer.date) {
          customer.date = new Date(customer.date).toISOString();
        }
      });
    });
    this.customerService.getCustomersMedium().then((customers) => (this.customers2 = customers));
    this.customerService.getCustomersLarge().then((customers) => (this.customers3 = customers));
    this.productService.getProductsWithOrdersSmall().then((data) => (this.products = data));

    this.representatives = [
      { name: 'Amy Elsner', image: 'amyelsner.png' },
      { name: 'Anna Fali', image: 'annafali.png' },
      { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
      { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
      { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
      { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
      { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
      { name: 'Onyama Limba', image: 'onyamalimba.png' },
      { name: 'Stephen Shaw', image: 'stephenshaw.png' },
      { name: 'XuXue Feng', image: 'xuxuefeng.png' },
    ];

    this.statuses = [
      { label: 'Unqualified', value: 'unqualified' },
      { label: 'Qualified', value: 'qualified' },
      { label: 'New', value: 'new' },
      { label: 'Negotiation', value: 'negotiation' },
      { label: 'Renewal', value: 'renewal' },
      { label: 'Proposal', value: 'proposal' },
    ];
  }

  onSort() {
    this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};

    if (this.customers3) {
      for (let i = 0; i < this.customers3.length; i++) {
        const rowData = this.customers3[i];
        const representativeName = rowData?.representative?.name || '';

        if (i === 0) {
          this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
        } else {
          const previousRowData = this.customers3[i - 1];
          const previousRowGroup = previousRowData?.representative?.name;
          if (representativeName === previousRowGroup) {
            this.rowGroupMetadata[representativeName].size++;
          } else {
            this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
          }
        }
      }
    }
  }

  expandAll() {
    if (ObjectUtils.isEmpty(this.expandedRows)) {
      this.expandedRows = this.products.reduce(
        (acc, p) => {
          if (p.id) {
            acc[p.id] = true;
          }
          return acc;
        },
        {} as { [key: string]: boolean },
      );
      this.isExpanded = true;
    } else {
      this.collapseAll();
    }
  }

  collapseAll() {
    this.expandedRows = {};
    this.isExpanded = false;
  }

  formatCurrency(value: number) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  getSeverity(status: string) {
    switch (status) {
      case 'qualified':
      case 'instock':
      case 'INSTOCK':
      case 'DELIVERED':
      case 'delivered':
        return 'success';

      case 'negotiation':
      case 'lowstock':
      case 'LOWSTOCK':
      case 'PENDING':
      case 'pending':
        return 'warn';

      case 'unqualified':
      case 'outofstock':
      case 'OUTOFSTOCK':
      case 'CANCELLED':
      case 'cancelled':
        return 'danger';

      default:
        return 'info';
    }
  }

  calculateCustomerTotal(name: string) {
    let total = 0;

    if (this.customers2) {
      for (const customer of this.customers2) {
        if (customer.representative?.name === name) {
          total++;
        }
      }
    }

    return total;
  }
}
