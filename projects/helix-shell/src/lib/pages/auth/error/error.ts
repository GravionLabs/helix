import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { HelixFloatingConfigurator } from '../../../layout/components/floating-configurator/floating-configurator';

@Component({
  selector: 'helix-error',
  standalone: true,
  imports: [ButtonModule, RippleModule, RouterModule, HelixFloatingConfigurator],
  templateUrl: './error.html',
  styleUrl: './error.scss',
})
export class HelixError {
  title = input('Error Occured');
  message = input('Requested resource is not available.');
  buttonLabel = input('Go to Dashboard');
  buttonRoute = input('/');
}
