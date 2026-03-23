import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { GvRouteMenuItem } from '../../route-menu.model';
import { LayoutStore } from '../../store/layout.store';
import { GvFooter } from '../footer/footer';
import { GvSidebar } from '../sidebar/sidebar';
import { GvTopbar } from '../topbar/topbar';

@Component({
  selector: 'gv-app-layout',
  standalone: true,
  imports: [CommonModule, GvTopbar, GvSidebar, RouterModule, GvFooter],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
  encapsulation: ViewEncapsulation.None,
})
export class GvAppLayout {
  appTitle = input('SAKAI');

  /**
   * Optional menu model. When provided, overrides the GV_MENU_MODEL token.
   * Also auto-populated from ActivatedRoute.data['menu'] when used as a route component.
   */
  menu = input<GvRouteMenuItem[]>([]);

  store = inject(LayoutStore);
  private activatedRoute = inject(ActivatedRoute);

  /** Resolved menu: input takes priority, then route data, then empty (token fallback in GvSidebar). */
  protected effectiveMenu = computed<MenuItem[]>(() => {
    const inputMenu = this.menu();
    if (inputMenu.length > 0) return inputMenu;
    return (this.activatedRoute.snapshot.data['menu'] as GvRouteMenuItem[] | undefined) ?? [];
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
  }));
}
