import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HxButton, HxRating, HxTag, type HxTagSeverity } from '@gravionlabs/helix-ui';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';
import type { Product } from '@/app/pages/service/product.service';

const IMAGE_BASE = 'https://primefaces.org/cdn/primeng/images/demo/product/';

/** The callbacks the grid hands to the row actions through its `context`. */
export interface CrudContext {
  edit: (product: Product) => void;
  remove: (product: Product) => void;
}

/** The picture of a product; the name is in the next cell, so the picture is decorative. */
@Component({
  selector: 'app-crud-image-cell',
  host: { style: 'display: flex; align-items: center; height: 100%' },
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<img [src]="src()" alt="" style="width: 48px" class="rounded" />`,
})
export class CrudImageCell implements ICellRendererAngularComp {
  protected readonly src = signal('');

  agInit(params: ICellRendererParams<Product, string>): void {
    this.refresh(params);
  }

  refresh(params: ICellRendererParams<Product, string>): boolean {
    this.src.set(IMAGE_BASE + (params.value ?? ''));
    return true;
  }
}

/** The review score as a read-only `hx-rating`. */
@Component({
  selector: 'app-crud-rating-cell',
  host: { style: 'display: flex; align-items: center; height: 100%' },
  standalone: true,
  imports: [HxRating],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<hx-rating readonly [value]="value()" [ariaLabel]="'Rated ' + (value() ?? 0) + ' of 5'" />`,
})
export class CrudRatingCell implements ICellRendererAngularComp {
  protected readonly value = signal<number | null>(null);

  agInit(params: ICellRendererParams<Product, number>): void {
    this.refresh(params);
  }

  refresh(params: ICellRendererParams<Product, number>): boolean {
    this.value.set(params.value ?? null);
    return true;
  }
}

const SEVERITY: Record<string, HxTagSeverity> = {
  INSTOCK: 'success',
  LOWSTOCK: 'warn',
  OUTOFSTOCK: 'danger',
};

/** The inventory status as an `hx-tag`. */
@Component({
  selector: 'app-crud-status-cell',
  host: { style: 'display: flex; align-items: center; height: 100%' },
  standalone: true,
  imports: [HxTag],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<hx-tag [value]="status()" [severity]="severity()" />`,
})
export class CrudStatusCell implements ICellRendererAngularComp {
  protected readonly status = signal('');
  protected readonly severity = signal<HxTagSeverity>('info');

  agInit(params: ICellRendererParams<Product, string>): void {
    this.refresh(params);
  }

  refresh(params: ICellRendererParams<Product, string>): boolean {
    this.status.set(params.value ?? '');
    this.severity.set(SEVERITY[params.value ?? ''] ?? 'info');
    return true;
  }
}

/** Edit and delete, as icon buttons that name the product. */
@Component({
  selector: 'app-crud-actions-cell',
  standalone: true,
  imports: [HxButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button hx-button type="button" iconOnly rounded variant="outlined" [attr.aria-label]="'Edit ' + name()" (click)="edit()">
      <span class="pi pi-pencil hx-button-icon" aria-hidden="true"></span>
    </button>
    <button hx-button type="button" iconOnly rounded variant="outlined" severity="danger" [attr.aria-label]="'Delete ' + name()" (click)="remove()">
      <span class="pi pi-trash hx-button-icon" aria-hidden="true"></span>
    </button>
  `,
  styles: ':host { display: inline-flex; gap: 0.5rem; align-items: center; }',
})
export class CrudActionsCell implements ICellRendererAngularComp {
  #product: Product | undefined;
  #context: CrudContext | undefined;
  protected readonly name = signal('');

  agInit(params: ICellRendererParams<Product>): void {
    this.refresh(params);
  }

  refresh(params: ICellRendererParams<Product>): boolean {
    this.#product = params.data;
    this.#context = params.context as CrudContext;
    this.name.set(params.data?.name ?? '');
    return true;
  }

  protected edit(): void {
    if (this.#product) this.#context?.edit(this.#product);
  }

  protected remove(): void {
    if (this.#product) this.#context?.remove(this.#product);
  }
}
