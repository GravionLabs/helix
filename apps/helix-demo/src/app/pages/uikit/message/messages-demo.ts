import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, type ToastMessageOptions } from '@helix/core/api';
import { ButtonModule } from '@helix/core/button';
import { InputTextModule } from '@helix/core/inputtext';
import { MessageModule } from '@helix/core/message';
import { ToastModule } from '@helix/core/toast';

@Component({
  selector: 'app-messages-demo',
  standalone: true,
  imports: [CommonModule, ToastModule, ButtonModule, InputTextModule, MessageModule, FormsModule],
  templateUrl: './messages-demo.html',
  styleUrl: './messages-demo.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
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
      detail: 'Helix rocks',
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
