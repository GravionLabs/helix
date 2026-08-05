import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { HelixFieldWidgetBase } from '../widget-base';

/** Built-in widget for boolean fields — checkbox with inline label. */
@Component({
  selector: 'helix-checkbox-widget',
  standalone: true,
  imports: [FormField],
  templateUrl: './checkbox-widget.html',
  styleUrl: './checkbox-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelixCheckboxWidget extends HelixFieldWidgetBase<boolean> {}
