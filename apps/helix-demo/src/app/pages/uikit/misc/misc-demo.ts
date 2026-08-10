import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnDestroy, type OnInit } from '@angular/core';
import { AvatarModule } from '@helix-ui/core/avatar';
import { AvatarGroupModule } from '@helix-ui/core/avatargroup';
import { BadgeModule } from '@helix-ui/core/badge';
import { ButtonModule } from '@helix-ui/core/button';
import { ChipModule } from '@helix-ui/core/chip';
import { OverlayBadgeModule } from '@helix-ui/core/overlaybadge';
import { ProgressBarModule } from '@helix-ui/core/progressbar';
import { ScrollPanelModule } from '@helix-ui/core/scrollpanel';
import { ScrollTopModule } from '@helix-ui/core/scrolltop';
import { SkeletonModule } from '@helix-ui/core/skeleton';
import { TagModule } from '@helix-ui/core/tag';

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
