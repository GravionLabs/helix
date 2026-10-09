import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { currencyFormatter, helixGridTheme } from '@gravionlabs/helix-ag-grid';
import {
  HxButton,
  HxConfirmationService,
  HxConfirmDialog,
  HxDialog,
  HxIconField,
  HxInput,
  HxInputNumber,
  HxMessageService,
  HxRadio,
  HxSelect,
  HxToast,
  HxToolbar,
} from '@gravionlabs/helix-ui';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  type ColDef,
  type GridApi,
  type GridReadyEvent,
  ModuleRegistry,
} from 'ag-grid-community';
import { type Product, ProductService } from '@/app/pages/service/product.service';
import {
  CrudActionsCell,
  type CrudContext,
  CrudImageCell,
  CrudRatingCell,
  CrudStatusCell,
} from './crud-cells';

ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * Create, read, update, delete on helix-ui: `hx-toolbar`, an AG Grid (helix-ag-grid theme) for the list with row
 * selection, quick filter, sorting and paging, `hx-dialog` for the form, `hx-confirm-dialog` for the delete questions
 * and `hx-toast` for the result.
 */
@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AgGridAngular,
    HxButton,
    HxToolbar,
    HxIconField,
    HxInput,
    HxInputNumber,
    HxSelect,
    HxRadio,
    HxDialog,
    HxConfirmDialog,
    HxToast,
  ],
  template: `
    <hx-toolbar class="mb-3">
      <span hxToolbarStart class="flex gap-2">
        <button hx-button type="button" severity="secondary" (click)="openNew()">
          <span class="pi pi-plus hx-button-icon" aria-hidden="true"></span>
          New
        </button>
        <button
          hx-button
          type="button"
          severity="secondary"
          variant="outlined"
          [disabled]="selectedCount() === 0"
          (click)="deleteSelectedProducts()"
        >
          <span class="pi pi-trash hx-button-icon" aria-hidden="true"></span>
          Delete
        </button>
      </span>
      <button hxToolbarEnd hx-button type="button" severity="secondary" (click)="exportCSV()">
        <span class="pi pi-upload hx-button-icon" aria-hidden="true"></span>
        Export
      </button>
    </hx-toolbar>

    <div class="card">
      <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 class="demo-title m-0">Manage Products</h2>
        <hx-icon-field>
          <i class="pi pi-search" hx-input-icon></i>
          <input
            hx-input
            type="search"
            placeholder="Search..."
            aria-label="Search products"
            (input)="quickFilter.set($any($event.target).value)"
          />
        </hx-icon-field>
      </div>
      <ag-grid-angular
        [theme]="theme"
        [rowData]="products()"
        [columnDefs]="columns"
        [defaultColDef]="defaultColDef"
        [getRowId]="rowId"
        [rowSelection]="{ mode: 'multiRow' }"
        [pagination]="true"
        [paginationPageSize]="10"
        [paginationPageSizeSelector]="[10, 20, 30]"
        [quickFilterText]="quickFilter()"
        [context]="context"
        domLayout="autoHeight"
        (gridReady)="onGridReady($event)"
        (selectionChanged)="onSelectionChanged()"
      />
    </div>

    <hx-dialog [(visible)]="productDialog" header="Product Details" width="28rem">
      <div class="flex flex-col gap-3">
        @if (product.image) {
          <img
            [src]="'https://primefaces.org/cdn/primeng/images/demo/product/' + product.image"
            alt=""
            class="m-auto block pb-4"
          />
        }
        <div>
          <label for="name" class="mb-2 block font-bold">Name</label>
          <input hx-input fluid id="name" [(ngModel)]="product.name" required [attr.aria-invalid]="submitted && !product.name ? 'true' : null" />
          @if (submitted && !product.name) {
            <small class="text-red-500">Name is required.</small>
          }
        </div>
        <div>
          <label for="description" class="mb-2 block font-bold">Description</label>
          <textarea hx-input fluid autoResize id="description" [(ngModel)]="product.description" rows="3"></textarea>
        </div>

        <div>
          <label for="inventoryStatus" class="mb-2 block font-bold">Inventory Status</label>
          <hx-select
            fluid
            inputId="inventoryStatus"
            [(ngModel)]="product.inventoryStatus"
            [options]="statuses"
            optionLabel="label"
            optionValue="label"
            placeholder="Select a Status"
          />
        </div>

        <fieldset class="m-0 border-0 p-0">
          <legend class="mb-2 font-bold">Category</legend>
          <div class="grid grid-cols-12 gap-3">
            @for (category of categories; track category) {
              <div class="col-span-6 flex items-center gap-2">
                <input hx-radio type="radio" name="category" [id]="'category-' + category" [value]="category" [(ngModel)]="product.category" />
                <label [for]="'category-' + category">{{ category }}</label>
              </div>
            }
          </div>
        </fieldset>

        <div class="grid grid-cols-12 gap-3">
          <div class="col-span-6">
            <label for="price" class="mb-2 block font-bold">Price</label>
            <hx-input-number fluid inputId="price" [(ngModel)]="product.price" mode="currency" currency="USD" locale="en-US" />
          </div>
          <div class="col-span-6">
            <label for="quantity" class="mb-2 block font-bold">Quantity</label>
            <hx-input-number fluid inputId="quantity" [(ngModel)]="product.quantity" />
          </div>
        </div>
      </div>
      <div hxDialogFooter>
        <button hx-button type="button" variant="text" (click)="hideDialog()">
          <span class="pi pi-times hx-button-icon" aria-hidden="true"></span>
          Cancel
        </button>
        <button hx-button type="button" (click)="saveProduct()">
          <span class="pi pi-check hx-button-icon" aria-hidden="true"></span>
          Save
        </button>
      </div>
    </hx-dialog>

    <hx-confirm-dialog />
    <hx-toast />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [ProductService],
})
export class Crud implements OnInit {
  readonly #productService = inject(ProductService);
  readonly #messages = inject(HxMessageService);
  readonly #confirmation = inject(HxConfirmationService);

  protected readonly theme = helixGridTheme;
  productDialog = false;
  products = signal<Product[]>([]);
  product: Product = {};
  submitted = false;
  readonly quickFilter = signal('');
  readonly selectedCount = signal(0);
  readonly categories = ['Accessories', 'Clothing', 'Electronics', 'Fitness'];
  readonly statuses = [
    { label: 'INSTOCK', value: 'instock' },
    { label: 'LOWSTOCK', value: 'lowstock' },
    { label: 'OUTOFSTOCK', value: 'outofstock' },
  ];

  #api: GridApi<Product> | undefined;

  protected readonly context: CrudContext = {
    edit: (product) => this.editProduct(product),
    remove: (product) => this.deleteProduct(product),
  };
  protected readonly rowId = (params: { data: Product }) => params.data.id as string;
  protected readonly defaultColDef: ColDef<Product> = {
    sortable: true,
    filter: true,
    resizable: true,
  };
  /** Cells with a component in them centre it, so the stars and tags sit on the line of the text. */
  readonly #centered = { display: 'flex', alignItems: 'center' };
  protected readonly columns: ColDef<Product>[] = [
    { field: 'code', headerName: 'Code', width: 130 },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 180 },
    {
      field: 'image',
      headerName: 'Image',
      width: 110,
      sortable: false,
      filter: false,
      cellRenderer: CrudImageCell,
      cellStyle: this.#centered,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      filter: 'agNumberColumnFilter',
      valueFormatter: currencyFormatter('USD', 'en-US'),
    },
    { field: 'category', headerName: 'Category', width: 150 },
    {
      field: 'rating',
      headerName: 'Reviews',
      width: 150,
      filter: 'agNumberColumnFilter',
      cellRenderer: CrudRatingCell,
      cellStyle: this.#centered,
    },
    {
      field: 'inventoryStatus',
      headerName: 'Status',
      width: 140,
      cellRenderer: CrudStatusCell,
      cellStyle: this.#centered,
    },
    {
      headerName: 'Actions',
      width: 130,
      sortable: false,
      filter: false,
      cellRenderer: CrudActionsCell,
      cellStyle: this.#centered,
    },
  ];

  ngOnInit() {
    this.#productService.getProducts().then((data) => this.products.set(data));
  }

  onGridReady(event: GridReadyEvent<Product>) {
    this.#api = event.api;
  }

  onSelectionChanged() {
    this.selectedCount.set(this.#api?.getSelectedRows().length ?? 0);
  }

  exportCSV() {
    this.#api?.exportDataAsCsv({ columnKeys: ['code', 'name', 'price', 'category'] });
  }

  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
  }

  editProduct(product: Product) {
    this.product = { ...product };
    this.productDialog = true;
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  deleteSelectedProducts() {
    const selected = this.#api?.getSelectedRows() ?? [];
    this.#confirmation.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      acceptSeverity: 'danger',
      accept: () => {
        const ids = new Set(selected.map((p) => p.id));
        this.products.set(this.products().filter((p) => !ids.has(p.id)));
        this.selectedCount.set(0);
        this.#messages.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000,
        });
      },
    });
  }

  deleteProduct(product: Product) {
    this.#confirmation.confirm({
      message: `Are you sure you want to delete ${product.name}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      acceptSeverity: 'danger',
      accept: () => {
        this.products.set(this.products().filter((p) => p.id !== product.id));
        this.selectedCount.set(this.#api?.getSelectedRows().length ?? 0);
        this.#messages.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000,
        });
      },
    });
  }

  createId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 5; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
    return id;
  }

  saveProduct() {
    this.submitted = true;
    if (!this.product.name?.trim()) return;
    if (this.product.id) {
      const saved = this.product;
      this.products.set(this.products().map((p) => (p.id === saved.id ? saved : p)));
      this.#messages.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Product Updated',
        life: 3000,
      });
    } else {
      this.product.id = this.createId();
      this.product.image = 'product-placeholder.svg';
      this.products.set([...this.products(), this.product]);
      this.#messages.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Product Created',
        life: 3000,
      });
    }
    this.productDialog = false;
    this.product = {};
  }
}
