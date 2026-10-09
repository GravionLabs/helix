import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { HelixFormField } from '@gravionlabs/helix-shell';
import { HxInput } from '@gravionlabs/helix-ui';
import { HelixFieldWidgetBase } from '../widget-base';

/** Built-in widget for `text`, `email` and `password` fields. */
@Component({
  selector: 'helix-text-widget',
  standalone: true,
  imports: [FormField, HelixFormField, HxInput],
  templateUrl: './text-widget.html',
  styleUrl: './text-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelixTextWidget extends HelixFieldWidgetBase<string> {}
