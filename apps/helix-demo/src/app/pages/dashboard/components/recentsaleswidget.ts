import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit, signal } from '@angular/core';
import { ButtonModule } from '@gravionlabs/helix/button';
import { RippleModule } from '@gravionlabs/helix/ripple';
import { TableModule } from '@gravionlabs/helix/table';
import { type Product, ProductService } from '@/app/pages/service/product.service';

@Component({
  standalone: true,
  selector: 'app-recent-sales-widget',
  imports: [CommonModule, TableModule, ButtonModule, RippleModule],
  templateUrl: './recentsaleswidget.html',
  styleUrl: './recentsaleswidget.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [ProductService],
})
export class RecentSalesWidget implements OnInit {
  products = signal<Product[]>([]);

  productService = inject(ProductService);

  ngOnInit() {
    this.productService.getProductsSmall().then((data) => this.products.set(data));
  }
}
