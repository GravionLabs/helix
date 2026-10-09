import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HxMessage } from '@gravionlabs/helix-ui';

/** `@gravionlabs/helix-ui` messages and overlays: Message. */
@Component({
  selector: 'app-hx-overlays-demo',
  standalone: true,
  imports: [HxMessage],
  templateUrl: './hx-overlays-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hx-overlays-demo.scss',
})
export class HxOverlaysDemo {}
