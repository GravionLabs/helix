import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  HX_DIALOG_DATA,
  HxButton,
  HxDialog,
  HxDialogRef,
  HxDialogService,
  HxInput,
  HxMessage,
  HxMessageService,
  HxToast,
  type HxToastSeverity,
} from '@gravionlabs/helix-ui';

/** The component the dialog service opens in the demo. */
@Component({
  selector: 'app-hx-dialog-content',
  standalone: true,
  imports: [HxButton],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <p class="m-0">Hello {{ data.name }}, this component was opened by the dialog service.</p>
    <div class="mt-4 flex justify-end gap-2">
      <button hx-button type="button" variant="text" (click)="ref.close()">Cancel</button>
      <button hx-button type="button" (click)="ref.close('confirmed')">Confirm</button>
    </div>
  `,
})
export class HxDialogContentDemo {
  protected readonly data = inject(HX_DIALOG_DATA) as { name: string };
  protected readonly ref = inject(HxDialogRef<string>);
}

/** `@gravionlabs/helix-ui` messages and overlays: Toast, Message, Dialog. */
@Component({
  selector: 'app-hx-overlays-demo',
  standalone: true,
  imports: [HxMessage, HxToast, HxButton, HxDialog, HxInput],
  templateUrl: './hx-overlays-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hx-overlays-demo.scss',
})
export class HxOverlaysDemo {
  protected readonly messages = inject(HxMessageService);
  readonly #dialogs = inject(HxDialogService);
  protected readonly open = signal(false);
  protected readonly nonModal = signal(false);
  protected readonly result = signal('none');

  openFromService() {
    const ref = this.#dialogs.open<HxDialogContentDemo, string>(HxDialogContentDemo, {
      header: 'From the service',
      width: '26rem',
      data: { name: 'Amy' },
    });
    ref.closed.subscribe((result) => this.result.set(result ?? 'closed without a result'));
  }

  show(severity: HxToastSeverity) {
    this.messages.add({
      severity,
      summary: `${severity[0].toUpperCase()}${severity.slice(1)} message`,
      detail: 'The message pauses while the pointer or the focus is on it.',
      sticky: severity === 'error',
    });
  }

  showKeyed() {
    this.messages.add({
      severity: 'info',
      summary: 'Keyed message',
      detail: 'Sent with key "bottom".',
      key: 'bottom',
    });
  }
}
