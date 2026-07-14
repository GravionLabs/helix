import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit, signal } from '@angular/core';
import { ButtonModule } from '@gravionlabs/helix/button';
import { CarouselModule } from '@gravionlabs/helix/carousel';
import { GalleriaModule } from '@gravionlabs/helix/galleria';
import { ImageModule } from '@gravionlabs/helix/image';
import { TagModule } from '@gravionlabs/helix/tag';
import { PhotoService } from '@/app/pages/service/photo.service';
import { type Product, ProductService } from '@/app/pages/service/product.service';

@Component({
  selector: 'app-media-demo',
  standalone: true,
  imports: [CommonModule, CarouselModule, ButtonModule, GalleriaModule, ImageModule, TagModule],
  templateUrl: './media-demo.html',
  styleUrl: './media-demo.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [ProductService, PhotoService],
})
export class MediaDemo implements OnInit {
  productService = inject(ProductService);

  photoService = inject(PhotoService);

  products = signal<Product[]>([]);

  images = signal<any[]>([]);

  galleriaResponsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '960px',
      numVisible: 4,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];

  carouselResponsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  ngOnInit() {
    this.productService.getProductsSmall().then((products) => this.products.set(products));
    this.photoService.getImages().then((images) => this.images.set(images));
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'success';
    }
  }
}
