import { Component, input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { GvFloatingConfigurator } from '../../../../layout/components/floating-configurator/floating-configurator';
import { GvNavLink } from '../../landing.model';

const DEFAULT_NAV_LINKS: GvNavLink[] = [
  { label: 'Home', route: '/landing', fragment: 'home' },
  { label: 'Features', route: '/landing', fragment: 'features' },
  { label: 'Highlights', route: '/landing', fragment: 'highlights' },
  { label: 'Pricing', route: '/landing', fragment: 'pricing' },
];

@Component({
  selector: 'gv-topbar-widget',
  standalone: true,
  imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, GvFloatingConfigurator],
  templateUrl: './topbar-widget.html',
  styleUrl: './topbar-widget.scss',
})
export class GvTopbarWidget {
  navLinks = input<GvNavLink[]>(DEFAULT_NAV_LINKS);
  loginLabel = input('Login');
  loginRoute = input('/auth/login');
  registerLabel = input('Register');
  registerRoute = input('/auth/login');

  constructor(public router: Router) {}
}
