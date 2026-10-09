import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HxButton, HxCard, HxPanel } from '@gravionlabs/helix-ui';

/** `@gravionlabs/helix-ui` containers: Card, Panel. */
@Component({
  selector: 'app-hx-containers-demo',
  standalone: true,
  imports: [HxCard, HxPanel, HxButton],
  templateUrl: './hx-containers-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hx-containers-demo.scss',
})
export class HxContainersDemo {
  readonly collapsed = signal(false);
}
