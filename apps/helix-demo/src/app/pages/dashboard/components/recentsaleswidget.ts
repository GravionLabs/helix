import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  type OnInit,
  signal,
} from '@angular/core';
import { HxButton, HxTable } from '@gravionlabs/helix-ui';
import { type Product, ProductService } from '@/app/pages/service/product.service';

@Component({
  standalone: true,
  selector: 'app-recent-sales-widget',
  imports: [CurrencyPipe, HxTable, HxButton],
  templateUrl: './recentsaleswidget.html',
  styleUrl: './recentsaleswidget.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [ProductService],
})
export class RecentSalesWidget implements OnInit {
  products = signal<Product[]>([]);
  /** The five most recent: a plain table has no paging. */
  recent = computed(() => this.products().slice(0, 5));

  productService = inject(ProductService);

  ngOnInit() {
    this.productService.getProductsSmall().then((data) => this.products.set(data));
  }
}
