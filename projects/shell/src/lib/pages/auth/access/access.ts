import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HxButton } from '@gravionlabs/helix-ui';
import { HelixFloatingConfigurator } from '../../../layout/components/floating-configurator/floating-configurator';

@Component({
  selector: 'helix-access',
  standalone: true,
  imports: [HxButton, RouterModule, HelixFloatingConfigurator],
  templateUrl: './access.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './access.scss',
})
export class HelixAccess {
  title = input('Access Denied');
  message = input('You do not have the necessary permisions. Please contact admins.');
  buttonLabel = input('Go to Dashboard');
  buttonRoute = input('/');
}
