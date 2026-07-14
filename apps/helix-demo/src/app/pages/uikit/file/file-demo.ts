import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageService } from '@gravionlabs/helix/api';
import { ButtonModule } from '@gravionlabs/helix/button';
import { FileUploadModule } from '@gravionlabs/helix/fileupload';
import { ToastModule } from '@gravionlabs/helix/toast';

@Component({
  selector: 'app-file-demo',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToastModule, ButtonModule],
  templateUrl: './file-demo.html',
  styleUrl: './file-demo.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [MessageService],
})
export class FileDemo {
  uploadedFiles: any[] = [];

  constructor(private messageService: MessageService) {}

  onUpload(event: any) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
  }

  onBasicUpload() {
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded with Basic Mode',
    });
  }
}
