import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from '@helix-ui/core/api';
import { ButtonModule } from '@helix-ui/core/button';
import { ConfirmPopupModule } from '@helix-ui/core/confirmpopup';
import { DialogModule } from '@helix-ui/core/dialog';
import { DrawerModule } from '@helix-ui/core/drawer';
import { InputTextModule } from '@helix-ui/core/inputtext';
import { type Popover, PopoverModule } from '@helix-ui/core/popover';
import { TableModule } from '@helix-ui/core/table';
import { ToastModule } from '@helix-ui/core/toast';
import { TooltipModule } from '@helix-ui/core/tooltip';
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
  changeDetection: ChangeDetectionStrategy.Eager,
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
