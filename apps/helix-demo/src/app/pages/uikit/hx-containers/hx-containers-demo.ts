import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HxButton, HxCard, HxFieldset, HxInput, HxPanel } from '@gravionlabs/helix-ui';

/** `@gravionlabs/helix-ui` containers: Card, Panel, Fieldset. */
@Component({
  selector: 'app-hx-containers-demo',
  standalone: true,
  imports: [HxCard, HxPanel, HxFieldset, HxInput, HxButton],
  templateUrl: './hx-containers-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hx-containers-demo.scss',
})
export class HxContainersDemo {
  readonly collapsed = signal(false);
  readonly fieldsetCollapsed = signal(false);
}
