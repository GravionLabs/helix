import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@gravionlabs/helix/button';
import { DataViewModule } from '@gravionlabs/helix/dataview';
import { OrderListModule } from '@gravionlabs/helix/orderlist';
import { PickListModule } from '@gravionlabs/helix/picklist';
import { SelectButtonModule } from '@gravionlabs/helix/selectbutton';
import { TagModule } from '@gravionlabs/helix/tag';
import { type Product, ProductService } from '@/app/pages/service/product.service';

@Component({
  selector: 'app-list-demo',
  standalone: true,
  imports: [
    CommonModule,
    DataViewModule,
    FormsModule,
    SelectButtonModule,
    PickListModule,
    OrderListModule,
    TagModule,
    ButtonModule,
  ],
  templateUrl: './list-demo.html',
  styleUrl: './list-demo.scss',
  providers: [ProductService],
})
export class ListDemo implements OnInit {
  layout: 'list' | 'grid' = 'list';

  options = ['list', 'grid'];

  products: Product[] = [];

  sourceCities: any[] = [];

  targetCities: any[] = [];

  orderCities: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProductsSmall().then((data) => (this.products = data.slice(0, 6)));

    this.sourceCities = [
      { name: 'San Francisco', code: 'SF' },
      { name: 'London', code: 'LDN' },
      { name: 'Paris', code: 'PRS' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Berlin', code: 'BRL' },
      { name: 'Barcelona', code: 'BRC' },
      { name: 'Rome', code: 'RM' },
    ];

    this.targetCities = [];

    this.orderCities = [
      { name: 'San Francisco', code: 'SF' },
      { name: 'London', code: 'LDN' },
      { name: 'Paris', code: 'PRS' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Berlin', code: 'BRL' },
      { name: 'Barcelona', code: 'BRC' },
      { name: 'Rome', code: 'RM' },
    ];
  }

  getSeverity(product: Product) {
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
