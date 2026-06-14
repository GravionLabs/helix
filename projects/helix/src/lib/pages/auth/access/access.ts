import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { HelixFloatingConfigurator } from '../../../layout/components/floating-configurator/floating-configurator';

@Component({
  selector: 'helix-access',
  standalone: true,
  imports: [ButtonModule, RouterModule, RippleModule, HelixFloatingConfigurator],
  templateUrl: './access.html',
  styleUrl: './access.scss',
})
export class HelixAccess {
  title = input('Access Denied');
  message = input('You do not have the necessary permisions. Please contact admins.');
  buttonLabel = input('Go to Dashboard');
  buttonRoute = input('/');
}
