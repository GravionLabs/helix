import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  HxBadge,
  HxButton,
  HxList,
  HxListRow,
  HxSelectButton,
  HxTag,
  type HxTagSeverity,
} from '@gravionlabs/helix-ui';
import { type Product, ProductService } from '@/app/pages/service/product.service';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

type Layout = 'list' | 'grid';

/**
 * List rows (`hx-list`: selected buttons, navigation links, a listbox) and a product list with a list/grid switch:
 * a plain list of cards with tags and buttons (no DataView).
 */
@Component({
  selector: 'app-list-demo',
  standalone: true,
  imports: [
    SourceTabsComponent,
    CurrencyPipe,
    FormsModule,
    RouterLink,
    HxBadge,
    HxButton,
    HxList,
    HxListRow,
    HxSelectButton,
    HxTag,
  ],
  templateUrl: './list-demo.html',
  styleUrl: './list-demo.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [ProductService],
})
export class ListDemo implements OnInit {
  readonly #products = inject(ProductService);

  readonly branches = [
    { name: 'main', updated: '2 h ago', locked: false },
    {
      name: 'feat/list-row-with-a-name-long-enough-to-truncate',
      updated: '1 d ago',
      locked: false,
    },
    { name: 'release/next', updated: '3 d ago', locked: false },
    { name: 'archive', updated: '1 y ago', locked: true },
  ];
  readonly branch = signal('main');
  readonly results = [
    { title: 'Theming', hits: 12 },
    { title: 'Surface roles', hits: 4 },
    { title: 'Density', hits: 2 },
  ];
  readonly result = signal('Theming');

  readonly layout = signal<Layout>('list');
  readonly options: Layout[] = ['list', 'grid'];
  readonly products = signal<Product[]>([]);

  ngOnInit() {
    void this.#products.getProductsSmall().then((data) => this.products.set(data.slice(0, 6)));
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
