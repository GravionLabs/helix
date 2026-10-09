import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HxBadge, HxButton, HxOverlayBadge, HxTag } from '@gravionlabs/helix-ui';

/** `@gravionlabs/helix-ui` display components: Badge, Tag. */
@Component({
  selector: 'app-hx-display-demo',
  standalone: true,
  imports: [HxBadge, HxOverlayBadge, HxButton, HxTag],
  templateUrl: './hx-display-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hx-display-demo.scss',
})
export class HxDisplayDemo {
  readonly severities = [
    'primary',
    'secondary',
    'success',
    'info',
    'warn',
    'danger',
    'contrast',
  ] as const;
}
