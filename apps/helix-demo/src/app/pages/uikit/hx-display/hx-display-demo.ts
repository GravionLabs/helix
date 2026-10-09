import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  HxAvatar,
  HxAvatarGroup,
  HxBadge,
  HxButton,
  HxChip,
  HxOverlayBadge,
  HxProgressBar,
  HxProgressSpinner,
  HxSkeleton,
  HxTag,
  HxTimeline,
  HxTimelineContent,
  HxTimelineMarker,
  HxTimelineOpposite,
} from '@gravionlabs/helix-ui';

/** `@gravionlabs/helix-ui` display components: Avatar, Badge, Tag, Chip, Skeleton, Progress, Timeline. */
@Component({
  selector: 'app-hx-display-demo',
  standalone: true,
  imports: [
    HxAvatar,
    HxAvatarGroup,
    HxBadge,
    HxOverlayBadge,
    HxButton,
    HxChip,
    HxProgressBar,
    HxProgressSpinner,
    HxSkeleton,
    HxTag,
    HxTimeline,
    HxTimelineContent,
    HxTimelineMarker,
    HxTimelineOpposite,
  ],
  templateUrl: './hx-display-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hx-display-demo.scss',
})
export class HxDisplayDemo {
  readonly chips = signal(['Angular', 'Signals', 'CDK', 'Tokens']);
  remove(name: string) {
    this.chips.update((list) => list.filter((c) => c !== name));
  }
  readonly orders = [
    { status: 'Ordered', date: '15/10/2026 10:30', icon: 'pi pi-shopping-cart' },
    { status: 'Processing', date: '15/10/2026 14:00', icon: 'pi pi-cog' },
    { status: 'Shipped', date: '15/10/2026 16:15', icon: 'pi pi-truck' },
    { status: 'Delivered', date: '16/10/2026 10:00', icon: 'pi pi-check' },
  ];
  readonly progress = signal(40);
  readonly max = Math.max;
  readonly min = Math.min;
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
