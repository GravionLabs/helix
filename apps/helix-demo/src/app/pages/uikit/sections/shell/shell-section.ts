import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HelixPageHeader } from '@gravionlabs/helix-shell';
import { type HxBreadcrumbItem, HxButton } from '@gravionlabs/helix-ui';

/** `@gravionlabs/helix-shell` wrappers: Page header, Stat card, Empty state. */
@Component({
  selector: 'app-shell-section',
  standalone: true,
  imports: [HelixPageHeader, HxButton],
  templateUrl: './shell-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './shell-section.scss',
})
export class ShellSection {
  readonly crumbs: HxBreadcrumbItem[] = [
    { label: 'Finance', routerLink: '/uikit/topbar' },
    { label: 'Invoices' },
  ];
}
