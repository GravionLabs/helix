import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  type OnDestroy,
  type OnInit,
  output,
  signal,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import type { HxMenuItem } from '@gravionlabs/helix-ui';
import { HxBreadcrumb } from '@gravionlabs/helix-ui';
import { filter, Subject, takeUntil } from 'rxjs';
import { helixBreadcrumbsFromRoutes, helixPageTitleFromRoutes } from '../../breadcrumb-utils';
import { LayoutStore } from '../../store/layout.store';
import type { AlertItem } from './actions/alert-action';
import { HelixAlertAction } from './actions/alert-action';
import { HelixConfiguratorAction } from './actions/configurator-action';
import { HelixDarkModeAction } from './actions/dark-mode-action';
import { HelixSearchAction } from './actions/search-action';
import {
  HELIX_DEFAULT_TOPBAR_ACTIONS,
  type HelixTopbarActionConfig,
  type HelixTopbarActionPosition,
  helixTopbarActionId,
} from './topbar.model';

/** Viewport width up to which the `center` zone folds into `end`. */
export const HELIX_TOPBAR_NARROW_QUERY = '(max-width: 991px)';

interface ZoneEntry {
  id: string;
  config: HelixTopbarActionConfig;
}

@Component({
  selector: 'helix-topbar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HxBreadcrumb,
    HelixAlertAction,
    HelixConfiguratorAction,
    HelixDarkModeAction,
    HelixSearchAction,
  ],
  templateUrl: './topbar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './topbar.scss',
})
export class HelixTopbar implements OnInit, OnDestroy {
  /** Last-resort page title, shown when the route offers neither breadcrumbs nor a title. */
  appTitle = input('Helix');
  breadcrumbs = input<HxMenuItem[] | undefined>(undefined);
  /** Page title shown where there is no breadcrumb trail. Defaults to the title of the active route. */
  pageTitle = input<string | undefined>(undefined);

  /**
   * Action list. Without input the default toolbar renders (search in the center, dark mode and
   * configurator at the end, alerts when `alerts` has items); `[]` renders no actions.
   */
  actions = input<HelixTopbarActionConfig[] | undefined>(undefined);
  /** Alert items of the `alerts` action. */
  alerts = input<AlertItem[]>([]);
  searchPlaceholder = input('Search');
  /** Text of the `search` action, on every input. */
  readonly search = output<string>();

  store = inject(LayoutStore);
  /** True up to 991px; the `center` actions then render in the `end` zone. */
  protected narrow = signal(false);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  private routeChange = signal(0);

  ngOnInit() {
    this.watchViewport();
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.routeChange.update((n) => n + 1));
  }

  private watchViewport() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia(HELIX_TOPBAR_NARROW_QUERY);
    this.narrow.set(query.matches);
    const onChange = (event: { matches: boolean }) => this.narrow.set(event.matches);
    query.addEventListener('change', onChange);
    this.cleanup = () => query.removeEventListener('change', onChange);
  }

  private cleanup?: () => void;

  ngOnDestroy() {
    this.cleanup?.();
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected effectiveBreadcrumbs = computed<HxMenuItem[]>(() => {
    const input = this.breadcrumbs();
    if (input !== undefined) return input;
    this.routeChange();
    return helixBreadcrumbsFromRoutes(this.route);
  });

  protected showBreadcrumbs = computed(() => this.effectiveBreadcrumbs().length > 1);

  /** Never empty: the `pageTitle` input, else the route title, else the last breadcrumb, else `appTitle`. */
  protected effectiveTitle = computed(() => {
    const explicit = this.pageTitle();
    if (explicit) return explicit;
    this.routeChange();
    const fromRoute = helixPageTitleFromRoutes(this.route);
    if (fromRoute) return fromRoute;
    const crumbs = this.effectiveBreadcrumbs();
    return crumbs[crumbs.length - 1]?.label || this.appTitle();
  });

  protected customTemplate(entry: HelixTopbarActionConfig) {
    return typeof entry.action === 'string' ? null : entry.action.template;
  }

  /** The visible entries per zone, sorted by `order`; on narrow screens `center` joins `end`. */
  protected zones = computed<Record<HelixTopbarActionPosition, ZoneEntry[]>>(() => {
    const explicit = this.actions();
    const hasAlerts = this.alerts().length > 0;
    const list =
      explicit ??
      HELIX_DEFAULT_TOPBAR_ACTIONS.filter((entry) => entry.action !== 'alerts' || hasAlerts);
    const zones: Record<HelixTopbarActionPosition, ZoneEntry[]> = {
      start: [],
      center: [],
      end: [],
    };
    const sorted = list
      .map((config, index) => ({ config, index }))
      .filter(({ config }) => !config.hidden)
      .sort((a, b) => (a.config.order ?? 0) - (b.config.order ?? 0) || a.index - b.index);
    for (const { config } of sorted) {
      let position = config.position ?? 'end';
      if (position === 'center' && this.narrow()) position = 'end';
      zones[position].push({ id: helixTopbarActionId(config), config });
    }
    return zones;
  });
}
