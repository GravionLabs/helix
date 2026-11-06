import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { HxInput } from '@gravionlabs/helix-ui';

/** Search field of the topbar. Emits the typed text on every input. */
@Component({
  selector: 'helix-search-action',
  standalone: true,
  imports: [HxInput],
  template: `
    <input
      hx-input
      type="search"
      autocomplete="off"
      class="helix-search-action-input"
      [attr.aria-label]="label()"
      [placeholder]="placeholder()"
      (input)="search.emit($any($event.target).value)"
    />
  `,
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
  readonly search = output<string>();
}
