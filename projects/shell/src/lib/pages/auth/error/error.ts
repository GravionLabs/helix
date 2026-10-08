import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HxButton } from '@gravionlabs/helix-ui';
import { HelixFloatingConfigurator } from '../../../layout/components/floating-configurator/floating-configurator';

@Component({
  selector: 'helix-error',
  standalone: true,
  imports: [HxButton, RouterModule, HelixFloatingConfigurator],
  templateUrl: './error.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './error.scss',
})
export class HelixError {
  title = input('Error Occured');
  message = input('Requested resource is not available.');
  buttonLabel = input('Go to Dashboard');
  buttonRoute = input('/');
}
