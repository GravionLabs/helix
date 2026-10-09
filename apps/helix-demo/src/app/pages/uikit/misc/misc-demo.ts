import {
  ChangeDetectionStrategy,
  Component,
  type OnDestroy,
  type OnInit,
  signal,
} from '@angular/core';
import {
  HxAvatar,
  HxAvatarGroup,
  HxBadge,
  HxButton,
  HxChip,
  HxOverlayBadge,
  HxProgressBar,
  HxSkeleton,
  HxTag,
} from '@gravionlabs/helix-ui';

/** Small display components of `@gravionlabs/helix-ui` (the scroll panel and scroll top are not part of it). */
@Component({
  selector: 'app-misc-demo',
  standalone: true,
  imports: [
    HxProgressBar,
    HxBadge,
    HxOverlayBadge,
    HxAvatar,
    HxAvatarGroup,
    HxTag,
    HxChip,
    HxButton,
    HxSkeleton,
  ],
  templateUrl: './misc-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './misc-demo.scss',
})
export class MiscDemo implements OnInit, OnDestroy {
  readonly value = signal(0);
  #interval: ReturnType<typeof setInterval> | undefined;

  readonly avatars = ['amyelsner', 'asiyajavayant', 'onyamalimba', 'ionibowcher', 'xuxuefeng'];
  readonly avatarBase = 'https://primefaces.org/cdn/primeng/images/demo/avatar/';

  ngOnInit() {
    this.#interval = setInterval(() => {
      const next = Math.min(100, this.value() + Math.floor(Math.random() * 10) + 1);
      this.value.set(next);
      if (next >= 100) clearInterval(this.#interval);
    }, 2000);
  }

  ngOnDestroy() {
    clearInterval(this.#interval);
  }
}
