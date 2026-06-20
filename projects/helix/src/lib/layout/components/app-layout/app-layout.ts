import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import type { MenuItem } from 'primeng/api';
import type { Environment } from '../../../ui/badge/environment-badge';
import type { HelixRouteMenuItem } from '../../route-menu.model';
import { LayoutStore } from '../../store/layout.store';
import { HelixFooter } from '../footer/footer';
import { HelixNavRail } from '../nav-rail/nav-rail';
import { helixNavGroupsFromMenu } from '../nav-rail/nav-rail.model';
import type { AlertItem } from '../topbar/actions/alert-action';
import { HelixTopbar } from '../topbar/topbar';
import type { HelixTopbarItem } from '../topbar/topbar.model';

@Component({
  selector: 'helix-app-layout',
  standalone: true,
  imports: [CommonModule, HelixTopbar, HelixNavRail, RouterModule, HelixFooter],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HelixAppLayout {
  appTitle = input('Helix');
  environment = input<Environment | undefined>();
  alertCount = input(0);
  alerts = input<AlertItem[] | undefined>();

  /**
   * Menu model. When provided, overrides route data.
   * Also auto-populated from ActivatedRoute.data['menu'] when used as a route component.
   */
  menu = input<HelixRouteMenuItem[]>([]);

  store = inject(LayoutStore);
  private activatedRoute = inject(ActivatedRoute);

  /** Resolved menu: input takes priority, then route data, then empty. */
  protected effectiveMenu = computed<MenuItem[]>(() => {
    const inputMenu = this.menu();
    if (inputMenu.length > 0) return inputMenu;
    return (this.activatedRoute.snapshot.data['menu'] as HelixRouteMenuItem[] | undefined) ?? [];
  });

  protected effectiveNavGroups = computed(() =>
    helixNavGroupsFromMenu(this.effectiveMenu() as HelixRouteMenuItem[]),
  );

  protected effectiveEnvironment = computed<Environment | undefined>(() => {
    const input = this.environment();
    if (input !== undefined) return input;
    return this.activatedRoute.snapshot.data['environment'] as Environment | undefined;
  });

  protected effectiveItems = computed<HelixTopbarItem[]>(() => {
    const items: HelixTopbarItem[] = [
      { type: 'darkmode' },
      { type: 'configurator' },
      { type: 'mobile' },
    ];
    const alertCountVal =
      this.alertCount() ||
      (this.activatedRoute.snapshot.data['alertCount'] as number | undefined) ||
      0;
    const alertsVal =
      this.alerts() ?? (this.activatedRoute.snapshot.data['alerts'] as AlertItem[] | undefined);
    if (alertCountVal > 0) {
      items.push({ type: 'alert', badgeCount: alertCountVal, alerts: alertsVal });
    }
    return items;
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
