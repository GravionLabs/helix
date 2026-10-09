import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Joins the `hx-button`s inside it into one control: the inner corners are square and neighbours share a border.
 *
 * ```html
 * <hx-button-group ariaLabel="Text alignment">
 *   <button hx-button variant="outlined">Left</button>
 *   <button hx-button variant="outlined">Center</button>
 *   <button hx-button variant="outlined">Right</button>
 * </hx-button-group>
 * ```
 *
 * `role="group"`; name it with `ariaLabel` when the buttons only make sense together.
 */
@Component({
  selector: 'hx-button-group',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-button-group', role: 'group', '[attr.aria-label]': 'ariaLabel() || null' },
})
export class HxButtonGroup {
  /** Accessible name of the group. */
  readonly ariaLabel = input<string>();
}
