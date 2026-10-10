import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  HxButton,
  HxInput,
  HxMessage,
  HxMessageService,
  HxToast,
  type HxToastSeverity,
} from '@gravionlabs/helix-ui';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

@Component({
  selector: 'app-messages-demo',
  standalone: true,
  imports: [SourceTabsComponent, HxToast, HxButton, HxInput, HxMessage, FormsModule],
  templateUrl: './messages-demo.html',
  styleUrl: './messages-demo.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class MessagesDemo {
  readonly #messages = inject(HxMessageService);

  username = '';
  email = '';

  show(severity: HxToastSeverity, summary: string, detail: string) {
    this.#messages.add({ severity, summary, detail });
  }
}
