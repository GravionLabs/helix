import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import type { MenuItem } from '@gravionlabs/helix/api';
import type { Environment } from '../../../ui/badge/environment-badge';
import type { HelixRouteMenuItem } from '../../route-menu.model';
import { LayoutStore } from '../../store/layout.store';
import { HelixNavRail } from '../nav-rail/nav-rail';
import { helixNavGroupsFromMenu } from '../nav-rail/nav-rail.model';
import { HelixStatusBar } from '../status-bar/status-bar';
import type { HelixStatusBarTone, HelixStatusBarVersion } from '../status-bar/status-bar.model';
import { HelixTopbar } from '../topbar/topbar';
import type { HelixTopbarAction, HelixTopbarItem } from '../topbar/topbar.model';

@Component({
  selector: 'helix-app-layout',
  standalone: true,
  imports: [CommonModule, HelixTopbar, HelixNavRail, RouterModule, HelixStatusBar],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HelixAppLayout {
  appTitle = input('Helix');
  environment = input<Environment | undefined>();

  /** Topbar items. When provided, overrides the default darkmode / configurator / mobile items. */
  topbarItems = input<HelixTopbarItem[] | undefined>();

  /** Topbar actions rendered in the right-side dropdown. */
  topbarActions = input<HelixTopbarAction[] | undefined>();

  /**
   * Nav-rail brand icon: inline SVG (`<svg>…</svg>`) or a URL to an SVG file.
   * Falls back to the default hardcoded icon when not provided.
   */
  brandIcon = input<string>();

  /** Status bar inputs */
  statusBarEnvironment = input<string | undefined>();
  statusBarNote = input<string | undefined>();
  statusBarTone = input<HelixStatusBarTone>('neutral');
  statusBarVersions = input<HelixStatusBarVersion[]>([]);
  statusBarBrand = input('');

  /**
   * Menu model. When provided, overrides route data.
   * Also auto-populated from ActivatedRoute.data['menu'] when used as a route component.
   */
  menu = input<HelixRouteMenuItem[]>([]);

  private static readonly DEFAULT_TOP_ACTIONS: HelixTopbarAction[] = [
    { icon: 'pi pi-calendar', label: 'Calendar' },
    { icon: 'pi pi-inbox', label: 'Messages' },
    { icon: 'pi pi-user', label: 'Profile' },
  ];

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
    const custom = this.topbarItems();
    if (custom !== undefined) return custom;
    return [{ type: 'darkmode' }, { type: 'configurator' }, { type: 'mobile' }];
  });

  protected effectiveTopbarActions = computed(
    () => this.topbarActions() ?? HelixAppLayout.DEFAULT_TOP_ACTIONS,
  );

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
