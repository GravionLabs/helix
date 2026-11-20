import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HelixDisclosure } from '../../../disclosure';
import { HelixConfigurator } from '../../configurator/configurator';

@Component({
  selector: 'helix-configurator-action',
  standalone: true,
  imports: [HelixDisclosure, HelixConfigurator],
  templateUrl: './configurator-action.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--helix-control-height, 32px);
        height: var(--helix-control-height, 32px);
        border-radius: var(--h-border-radius-md);
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
