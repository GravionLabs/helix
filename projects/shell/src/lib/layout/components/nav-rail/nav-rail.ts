import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  effect,
  inject,
  input,
  type OnDestroy,
  type OnInit,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { LayoutStore } from '../../store/layout.store';
import { HelixNavRailItem } from '../nav-rail-item/nav-rail-item';
import type { HelixNavGroup } from './nav-rail.model';

@Component({
  selector: 'helix-nav-rail',
  standalone: true,
  imports: [CommonModule, HelixNavRailItem, RouterModule],
  templateUrl: './nav-rail.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './nav-rail.scss',
})
export class HelixNavRail implements OnInit, OnDestroy {
  store = inject(LayoutStore);
  router = inject(Router);
  el = inject(ElementRef);
  private sanitizer = inject(DomSanitizer);

  /** Grouped navigation model. Each group renders an optional uppercase section label. */
  model = input<HelixNavGroup[]>([]);

  /** Application title shown in the brand area. Hidden when nav is collapsed. */
  appTitle = input<string>('Helix');

  /**
   * Brand icon: inline SVG (`<svg>…</svg>`) or URL to an SVG file.
   * Falls back to the default hardcoded icon when not provided.
   */
  brandIcon = input<string>();

  protected isInlineSvg = computed(() => this.brandIcon()?.trim().startsWith('<svg') ?? false);

  protected safeBrandIcon = computed(() => {
    const icon = this.brandIcon();
    if (!icon) return null;
    if (this.isInlineSvg()) {
      return this.sanitizer.bypassSecurityTrustHtml(icon);
    }
    return icon;
  });

  private outsideClickListener: ((event: MouseEvent) => void) | null = null;
  private destroy$ = new Subject<void>();

  constructor() {
    effect(() => {
      if (this.store.isDesktop()) {
        if (this.store.overlayMenuActive()) {
          this.bindOutsideClickListener();
        } else {
          this.unbindOutsideClickListener();
        }
      } else {
        if (this.store.mobileMenuActive()) {
          this.bindOutsideClickListener();
        } else {
          this.unbindOutsideClickListener();
        }
      }
    });
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((event) => {
        const navEvent = event as NavigationEnd;
        this.onRouteChange(navEvent.urlAfterRedirects);
      });
    this.onRouteChange(this.router.url);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.unbindOutsideClickListener();
  }

  private onRouteChange(path: string) {
    this.store.setActivePath(path);
    this.store.closeMobileMenu();
  }

  private bindOutsideClickListener() {
    if (!this.outsideClickListener) {
      this.outsideClickListener = (event: MouseEvent) => {
        if (this.isOutsideClicked(event)) {
          this.store.closeMobileMenu();
        }
      };
      document.addEventListener('click', this.outsideClickListener);
    }
  }

  private unbindOutsideClickListener() {
    if (this.outsideClickListener) {
      document.removeEventListener('click', this.outsideClickListener);
      this.outsideClickListener = null;
    }
  }

  private isOutsideClicked(event: MouseEvent): boolean {
    const topbarButtonEl = document.querySelector('.topbar-start > button');
    const railEl = this.el.nativeElement;
    return !(
      railEl?.isSameNode(event.target as Node) ||
      railEl?.contains(event.target as Node) ||
      topbarButtonEl?.isSameNode(event.target as Node) ||
      topbarButtonEl?.contains(event.target as Node)
    );
  }
}
