import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * The slim bar (26 px) at the top of a desktop app: a start, a centre (title) and an end slot.
 *
 * ```html
 * <hx-app-toolbar slot="toolbar" [windowButtonsInset]="true">
 *   <button slot="start">Back</button>
 *   <span slot="centre">Project</span>
 *   <button slot="end">Share</button>
 * </hx-app-toolbar>
 * ```
 *
 * The bar and its centre carry `data-tauri-drag-region`, so a Tauri window is dragged by them; buttons
 * in the start and end slot are not part of the region. Set `windowButtonsInset` when the title bar is
 * hidden on macOS: the start group then leaves room for the window buttons.
 */
@Component({
  selector: 'hx-app-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-app-toolbar',
    '[class.hx-app-toolbar-inset]': 'windowButtonsInset()',
    'data-tauri-drag-region': '',
  },
  template: `
    <div class="hx-app-toolbar-start"><ng-content select="[slot=start]" /></div>
    <div class="hx-app-toolbar-centre" data-tauri-drag-region><ng-content select="[slot=centre]" /></div>
    <div class="hx-app-toolbar-end"><ng-content select="[slot=end]" /></div>
  `,
})
export class HxAppToolbar {
  /** Reserve room at the start for the macOS window buttons (a hidden title bar). */
  readonly windowButtonsInset = input(false, { transform: booleanAttribute });
}
