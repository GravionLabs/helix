import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HelixDisclosure } from '../../../disclosure';
import { HelixConfigurator } from '../../configurator/configurator';

@Component({
  selector: 'helix-configurator-action',
  standalone: true,
  imports: [HelixDisclosure, HelixConfigurator],
  template: `
    <div
      class="relative"
      style="display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem;"
    >
      <button
        type="button"
        class="layout-topbar-action layout-topbar-action-highlight"
        [attr.aria-label]="label()"
        helixDisclosure
        helixDisclosureAnimate
      >
        <i class="pi pi-palette" style="font-size: 1.4rem;"></i>
      </button>
      <helix-configurator />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
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
export class HelixConfiguratorAction {
  label = input('Configure theme');
}
