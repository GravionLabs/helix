import { Directive, input } from '@angular/core';

export type HxRadioSize = 'small' | 'medium' | 'large';

/**
 * A native `<input type="radio">` drawn as a Helix radio button (CSS only). Group radios with the same
 * `name` (or a forms API's `formControlName`/`ngModel` name) exactly as with native radios; arrow keys move
 * the selection natively.
 *
 * ```html
 * <label><input type="radio" hxRadio name="plan" value="free" [(ngModel)]="plan" /> Free</label>
 * <label><input type="radio" hxRadio name="plan" value="pro" [(ngModel)]="plan" /> Pro</label>
 * ```
 */
@Directive({
  selector: 'input[hxRadio]',
  exportAs: 'hxRadio',
  host: {
    class: 'hx-radio',
    '[class.hx-radio-sm]': "size() === 'small'",
    '[class.hx-radio-lg]': "size() === 'large'",
  },
})
export class HxRadio {
  readonly size = input<HxRadioSize>('medium');
}
