import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The bottom bar of a desktop app: a start group at the left and an end group at the right.
 *
 * ```html
 * <hx-status-bar>
 *   <hx-status-item slot="start">Ready</hx-status-item>
 *   <hx-status-version slot="end" version="1.4.0" channel="RC" />
 * </hx-status-bar>
 * ```
 *
 * A conditional group of items needs one root node that carries the slot, because content projection
 * selects by attribute and an `@if` with several root nodes projects nothing (NG8011):
 *
 * ```html
 * @if (active()) {
 *   <ng-container ngProjectAs="[slot=end]">
 *     <hx-status-item>Input</hx-status-item>
 *     <hx-status-item>119×46</hx-status-item>
 *   </ng-container>
 * }
 * ```
 *
 * Project items with `slot="start"` or `slot="end"`. The bar has no role of its own: only an item that
 * announces a change sets `role="status"` (see `HxStatusItem`).
 */
@Component({
  selector: 'hx-status-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-status-bar' },
  templateUrl: './status-bar.html',
})
export class HxStatusBar {}
