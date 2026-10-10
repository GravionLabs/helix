import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { HelixFormField } from '@gravionlabs/helix-shell';
import { HxInput } from '@gravionlabs/helix-ui';
import { HelixFieldWidgetBase } from '../widget-base';

/** Built-in widget for multiline text (`widget: 'textarea'`). */
@Component({
  selector: 'helix-textarea-widget',
  standalone: true,
  imports: [FormField, HelixFormField, HxInput],
  templateUrl: './textarea-widget.html',
  styleUrl: './textarea-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelixTextareaWidget extends HelixFieldWidgetBase<string> {}
