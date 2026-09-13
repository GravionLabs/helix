import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { HelixFormField } from '@gravionlabs/helix-shell';
import { HelixFieldWidgetBase } from '../widget-base';

/** Built-in widget for numeric fields. */
@Component({
  selector: 'helix-number-widget',
  standalone: true,
  imports: [FormField, HelixFormField],
  templateUrl: './number-widget.html',
  styleUrl: './number-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelixNumberWidget extends HelixFieldWidgetBase<number | null> {}
