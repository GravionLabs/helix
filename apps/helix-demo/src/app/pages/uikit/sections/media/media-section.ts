import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  HxButton,
  HxCarousel,
  HxCarouselItem,
  type HxCarouselResponsiveOption,
  HxTag,
} from '@gravionlabs/helix-ui';

interface Product {
  name: string;
  image: string;
  price: number;
  status: 'In stock' | 'Low stock' | 'Out of stock';
}

/** `@gravionlabs/helix-ui` media components: Carousel. */
@Component({
  selector: 'app-media-section',
  standalone: true,
  imports: [HxButton, HxCarousel, HxCarouselItem, HxTag],
  templateUrl: './media-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './media-section.scss',
})
export class HxMediaSection {
  readonly imageBase = 'https://primefaces.org/cdn/primeng/images/demo/product/';
  readonly products: Product[] = [
    { name: 'Bamboo Watch', image: 'bamboo-watch.jpg', price: 65, status: 'In stock' },
    { name: 'Black Watch', image: 'black-watch.jpg', price: 72, status: 'In stock' },
    { name: 'Blue Band', image: 'blue-band.jpg', price: 79, status: 'Low stock' },
    { name: 'Blue T-Shirt', image: 'blue-t-shirt.jpg', price: 29, status: 'In stock' },
    { name: 'Bracelet', image: 'bracelet.jpg', price: 15, status: 'Out of stock' },
    { name: 'Brown Purse', image: 'brown-purse.jpg', price: 120, status: 'In stock' },
    { name: 'Chakra Bracelet', image: 'chakra-bracelet.jpg', price: 32, status: 'Low stock' },
    { name: 'Galaxy Earrings', image: 'galaxy-earrings.jpg', price: 34, status: 'In stock' },
    { name: 'Game Controller', image: 'game-controller.jpg', price: 99, status: 'Out of stock' },
  ];
  readonly responsive: HxCarouselResponsiveOption[] = [
    { breakpoint: '1400px', numVisible: 3, numScroll: 1 },
    { breakpoint: '1024px', numVisible: 2, numScroll: 1 },
    { breakpoint: '640px', numVisible: 1, numScroll: 1 },
  ];
  readonly page = signal(0);

  severity(status: Product['status']): 'success' | 'warn' | 'danger' {
    return status === 'In stock' ? 'success' : status === 'Low stock' ? 'warn' : 'danger';
  }
}
