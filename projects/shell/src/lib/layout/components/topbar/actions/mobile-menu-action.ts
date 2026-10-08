import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HelixDisclosure } from '../../../disclosure';

@Component({
  selector: 'helix-mobile-menu-action',
  standalone: true,
  imports: [HelixDisclosure],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      type="button"
      class="layout-topbar-menu-button layout-topbar-action"
      [attr.aria-label]="label()"
      helixDisclosure
      helixDisclosureAnimate
    >
      <i class="pi pi-ellipsis-v"></i>
    </button>
  `,
})
export class HelixMobileMenuAction {
  label = input('More actions');
}
