import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { HelixFormField } from '@gravionlabs/helix-shell';
import { HxSelect } from '@gravionlabs/helix-ui';
import { HelixFieldWidgetBase } from '../widget-base';

/**
 * Built-in widget for enum/select fields — draws an `hx-select` of
 * helix-ui, which is a signal-forms `FormValueControl`.
 */
@Component({
  selector: 'helix-select-widget',
  standalone: true,
  imports: [HelixFormField, HxSelect],
  templateUrl: './select-widget.html',
  styleUrl: './select-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelixSelectWidget extends HelixFieldWidgetBase<unknown> {
  protected readonly selectOptions = computed(() => [...(this.descriptor().options ?? [])]);
}
