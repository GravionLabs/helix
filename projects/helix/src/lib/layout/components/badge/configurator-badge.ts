import { Component } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { HelixConfigurator } from '../configurator/configurator';

@Component({
  selector: 'helix-configurator-badge',
  standalone: true,
  imports: [StyleClassModule, HelixConfigurator],
  template: `
    <div
      class="relative"
      style="display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem;"
    >
      <button
        class="layout-topbar-action layout-topbar-action-highlight"
        pStyleClass="@next"
        enterFromClass="hidden"
        enterActiveClass="animate-scalein"
        leaveToClass="hidden"
        leaveActiveClass="animate-fadeout"
        [hideOnOutsideClick]="true"
      >
        <i class="pi pi-palette" style="font-size: 1.4rem;"></i>
      </button>
      <helix-configurator />
    </div>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        cursor: pointer;
        transition: background-color var(--element-transition-duration);
      }
      :host(:hover) {
        background-color: var(--surface-hover);
      }
      .relative {
        cursor: pointer;
      }
      button {
        cursor: pointer;
      }
      button i {
        cursor: inherit;
      }
    `,
  ],
})
export class HelixConfiguratorBadge {}
