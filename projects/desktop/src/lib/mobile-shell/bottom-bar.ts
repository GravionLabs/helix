import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  type TemplateRef,
} from '@angular/core';
import type { HxActivityBarItem } from '../activity-bar/activity-bar';

/** The most items a bottom bar shows; more do not fit a phone. */
export const HX_BOTTOM_BAR_MAX_ITEMS = 5;

/** An item of the bottom bar: the same shape as an activity bar item. */
export type HxBottomBarItem = HxActivityBarItem;

/**
 * The tab bar at the bottom of the mobile shell: up to five views or actions, each a touch target of at
 * least 44 pt. It has no tooltips. The bottom safe area (home indicator) is part of its padding.
 *
 * ```html
 * <hx-bottom-bar [items]="items" [activeId]="activeId()" (selected)="select($event)" />
 * ```
 */
@Component({
  selector: 'hx-bottom-bar',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-bottom-bar', role: 'toolbar', '[attr.aria-label]': 'label()' },
  template: `
    @for (item of visible(); track item.id) {
      <button
        type="button"
        class="hx-bottom-bar-item"
        [class.hx-bottom-bar-active]="isActive(item)"
        [attr.data-id]="item.id"
        [attr.aria-label]="item.label"
        [attr.aria-pressed]="item.kind === 'action' ? null : isActive(item)"
        (click)="selected.emit(item.id)"
      >
        <span class="hx-bottom-bar-icon" aria-hidden="true">
          @if (asTemplate(item.icon); as tpl) {
            <ng-container [ngTemplateOutlet]="tpl" />
          } @else {
            <span [class]="item.icon"></span>
          }
        </span>
        <span class="hx-bottom-bar-label">{{ item.label }}</span>
        @if (item.badge !== undefined && item.badge !== null) {
          <span class="hx-bottom-bar-badge" [class.hx-bottom-bar-badge-dot]="item.badge === true">{{
            item.badge === true ? '' : item.badge
          }}</span>
        }
      </button>
    }
  `,
})
export class HxBottomBar {
  /** The views and actions; only the first five are shown. */
  readonly items = input.required<readonly HxBottomBarItem[]>();
  readonly activeId = input<string | null>(null);
  readonly label = input('Views');

  /** Emits the id of the selected view or the activated action. */
  readonly selected = output<string>();

  protected readonly visible = computed(() => this.items().slice(0, HX_BOTTOM_BAR_MAX_ITEMS));

  protected isActive(item: HxBottomBarItem): boolean {
    return item.kind !== 'action' && item.id === this.activeId();
  }

  protected asTemplate(icon: HxBottomBarItem['icon']): TemplateRef<unknown> | null {
    return typeof icon === 'string' ? null : icon;
  }
}
