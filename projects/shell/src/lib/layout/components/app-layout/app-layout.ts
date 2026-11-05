import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  type ElementRef,
  inject,
  input,
  type TemplateRef,
  ViewEncapsulation,
  viewChild,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import type { HxMenuItem } from '@gravionlabs/helix-ui';
import type { EnvironmentValue } from '../../../ui/badge/environment-badge';
import type { HelixRouteMenuItem } from '../../route-menu.model';
import { LayoutStore } from '../../store/layout.store';
import { HelixNavRail } from '../nav-rail/nav-rail';
import type { HelixNavGroup } from '../nav-rail/nav-rail.model';
import { type HelixNavStyle, helixNavGroupsFromMenu } from '../nav-rail/nav-rail.model';
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
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class HelixAppLayout {
  appTitle = input('Helix');
  environment = input<EnvironmentValue | string | undefined>();

  /** Page title of the header where there is no breadcrumb trail. Defaults to the route title. */
  pageTitle = input<string | undefined>();

  /** Global actions of the nav rail footer. When provided, overrides the default darkmode / configurator / mobile items. */
  topbarItems = input<HelixTopbarItem[] | undefined>();

  /** Entries of the ellipsis menu in the nav rail footer. */
  topbarActions = input<HelixTopbarAction[] | undefined>();

  /**
   * Nav-rail brand icon: inline SVG (`<svg>…</svg>`) or a URL to an SVG file.
   * Falls back to the default hardcoded icon when not provided.
   */
  brandIcon = input<string>();

  /** Status bar inputs */
  statusBarEnvironment = input<EnvironmentValue | string | undefined>();
  statusBarNote = input<string | TemplateRef<unknown> | undefined>();
  statusBarTone = input<HelixStatusBarTone>('neutral');
  statusBarVersions = input<HelixStatusBarVersion[]>([]);
  statusBarBrand = input('');

  /**
   * Menu model. When provided, overrides route data.
   * Also auto-populated from ActivatedRoute.data['menu'] when used as a route component.
   */
  menu = input<HelixRouteMenuItem[]>([]);

  /**
   * Nav rail style. `'sections'` (default) renders top-level items with children as
   * always-open section headings; `'tree'` keeps them as expandable folders.
   */
  navStyle = input<HelixNavStyle>('sections');

  /** Explicit nav groups. When provided, they win over the mapping of `menu`. */
  navGroups = input<HelixNavGroup[] | undefined>();

  private static readonly DEFAULT_TOP_ACTIONS: HelixTopbarAction[] = [
    { icon: 'pi pi-calendar', label: 'Calendar' },
    { icon: 'pi pi-inbox', label: 'Messages' },
    { icon: 'pi pi-user', label: 'Profile' },
  ];

  store = inject(LayoutStore);
  private activatedRoute = inject(ActivatedRoute);

  /** Resolved menu: input takes priority, then route data, then empty. */
  protected effectiveMenu = computed<HxMenuItem[]>(() => {
    const inputMenu = this.menu();
    if (inputMenu.length > 0) return inputMenu;
    return (this.activatedRoute.snapshot.data['menu'] as HelixRouteMenuItem[] | undefined) ?? [];
  });

  protected effectiveNavGroups = computed(
    () =>
      this.navGroups() ??
      helixNavGroupsFromMenu(this.effectiveMenu() as HelixRouteMenuItem[], this.navStyle()),
  );

  protected effectiveEnvironment = computed<EnvironmentValue | string | undefined>(() => {
    const input = this.environment();
    if (input !== undefined) return input;
    return this.activatedRoute.snapshot.data['environment'];
  });

  protected effectiveItems = computed<HelixTopbarItem[]>(() => {
    const custom = this.topbarItems();
    if (custom !== undefined) return custom;
    return [{ type: 'darkmode' }, { type: 'configurator' }, { type: 'mobile' }];
  });

  protected effectiveTopbarActions = computed(
    () => this.topbarActions() ?? HelixAppLayout.DEFAULT_TOP_ACTIONS,
  );

  /** The scrolling content panel; the document itself no longer scrolls. */
  private mainPanel = viewChild<ElementRef<HTMLElement>>('mainPanel');

  /** Optional so apps without the Router keep working. */
  private router = inject(Router, { optional: true });

  constructor() {
    this.resetScrollOnNavigation();
  }

  /**
   * The router's own scroll restoration only handles the window. Reset the content panel to the
   * top after each navigation, restore its offset on back/forward and leave fragment links to the
   * browser/router anchor scrolling.
   */
  private resetScrollOnNavigation(): void {
    if (!this.router) return;
    const offsets = new Map<number, number>();
    let currentId = 0;
    let restoreId: number | undefined;
    const sub = this.router.events.subscribe((event) => {
      const panel = this.mainPanel()?.nativeElement;
      if (event instanceof NavigationStart) {
        if (panel && currentId) offsets.set(currentId, panel.scrollTop);
        restoreId =
          event.navigationTrigger === 'popstate' ? event.restoredState?.navigationId : undefined;
      } else if (event instanceof NavigationEnd && panel) {
        currentId = event.id;
        if (event.urlAfterRedirects.includes('#')) return;
        panel.scrollTop = (restoreId !== undefined ? offsets.get(restoreId) : undefined) ?? 0;
        offsets.set(currentId, panel.scrollTop);
      }
    });
    inject(DestroyRef).onDestroy(() => sub.unsubscribe());
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
