import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HelixFormField } from '@gravionlabs/helix-shell';
import { HxInputNumber } from '@gravionlabs/helix-ui';
import { HelixFieldWidgetBase } from '../widget-base';

/** Built-in widget for numeric fields. */
@Component({
  selector: 'helix-number-widget',
  standalone: true,
  imports: [HelixFormField, HxInputNumber],
  templateUrl: './number-widget.html',
  styleUrl: './number-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelixNumberWidget extends HelixFieldWidgetBase<number | null> {}
