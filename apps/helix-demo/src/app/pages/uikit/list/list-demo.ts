import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HxButton, HxSelectButton, HxTag, type HxTagSeverity } from '@gravionlabs/helix-ui';
import { type Product, ProductService } from '@/app/pages/service/product.service';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

type Layout = 'list' | 'grid';

/** A product list with a list/grid switch: a plain list of cards with tags and buttons (no DataView). */
@Component({
  selector: 'app-list-demo',
  standalone: true,
  imports: [SourceTabsComponent, CurrencyPipe, FormsModule, HxSelectButton, HxTag, HxButton],
  templateUrl: './list-demo.html',
  styleUrl: './list-demo.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [ProductService],
})
export class ListDemo implements OnInit {
  readonly #products = inject(ProductService);

  readonly layout = signal<Layout>('list');
  readonly options: Layout[] = ['list', 'grid'];
  readonly products = signal<Product[]>([]);

  ngOnInit() {
    this.#products.getProductsSmall().then((data) => this.products.set(data.slice(0, 6)));
  }

  severity(product: Product): HxTagSeverity {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }
}
