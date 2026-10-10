import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HxFileUpload, HxMessageService, HxToast } from '@gravionlabs/helix-ui';

/** File upload on helix-ui; the upload itself is simulated (no server in the demo). */
@Component({
  selector: 'app-file-demo',
  standalone: true,
  imports: [HxFileUpload, HxToast],
  templateUrl: './file-demo.html',
  styleUrl: './file-demo.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class FileDemo {
  readonly #messages = inject(HxMessageService);

  readonly progress = signal<number | null>(null);
  readonly uploadedFiles = signal<string[]>([]);

  onUpload(files: File[]) {
    this.progress.set(0);
    const timer = setInterval(() => {
      const next = Math.min(100, (this.progress() ?? 0) + 20);
      this.progress.set(next);
      if (next === 100) {
        clearInterval(timer);
        this.uploadedFiles.update((list) => [...list, ...files.map((f) => f.name)]);
        this.#messages.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
        setTimeout(() => this.progress.set(null), 600);
      }
    }, 200);
  }

  onBasicUpload(files: File[]) {
    this.#messages.add({
      severity: 'info',
      summary: 'Success',
      detail: `${files.length} file(s) chosen with the basic mode`,
    });
  }
}
