import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  HxAvatar,
  HxAvatarGroup,
  HxBadge,
  HxButton,
  HxChip,
  HxOverlayBadge,
  HxSkeleton,
  HxTag,
} from '@gravionlabs/helix-ui';

/** `@gravionlabs/helix-ui` display components: Avatar, Badge, Tag, Chip, Skeleton. */
@Component({
  selector: 'app-hx-display-demo',
  standalone: true,
  imports: [HxAvatar, HxAvatarGroup, HxBadge, HxOverlayBadge, HxButton, HxChip, HxSkeleton, HxTag],
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
