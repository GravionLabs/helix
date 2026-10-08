import { Directive } from '@angular/core';

/**
 * A native `<input type="checkbox">` with `role="switch"`, drawn as a Helix toggle switch (CSS only).
 * Use it for a setting that takes effect immediately; label it with the setting's name, not the action.
 *
 * ```html
 * <label><input type="checkbox" hx-switch [(ngModel)]="darkMode" /> Dark mode</label>
 * ```
 */
@Directive({
  selector: 'input[hx-switch]',
  exportAs: 'hx-switch',
  host: {
    class: 'hx-switch',
    role: 'switch',
  },
})
export class HxSwitch {}
