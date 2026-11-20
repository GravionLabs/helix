import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { HxInput } from '@gravionlabs/helix-ui';

/** Search field of the topbar. Emits the typed text on every input. */
@Component({
  selector: 'helix-search-action',
  standalone: true,
  imports: [HxInput],
  templateUrl: './search-action.html',
  host: { style: 'display: flex; flex: 1 1 auto; min-width: 0;' },
  styles: [
    `
      .helix-search-action-input {
        flex: 1 1 auto;
        min-width: 0;
        height: var(--helix-control-height, 32px);
        padding-block: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class HelixSearchAction {
  placeholder = input('Search');
  label = input('Search');
  // oxlint-disable-next-line @angular-eslint/no-output-native -- released public output name; a rename breaks consumers
  readonly search = output<string>();
}
