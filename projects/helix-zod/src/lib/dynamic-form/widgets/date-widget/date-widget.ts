import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { HelixFormField } from '@gravionlabs/helix';
import { HelixFieldWidgetBase } from '../widget-base';
import { HelixDateInput } from './date-input';

/** Built-in widget for `z.date()` fields. */
@Component({
  selector: 'helix-date-widget',
  standalone: true,
  imports: [FormField, HelixFormField, HelixDateInput],
  templateUrl: './date-widget.html',
  styleUrl: './date-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelixDateWidget extends HelixFieldWidgetBase<Date | null> {}
