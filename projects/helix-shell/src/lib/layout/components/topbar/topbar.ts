import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  type OnDestroy,
  type OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import type { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { StyleClassModule } from 'primeng/styleclass';
import { filter, Subject, takeUntil } from 'rxjs';
import { helixBreadcrumbsFromRoutes } from '../../breadcrumb-utils';
import { LayoutStore } from '../../store/layout.store';
import { HelixAlertAction } from './actions/alert-action';
import { HelixConfiguratorAction } from './actions/configurator-action';
import { HelixDarkModeAction } from './actions/dark-mode-action';
import type { HelixTopbarAction, HelixTopbarItem } from './topbar.model';

export type { HelixTopbarAction } from './topbar.model';

const DEFAULT_ACTIONS: HelixTopbarAction[] = [
  { icon: 'pi pi-calendar', label: 'Calendar' },
  { icon: 'pi pi-inbox', label: 'Messages' },
  { icon: 'pi pi-user', label: 'Profile' },
];

const DEFAULT_ITEMS: HelixTopbarItem[] = [
  { type: 'darkmode' },
  { type: 'configurator' },
  { type: 'mobile' },
];

@Component({
  selector: 'helix-topbar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    StyleClassModule,
    HelixAlertAction,
    HelixConfiguratorAction,
    HelixDarkModeAction,
    Breadcrumb,
  ],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class HelixTopbar implements OnInit, OnDestroy {
  appTitle = input('Helix');
  topbarActions = input<HelixTopbarAction[]>(DEFAULT_ACTIONS);
  breadcrumbs = input<MenuItem[] | undefined>(undefined);
  items = input<HelixTopbarItem[]>(DEFAULT_ITEMS);

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

  protected effectiveBreadcrumbs = computed<MenuItem[]>(() => {
    const input = this.breadcrumbs();
    if (input !== undefined) return input;
    this.routeChange();
    return helixBreadcrumbsFromRoutes(this.route);
  });

  protected showBreadcrumbs = computed(() => this.effectiveBreadcrumbs().length > 1);
}
