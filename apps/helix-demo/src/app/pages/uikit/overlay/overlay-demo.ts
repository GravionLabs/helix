import { Component, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { type Popover, PopoverModule } from 'primeng/popover';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { type Product, ProductService } from '@/app/pages/service/product.service';

@Component({
  selector: 'app-overlay-demo',
  standalone: true,
  imports: [
    ToastModule,
    DialogModule,
    ButtonModule,
    DrawerModule,
    PopoverModule,
    ConfirmPopupModule,
    InputTextModule,
    FormsModule,
    TooltipModule,
    TableModule,
    ToastModule,
  ],
  templateUrl: './overlay-demo.html',
  styleUrl: './overlay-demo.scss',
  providers: [ConfirmationService, MessageService, ProductService],
})
export class OverlayDemo implements OnInit {
  display: boolean = false;

  products: Product[] = [];

  visibleLeft: boolean = false;

  visibleRight: boolean = false;

  visibleTop: boolean = false;

  visibleBottom: boolean = false;

  visibleFull: boolean = false;

  displayConfirmation: boolean = false;

  selectedProduct!: Product;

  constructor(
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.productService.getProductsSmall().then((products) => (this.products = products));
  }

  confirm(event: Event) {
    this.confirmationService.confirm({
      key: 'confirm2',
      target: event.target || new EventTarget(),
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Save',
      },
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'You have accepted',
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }

  open() {
    this.display = true;
  }

  close() {
    this.display = false;
  }

  toggleDataTable(op: Popover, event: any) {
    op.toggle(event);
  }

  onProductSelect(op: Popover, event: any) {
    op.hide();
    this.messageService.add({
      severity: 'info',
      summary: 'Product Selected',
      detail: event?.data.name,
      life: 3000,
    });
  }

  openConfirmation() {
    this.displayConfirmation = true;
  }

  closeConfirmation() {
    this.displayConfirmation = false;
  }
}
