import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HxBadge, HxButton, HxChip, HxOverlayBadge, HxTag } from '@gravionlabs/helix-ui';

/** `@gravionlabs/helix-ui` display components: Badge, Tag, Chip. */
@Component({
  selector: 'app-hx-display-demo',
  standalone: true,
  imports: [HxBadge, HxOverlayBadge, HxButton, HxChip, HxTag],
  templateUrl: './hx-display-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hx-display-demo.scss',
})
export class HxDisplayDemo {
  readonly chips = signal(['Angular', 'Signals', 'CDK', 'Tokens']);
  remove(name: string) {
    this.chips.update((list) => list.filter((c) => c !== name));
  }
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
