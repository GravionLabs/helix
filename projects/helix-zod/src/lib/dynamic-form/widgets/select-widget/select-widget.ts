import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { HelixFormField, HelixSelect } from '@gravionlabs/helix';
import { HelixFieldWidgetBase } from '../widget-base';

/**
 * Built-in widget for enum/select fields — wraps `HelixSelect`, which the
 * signal-forms `FormField` directive binds via its `ControlValueAccessor`.
 */
@Component({
  selector: 'helix-select-widget',
  standalone: true,
  imports: [FormField, HelixFormField, HelixSelect],
  templateUrl: './select-widget.html',
  styleUrl: './select-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelixSelectWidget extends HelixFieldWidgetBase<unknown> {
  protected readonly selectOptions = computed(() => [...(this.descriptor().options ?? [])]);
}
