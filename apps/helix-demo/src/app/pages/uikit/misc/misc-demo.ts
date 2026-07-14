import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnDestroy, type OnInit } from '@angular/core';
import { AvatarModule } from '@gravionlabs/helix/avatar';
import { AvatarGroupModule } from '@gravionlabs/helix/avatargroup';
import { BadgeModule } from '@gravionlabs/helix/badge';
import { ButtonModule } from '@gravionlabs/helix/button';
import { ChipModule } from '@gravionlabs/helix/chip';
import { OverlayBadgeModule } from '@gravionlabs/helix/overlaybadge';
import { ProgressBarModule } from '@gravionlabs/helix/progressbar';
import { ScrollPanelModule } from '@gravionlabs/helix/scrollpanel';
import { ScrollTopModule } from '@gravionlabs/helix/scrolltop';
import { SkeletonModule } from '@gravionlabs/helix/skeleton';
import { TagModule } from '@gravionlabs/helix/tag';

@Component({
  selector: 'app-misc-demo',
  standalone: true,
  imports: [
    CommonModule,
    ProgressBarModule,
    BadgeModule,
    AvatarModule,
    ScrollPanelModule,
    TagModule,
    ChipModule,
    ButtonModule,
    SkeletonModule,
    AvatarGroupModule,
    ScrollTopModule,
    OverlayBadgeModule,
  ],
  templateUrl: './misc-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './misc-demo.scss',
})
export class MiscDemo implements OnInit, OnDestroy {
  value = 0;

  interval: any;

  ngOnInit() {
    this.interval = setInterval(() => {
      this.value = this.value + Math.floor(Math.random() * 10) + 1;
      if (this.value >= 100) {
        this.value = 100;
        clearInterval(this.interval);
      }
    }, 2000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
