import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  HxButton,
  HxConfirmationService,
  HxConfirmDialog,
  HxConfirmPopup,
  HxDialog,
  HxDrawer,
  HxInput,
  HxMessageService,
  HxPopover,
  HxTable,
  HxToast,
  HxTooltip,
} from '@gravionlabs/helix-ui';
import { type Product, ProductService } from '@/app/pages/service/product.service';
import { HxOverlaysSection } from '../sections/overlays/overlays-section';

@Component({
  selector: 'app-overlay-demo',
  standalone: true,
  imports: [
    HxOverlaysSection,

    CurrencyPipe,
    FormsModule,
    HxButton,
    HxInput,
    HxDialog,
    HxDrawer,
    HxPopover,
    HxConfirmDialog,
    HxConfirmPopup,
    HxTable,
    HxToast,
    HxTooltip,
  ],
  templateUrl: './overlay-demo.html',
  styleUrl: './overlay-demo.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [ProductService],
})
export class OverlayDemo implements OnInit {
  readonly #productService = inject(ProductService);
  readonly #messages = inject(HxMessageService);
  readonly #confirmation = inject(HxConfirmationService);

  display = false;
  readonly products = signal<Product[]>([]);
  readonly drawer = signal<'left' | 'right' | 'top' | 'bottom' | null>(null);
  full = false;
  readonly lorem =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

  ngOnInit() {
    this.#productService
      .getProductsSmall()
      .then((products) => this.products.set(products.slice(0, 5)));
  }

  confirmPopup(event: Event) {
    this.#confirmation.confirm({
      target: event,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Cancel',
      acceptLabel: 'Save',
      accept: () =>
        this.#messages.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }),
      reject: () =>
        this.#messages.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' }),
    });
  }

  confirmDelete() {
    this.#confirmation.confirm({
      header: 'Confirmation',
      message: 'Are you sure you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      acceptSeverity: 'danger',
    });
  }

  selectProduct(popover: HxPopover, product: Product) {
    popover.hide();
    this.#messages.add({
      severity: 'info',
      summary: 'Product Selected',
      detail: product.name,
      life: 3000,
    });
  }
}
