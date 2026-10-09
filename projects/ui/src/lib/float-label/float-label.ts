import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
} from '@angular/core';

export type HxFloatLabelVariant = 'over' | 'in' | 'on';

/**
 * A label that sits in the field and moves up when the field has focus or a value. Wrap one control and put
 * its `<label for>` after it.
 *
 * ```html
 * <hx-float-label variant="on">
 *   <input hx-input id="email" [(ngModel)]="email" />
 *   <label for="email">Email</label>
 * </hx-float-label>
 * ```
 *
 * Native inputs and textareas float by `:focus-within` and `:placeholder-shown` (an input without a
 * placeholder gets a blank one, so the label never sits on top of a hint). The helix-ui components float by
 * the `hx-filled` class they set while they hold a value. The label stays a real `<label>`.
 */
@Component({
  selector: 'hx-float-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-float-label',
    '[class.hx-float-label-in]': "variant() === 'in'",
    '[class.hx-float-label-on]': "variant() === 'on'",
  },
  template: '<ng-content />',
})
export class HxFloatLabel {
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** `over`: above the field, `in`: inside it (the field gets room), `on`: on its top border. */
  readonly variant = input<HxFloatLabelVariant>('over');

  constructor() {
    afterNextRender(() => {
      for (const field of this.#host.nativeElement.querySelectorAll(
        ':scope > input, :scope > textarea',
      )) {
        if (!field.hasAttribute('placeholder')) field.setAttribute('placeholder', ' ');
      }
    });
  }
}
