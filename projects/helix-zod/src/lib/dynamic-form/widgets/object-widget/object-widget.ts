import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HelixDynamicField } from '../../components/dynamic-field/dynamic-field';
import { HelixFieldWidgetBase } from '../widget-base';

/** Built-in widget for nested `z.object()` fields — fieldset + recursion. */
@Component({
  selector: 'helix-object-widget',
  standalone: true,
  imports: [HelixDynamicField],
  templateUrl: './object-widget.html',
  styleUrl: './object-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelixObjectWidget extends HelixFieldWidgetBase<Record<string, unknown>> {
  protected childField(key: string): any {
    return (this.field() as any)[key];
  }
}
