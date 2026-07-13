import { Component } from '@angular/core';
import { StyleClassModule } from '@gravionlabs/helix/styleclass';

@Component({
  selector: 'helix-mobile-menu-action',
  standalone: true,
  imports: [StyleClassModule],
  template: `
    <button
      class="layout-topbar-menu-button layout-topbar-action"
      hStyleClass="@next"
      enterFromClass="hidden"
      enterActiveClass="animate-scalein"
      leaveToClass="hidden"
      leaveActiveClass="animate-fadeout"
      [hideOnOutsideClick]="true"
    >
      <i class="pi pi-ellipsis-v"></i>
    </button>
  `,
})
export class HelixMobileMenuAction {}
