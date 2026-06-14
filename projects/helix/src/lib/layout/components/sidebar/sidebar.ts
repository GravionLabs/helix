import {
  Component,
  computed,
  ElementRef,
  effect,
  inject,
  input,
  type OnDestroy,
  type OnInit,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import type { MenuItem } from 'primeng/api';
import { filter, Subject, takeUntil } from 'rxjs';
import { HELIX_MENU_MODEL } from '../../menu-model.token';
import { LayoutStore } from '../../store/layout.store';
import { HelixMenu } from '../menu/menu';

@Component({
  selector: 'helix-sidebar',
  standalone: true,
  imports: [HelixMenu, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class HelixSidebar implements OnInit, OnDestroy {
  store = inject(LayoutStore);
  router = inject(Router);
  el = inject(ElementRef);

  /** Optional menu model passed by the parent (e.g. HelixAppLayout). */
  menu = input<MenuItem[]>([]);

  private tokenMenu = inject(HELIX_MENU_MODEL);

  /** Uses the bound input if provided, otherwise falls back to the DI token. */
  protected effectiveMenu = computed<MenuItem[]>(() =>
    this.menu().length > 0 ? this.menu() : this.tokenMenu,
  );

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
    const sidebarEl = this.el.nativeElement;
    return !(
      sidebarEl?.isSameNode(event.target as Node) ||
      sidebarEl?.contains(event.target as Node) ||
      topbarButtonEl?.isSameNode(event.target as Node) ||
      topbarButtonEl?.contains(event.target as Node)
    );
  }
}
