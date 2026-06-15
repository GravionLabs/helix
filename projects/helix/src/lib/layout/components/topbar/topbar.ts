import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import type { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { StyleClassModule } from 'primeng/styleclass';
import { helixBreadcrumbsFromRoutes } from '../../breadcrumb-utils';
import { LayoutStore } from '../../store/layout.store';
import { HelixConfigurator } from '../configurator/configurator';
import type { HelixTopbarAction } from './topbar.model';

export type { HelixTopbarAction } from './topbar.model';

const DEFAULT_ACTIONS: HelixTopbarAction[] = [
  { icon: 'pi pi-calendar', label: 'Calendar' },
  { icon: 'pi pi-inbox', label: 'Messages' },
  { icon: 'pi pi-user', label: 'Profile' },
];

@Component({
  selector: 'helix-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, HelixConfigurator, Breadcrumb],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class HelixTopbar {
  appTitle = input('SAKAI');
  topbarActions = input<HelixTopbarAction[]>(DEFAULT_ACTIONS);
  breadcrumbs = input<MenuItem[] | undefined>(undefined);

  store = inject(LayoutStore);
  private route = inject(ActivatedRoute);

  protected effectiveBreadcrumbs = computed<MenuItem[]>(() => {
    const input = this.breadcrumbs();
    if (input !== undefined) return input;
    return helixBreadcrumbsFromRoutes(this.route);
  });

  protected showBreadcrumbs = computed(() => this.effectiveBreadcrumbs().length > 1);
}
