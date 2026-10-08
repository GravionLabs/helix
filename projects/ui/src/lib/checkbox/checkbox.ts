import { Directive, input } from '@angular/core';

export type HxCheckboxSize = 'small' | 'medium' | 'large';

/**
 * A native `<input type="checkbox">` drawn as a Helix checkbox (CSS only). It is a real checkbox: `checked`,
 * `indeterminate`, `disabled`, `ngModel`, reactive and signal forms, keyboard and screen readers all work
 * as for any checkbox.
 *
 * ```html
 * <label><input type="checkbox" hx-checkbox [(ngModel)]="agreed" /> I agree</label>
 * <input type="checkbox" hx-checkbox [indeterminate]="some" aria-label="Select all" />
 * ```
 *
 * Put it in a `<label>` with its text (or give it `aria-label`); the invalid look comes from
 * `aria-invalid="true"` and from `ng-invalid ng-touched`.
 */
@Directive({
  selector: 'input[hx-checkbox]',
  exportAs: 'hx-checkbox',
  host: {
    class: 'hx-checkbox',
    '[class.hx-checkbox-sm]': "size() === 'small'",
    '[class.hx-checkbox-lg]': "size() === 'large'",
  },
})
export class HxCheckbox {
  readonly size = input<HxCheckboxSize>('medium');
}
