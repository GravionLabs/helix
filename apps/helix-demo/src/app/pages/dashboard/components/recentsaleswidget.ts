import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { type Product, ProductService } from '@/app/pages/service/product.service';

@Component({
  standalone: true,
  selector: 'app-recent-sales-widget',
  imports: [CommonModule, TableModule, ButtonModule, RippleModule],
  templateUrl: './recentsaleswidget.html',
  styleUrl: './recentsaleswidget.scss',
  providers: [ProductService],
})
export class RecentSalesWidget implements OnInit {
  products = signal<Product[]>([]);

  productService = inject(ProductService);

  ngOnInit() {
    this.productService.getProductsSmall().then((data) => this.products.set(data));
  }
}
