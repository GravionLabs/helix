import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnDestroy, type OnInit } from '@angular/core';
import { AvatarModule } from '@gravionlabs/helix-core/avatar';
import { AvatarGroupModule } from '@gravionlabs/helix-core/avatargroup';
import { BadgeModule } from '@gravionlabs/helix-core/badge';
import { ButtonModule } from '@gravionlabs/helix-core/button';
import { ChipModule } from '@gravionlabs/helix-core/chip';
import { OverlayBadgeModule } from '@gravionlabs/helix-core/overlaybadge';
import { ProgressBarModule } from '@gravionlabs/helix-core/progressbar';
import { ScrollPanelModule } from '@gravionlabs/helix-core/scrollpanel';
import { ScrollTopModule } from '@gravionlabs/helix-core/scrolltop';
import { SkeletonModule } from '@gravionlabs/helix-core/skeleton';
import { TagModule } from '@gravionlabs/helix-core/tag';

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
