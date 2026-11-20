import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HelixDisclosure } from '../../../disclosure';

@Component({
  selector: 'helix-mobile-menu-action',
  standalone: true,
  imports: [HelixDisclosure],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './mobile-menu-action.html',
})
export class HelixMobileMenuAction {
  label = input('More actions');
}
