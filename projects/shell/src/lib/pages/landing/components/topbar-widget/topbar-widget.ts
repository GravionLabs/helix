import { ChangeDetectionStrategy, Component, input } from '@angular/core';
// biome-ignore lint/style/useImportType: DI token, must be value import
import { Router, RouterModule } from '@angular/router';
import { HxButton } from '@gravionlabs/helix-ui';
import { HelixFloatingConfigurator } from '../../../../layout/components/floating-configurator/floating-configurator';
import { HelixDisclosure } from '../../../../layout/disclosure';
import type { HelixNavLink } from '../../landing.model';

const DEFAULT_NAV_LINKS: HelixNavLink[] = [
  { label: 'Home', route: '/landing', fragment: 'home' },
  { label: 'Features', route: '/landing', fragment: 'features' },
  { label: 'Highlights', route: '/landing', fragment: 'highlights' },
  { label: 'Pricing', route: '/landing', fragment: 'pricing' },
];

@Component({
  selector: 'helix-topbar-widget',
  standalone: true,
  imports: [RouterModule, HxButton, HelixDisclosure, HelixFloatingConfigurator],
  templateUrl: './topbar-widget.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './topbar-widget.scss',
})
export class HelixTopbarWidget {
  navLinks = input<HelixNavLink[]>(DEFAULT_NAV_LINKS);
  menuLabel = input('Menu');
  loginLabel = input('Login');
  loginRoute = input('/auth/login');
  registerLabel = input('Register');
  registerRoute = input('/auth/login');

  constructor(public router: Router) {}
}
