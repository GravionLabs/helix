import { booleanAttribute, Directive, input } from '@angular/core';

export type HxInputSize = 'small' | 'medium' | 'large';
export type HxInputVariant = 'outlined' | 'filled';

/**
 * A native `<input>` or `<textarea>` styled as a Helix text field. It works with template-driven forms,
 * reactive forms and signal forms unchanged: the element stays a native control.
 *
 * ```html
 * <label for="name">Name</label>
 * <input hx-input id="name" [(ngModel)]="name" />
 * <textarea hx-input variant="filled" rows="4"></textarea>
 * <input hx-input [attr.aria-invalid]="invalid() ? 'true' : null" aria-describedby="name-error" />
 * ```
 *
 * The invalid look comes from `aria-invalid="true"` (set it yourself or let the forms API do it) and from
 * Angular's `ng-invalid ng-touched` classes. Always give a field a visible `<label>`; a placeholder is a hint.
 */
@Directive({
  selector: 'input[hx-input], textarea[hx-input]',
  exportAs: 'hx-input',
  host: {
    class: 'hx-input',
    '[class.hx-input-filled]': "variant() === 'filled'",
    '[class.hx-input-sm]': "size() === 'small'",
    '[class.hx-input-lg]': "size() === 'large'",
    '[class.hx-input-fluid]': 'fluid()',
  },
})
export class HxInput {
  /** `outlined` (default) or a tinted `filled` field. */
  readonly variant = input<HxInputVariant>('outlined');

  readonly size = input<HxInputSize>('medium');

  /** Takes the full width of the container. */
  readonly fluid = input(false, { transform: booleanAttribute });
}
