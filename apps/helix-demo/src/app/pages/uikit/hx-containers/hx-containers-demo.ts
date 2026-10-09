import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HxButton, HxCard } from '@gravionlabs/helix-ui';

/** `@gravionlabs/helix-ui` containers: Card. */
@Component({
  selector: 'app-hx-containers-demo',
  standalone: true,
  imports: [HxCard, HxButton],
  templateUrl: './hx-containers-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hx-containers-demo.scss',
})
export class HxContainersDemo {}
