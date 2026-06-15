import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import type { MenuItem } from 'primeng/api';
import type { HelixRouteMenuItem } from '../../route-menu.model';
import { LayoutStore } from '../../store/layout.store';
import { HelixFooter } from '../footer/footer';
import { HelixSidebar } from '../sidebar/sidebar';
import { HelixTopbar } from '../topbar/topbar';

@Component({
  selector: 'helix-app-layout',
  standalone: true,
  imports: [CommonModule, HelixTopbar, HelixSidebar, RouterModule, HelixFooter],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HelixAppLayout {
  appTitle = input('SAKAI');

  /**
   * Optional menu model. When provided, overrides the HELIX_MENU_MODEL token.
   * Also auto-populated from ActivatedRoute.data['menu'] when used as a route component.
   */
  menu = input<HelixRouteMenuItem[]>([]);

  store = inject(LayoutStore);
  private activatedRoute = inject(ActivatedRoute);

  /** Resolved menu: input takes priority, then route data, then empty (token fallback in HelixSidebar). */
  protected effectiveMenu = computed<MenuItem[]>(() => {
    const inputMenu = this.menu();
    if (inputMenu.length > 0) return inputMenu;
    // biome-ignore lint/complexity/useLiteralKeys: TS index signature access requires bracket notation
    return (this.activatedRoute.snapshot.data['menu'] as HelixRouteMenuItem[] | undefined) ?? [];
  });

  constructor() {
    effect(() => {
      if (this.store.mobileMenuActive()) {
        document.body.classList.add('blocked-scroll');
      } else {
        document.body.classList.remove('blocked-scroll');
      }
    });
  }

  containerClass = computed(() => ({
    'layout-overlay': this.store.menuMode() === 'overlay',
    'layout-static': this.store.menuMode() === 'static',
    'layout-static-inactive':
      this.store.staticMenuDesktopInactive() && this.store.menuMode() === 'static',
    'layout-overlay-active': this.store.overlayMenuActive(),
    'layout-mobile-active': this.store.mobileMenuActive(),
    'layout-sidebar-collapsed': this.store.isCollapsed(),
  }));
}
