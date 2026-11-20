import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A bar that groups actions in a start, a center and an end area. It wraps on small screens.
 *
 * ```html
 * <hx-toolbar>
 *   <button hxToolbarStart hx-button>New</button>
 *   <span hxToolbarCenter>3 selected</span>
 *   <button hxToolbarEnd hx-button>Export</button>
 * </hx-toolbar>
 * ```
 *
 * It is a plain group with no `role="toolbar"`: that role promises one tab stop and arrow-key navigation, which
 * this component does not do, so every control keeps its own tab stop.
 */
@Component({
  selector: 'hx-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-toolbar' },
  templateUrl: './toolbar.html',
})
export class HxToolbar {}
