import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import type { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { StyleClassModule } from 'primeng/styleclass';
import { helixBreadcrumbsFromRoutes } from '../../breadcrumb-utils';
import { LayoutStore } from '../../store/layout.store';
import { type Environment, HelixEnvironmentBadge } from '../../../ui/badge/environment-badge';
import type { HelixTopbarAction, HelixTopbarItem } from './topbar.model';
import { HelixAlertAction } from './actions/alert-action';
import { HelixConfiguratorAction } from './actions/configurator-action';
import { HelixDarkModeAction } from './actions/dark-mode-action';

export type { Environment } from '../../../ui/badge/environment-badge';
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
    HelixEnvironmentBadge,
    Breadcrumb,
  ],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class HelixTopbar {
  appTitle = input('Helix');
  topbarActions = input<HelixTopbarAction[]>(DEFAULT_ACTIONS);
  breadcrumbs = input<MenuItem[] | undefined>(undefined);
  environment = input<Environment | undefined>();
  items = input<HelixTopbarItem[]>(DEFAULT_ITEMS);

  store = inject(LayoutStore);
  private route = inject(ActivatedRoute);

  protected effectiveBreadcrumbs = computed<MenuItem[]>(() => {
    const input = this.breadcrumbs();
    if (input !== undefined) return input;
    return helixBreadcrumbsFromRoutes(this.route);
  });

  protected showBreadcrumbs = computed(() => this.effectiveBreadcrumbs().length > 1);
}
