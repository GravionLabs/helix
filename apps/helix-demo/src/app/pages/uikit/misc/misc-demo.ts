import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnDestroy, type OnInit } from '@angular/core';
import { AvatarModule } from '@helix/core/avatar';
import { AvatarGroupModule } from '@helix/core/avatargroup';
import { BadgeModule } from '@helix/core/badge';
import { ButtonModule } from '@helix/core/button';
import { ChipModule } from '@helix/core/chip';
import { OverlayBadgeModule } from '@helix/core/overlaybadge';
import { ProgressBarModule } from '@helix/core/progressbar';
import { ScrollPanelModule } from '@helix/core/scrollpanel';
import { ScrollTopModule } from '@helix/core/scrolltop';
import { SkeletonModule } from '@helix/core/skeleton';
import { TagModule } from '@helix/core/tag';

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
