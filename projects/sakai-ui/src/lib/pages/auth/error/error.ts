import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { GvFloatingConfigurator } from '../../../layout/components/floating-configurator/floating-configurator';

@Component({
  selector: 'gv-error',
  standalone: true,
  imports: [ButtonModule, RippleModule, RouterModule, GvFloatingConfigurator],
  templateUrl: './error.html',
  styleUrl: './error.scss',
})
export class GvError {
  title = input('Error Occured');
  message = input('Requested resource is not available.');
  buttonLabel = input('Go to Dashboard');
  buttonRoute = input('/');
}
