import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  HxButton,
  HxMessage,
  HxMessageService,
  HxToast,
  type HxToastSeverity,
} from '@gravionlabs/helix-ui';

/** `@gravionlabs/helix-ui` messages and overlays: Toast, Message. */
@Component({
  selector: 'app-hx-overlays-demo',
  standalone: true,
  imports: [HxMessage, HxToast, HxButton],
  templateUrl: './hx-overlays-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hx-overlays-demo.scss',
})
export class HxOverlaysDemo {
  protected readonly messages = inject(HxMessageService);

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
