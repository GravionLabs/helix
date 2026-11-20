import { booleanAttribute, ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { nextId } from '../internal/ids';

/**
 * A native `<fieldset>` with a `<legend>` that groups related controls and can collapse.
 *
 * ```html
 * <hx-fieldset legend="Shipping address" toggleable [(collapsed)]="closed">
 *   <label for="street">Street</label> <input hx-input id="street" />
 * </hx-fieldset>
 * ```
 *
 * When `toggleable`, the legend holds a `<button>` with `aria-expanded` and `aria-controls`; the content is `inert`
 * while collapsed so its controls leave the tab order. Expanding and collapsing is animated unless the user
 * prefers reduced motion. Legend and fieldset keep their native meaning for assistive technology.
 */
@Component({
  selector: 'hx-fieldset',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-fieldset',
    '[class.hx-fieldset-toggleable]': 'toggleable()',
    '[class.hx-fieldset-collapsed]': 'isCollapsed()',
  },
  templateUrl: './fieldset.html',
})
export class HxFieldset {
  /** The legend text. */
  readonly legend = input('');
  /** The legend gets a button that collapses and expands the content. */
  readonly toggleable = input(false, { transform: booleanAttribute });
  /** Whether the content is collapsed (only a `toggleable` fieldset collapses). */
  readonly collapsed = model(false);

  protected readonly contentId = nextId('hx-fieldset-content');
  protected isCollapsed(): boolean {
    return this.toggleable() && this.collapsed();
  }

  protected toggle(): void {
    this.collapsed.set(!this.collapsed());
  }
}
