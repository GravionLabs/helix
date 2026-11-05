import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  type OnDestroy,
  type OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import type { HxMenuItem } from '@gravionlabs/helix-ui';
import { HxBreadcrumb } from '@gravionlabs/helix-ui';
import { filter, Subject, takeUntil } from 'rxjs';
import { helixBreadcrumbsFromRoutes, helixPageTitleFromRoutes } from '../../breadcrumb-utils';
import { LayoutStore } from '../../store/layout.store';

export type { HelixTopbarAction, HelixTopbarItem } from './topbar.model';

@Component({
  selector: 'helix-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, HxBreadcrumb],
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

  store = inject(LayoutStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  private routeChange = signal(0);

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.routeChange.update((n) => n + 1));
  }

  ngOnDestroy() {
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
}
