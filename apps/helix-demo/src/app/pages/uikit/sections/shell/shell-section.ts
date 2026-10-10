import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HelixEmptyState, HelixPageHeader, HelixStatCard } from '@gravionlabs/helix-shell';
import {
  type HxBreadcrumbItem,
  HxButton,
  type HxColumn,
  HxDataTable,
  HxTableEmpty,
} from '@gravionlabs/helix-ui';

/** `@gravionlabs/helix-shell` wrappers: Page header, Stat card, Empty state. */
@Component({
  selector: 'app-shell-section',
  standalone: true,
  imports: [HelixEmptyState, HelixPageHeader, HelixStatCard, HxButton, HxDataTable, HxTableEmpty],
  templateUrl: './shell-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './shell-section.scss',
})
export class ShellSection {
  readonly columns: HxColumn[] = [
    { field: 'name', header: 'Name' },
    { field: 'amount', header: 'Amount', align: 'right' },
  ];
  readonly crumbs: HxBreadcrumbItem[] = [
    { label: 'Finance', routerLink: '/uikit/topbar' },
    { label: 'Invoices' },
  ];
}
