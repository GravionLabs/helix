import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Joins a field with text or button addons into one control. Children: `hx-input`, `hx-select`,
 * `hx-input-number`, `hx-icon-field`, `button[hx-button]` and `hx-input-group-addon`. Inner borders and radii
 * are joined, the outer corners keep the radius.
 *
 * ```html
 * <hx-input-group>
 *   <hx-input-group-addon>https://</hx-input-group-addon>
 *   <input hx-input aria-label="Domain" aria-describedby="scheme" />
 *   <button hx-button>Go</button>
 * </hx-input-group>
 * ```
 *
 * The group has no role of its own. An addon is not part of the field's name: reference it with
 * `aria-describedby` (give the addon an `id`) when it carries information.
 */
@Component({
  selector: 'hx-input-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-input-group' },
  template: '<ng-content />',
})
export class HxInputGroup {}

/** Text or an icon next to a field inside an `hx-input-group`. */
@Component({
  selector: 'hx-input-group-addon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-input-group-addon' },
  template: '<ng-content />',
})
export class HxInputGroupAddon {}
