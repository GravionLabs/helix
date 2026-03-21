import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { GvFloatingConfigurator } from '../../../../layout/components/floating-configurator/floating-configurator';

@Component({
  selector: 'gv-topbar-widget',
  standalone: true,
  imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, GvFloatingConfigurator],
  templateUrl: './topbar-widget.html',
  styleUrl: './topbar-widget.scss',
})
export class GvTopbarWidget {
  constructor(public router: Router) {}
}
