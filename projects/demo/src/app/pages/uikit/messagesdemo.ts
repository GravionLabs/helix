import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, type ToastMessageOptions } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-messages-demo',
  standalone: true,
  imports: [CommonModule, ToastModule, ButtonModule, InputTextModule, MessageModule, FormsModule],
  template: `
    <div class="flex flex-col md:flex-row gap-2">
      <div class="md:w-1/2">
        <div class="card">
          <div class="font-semibold text-xl mb-2">Toast</div>
          <div class="flex flex-wrap gap-1">
            <p-button (click)="showSuccessViaToast()" label="Success" severity="success" />
            <p-button (click)="showInfoViaToast()" label="Info" severity="info" />
            <p-button (click)="showWarnViaToast()" label="Warn" severity="warn" />
            <p-button (click)="showErrorViaToast()" label="Error" severity="danger" />
            <p-toast />
          </div>

          <div class="font-semibold text-xl mt-1 mb-2">Inline</div>
          <div class="flex mb-2 gap-1">
            <input
              pInputText
              [(ngModel)]="username"
              placeholder="Username"
              aria-label="username"
              class="ng-dirty ng-invalid"
            />
            <p-message severity="error" size="small" styleClass="h-auto w-full " [pt]="pt"
              >Username is required</p-message
            >
          </div>
          <div class="flex flex-wrap gap-1">
            <input
              pInputText
              [(ngModel)]="email"
              placeholder="Email"
              aria-label="email"
              class="ng-dirty ng-invalid"
            />
            <p-message
              severity="error"
              size="small"
              styleClass="flex items-center text-center justify-center h-auto w-11"
              [pt]="pt"
            >
              <i class="pi pi-times-circle"></i>
            </p-message>
          </div>
        </div>
      </div>
      <div class="md:w-1/2">
        <div class="card">
          <div class="font-semibold text-xl mb-2">Message</div>
          <div class="flex flex-col gap-3 mb-2">
            <p-message severity="success">Success Message</p-message>
            <p-message severity="info">Info Message</p-message>
            <p-message severity="warn">Warn Message</p-message>
            <p-message severity="error">Error Message</p-message>
            <p-message severity="secondary">Secondary Message</p-message>
            <p-message severity="contrast">Contrast Message</p-message>
          </div>
        </div>
      </div>
    </div>
  `,
  providers: [MessageService],
})
export class MessagesDemo {
  msgs: ToastMessageOptions[] | null = [];

  username: string | undefined;

  email: string | undefined;

  constructor(private service: MessageService) {}

  pt: any = {
    contentWrapper: 'flex items-center',
  };

  showInfoViaToast() {
    this.service.add({
      severity: 'info',
      summary: 'Info Message',
      detail: 'PrimeNG rocks',
    });
  }

  showWarnViaToast() {
    this.service.add({
      severity: 'warn',
      summary: 'Warn Message',
      detail: 'There are unsaved changes',
    });
  }

  showErrorViaToast() {
    this.service.add({
      severity: 'error',
      summary: 'Error Message',
      detail: 'Validation failed',
    });
  }

  showSuccessViaToast() {
    this.service.add({
      severity: 'success',
      summary: 'Success Message',
      detail: 'Message sent',
    });
  }
}
