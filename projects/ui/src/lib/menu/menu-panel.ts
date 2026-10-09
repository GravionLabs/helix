import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HxMenuItem } from '../menu-item';

/**
 * The list of a menu, shared by `hx-menu` and `hx-menubar` (internal): an ARIA menu from `@angular/cdk/menu` whose
 * items are links, buttons or submenu triggers. With `groups` an item at this level that has children and no action of
 * its own is drawn as a group heading above them; elsewhere children open as a submenu.
 */
@Component({
  selector: 'hx-menu-panel',
  imports: [CdkMenu, CdkMenuItem, CdkMenuTrigger, NgTemplateOutlet, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-menu-panel' },
  // The items must be declared inside the element that carries `cdkMenu`: the CDK finds them as content children.
  template: `
    <div cdkMenu class="hx-menu-list" [attr.aria-label]="ariaLabel() ?? null">
    <ng-template #content let-item let-submenu="submenu">
      @if (item.icon) {
        <span class="hx-menu-icon" [class]="item.icon" aria-hidden="true"></span>
      }
      <span class="hx-menu-label">{{ item.label }}</span>
      @if (item.badge) {
        <span class="hx-menu-badge">{{ item.badge }}</span>
      }
      @if (submenu) {
        <span class="hx-menu-submenu-icon" aria-hidden="true"></span>
      }
    </ng-template>

    <ng-template #entries let-list let-top="top">
      @for (item of visible(list); track $index) {
        @if (item.separator) {
          <div class="hx-menu-separator" role="separator"></div>
        } @else if (top && item.items?.length && !item.command && !item.routerLink && !item.url) {
          <div class="hx-menu-group" role="group" [attr.aria-label]="item.label">
            <div class="hx-menu-heading" role="presentation">{{ item.label }}</div>
            <ng-container [ngTemplateOutlet]="entries" [ngTemplateOutletContext]="{ $implicit: item.items, top: false }" />
          </div>
        } @else if (item.items?.length) {
          <button
            type="button"
            class="hx-menu-item hx-menu-item-submenu"
            cdkMenuItem
            [cdkMenuTriggerFor]="sub"
            [cdkMenuItemDisabled]="!!item.disabled"
            [attr.id]="item.id ?? null"
            [attr.aria-label]="item.ariaLabel ?? null"
          >
            <ng-container [ngTemplateOutlet]="content" [ngTemplateOutletContext]="{ $implicit: item, submenu: true }" />
          </button>
          <ng-template #sub>
            <hx-menu-panel class="hx-menu-submenu" [items]="item.items ?? []" [groups]="false" (triggered)="triggered.emit($event)" />
          </ng-template>
        } @else if (item.disabled) {
          <button type="button" class="hx-menu-item" cdkMenuItem [cdkMenuItemDisabled]="true" [attr.id]="item.id ?? null" [attr.aria-label]="item.ariaLabel ?? null">
            <ng-container [ngTemplateOutlet]="content" [ngTemplateOutletContext]="{ $implicit: item }" />
          </button>
        } @else if (item.routerLink) {
          <a
            class="hx-menu-item"
            cdkMenuItem
            [routerLink]="item.routerLink"
            [queryParams]="item.queryParams"
            [attr.target]="item.target ?? null"
            [attr.id]="item.id ?? null"
            [attr.aria-label]="item.ariaLabel ?? null"
            (click)="run(item, $event)"
          >
            <ng-container [ngTemplateOutlet]="content" [ngTemplateOutletContext]="{ $implicit: item }" />
          </a>
        } @else if (item.url) {
          <a
            class="hx-menu-item"
            cdkMenuItem
            [href]="item.url"
            [attr.target]="item.target ?? null"
            [attr.id]="item.id ?? null"
            [attr.aria-label]="item.ariaLabel ?? null"
            (click)="run(item, $event)"
          >
            <ng-container [ngTemplateOutlet]="content" [ngTemplateOutletContext]="{ $implicit: item }" />
          </a>
        } @else {
          <button
            type="button"
            class="hx-menu-item"
            cdkMenuItem
            [attr.id]="item.id ?? null"
            [attr.aria-label]="item.ariaLabel ?? null"
            (click)="run(item, $event)"
          >
            <ng-container [ngTemplateOutlet]="content" [ngTemplateOutletContext]="{ $implicit: item }" />
          </button>
        }
      }
    </ng-template>

    <ng-container [ngTemplateOutlet]="entries" [ngTemplateOutletContext]="{ $implicit: items(), top: groups() }" />
    </div>
  `,
})
export class HxMenuPanel {
  readonly items = input<readonly HxMenuItem[]>([]);
  /** Draw items with children and no action as group headings (the first level of `hx-menu`). */
  readonly groups = input(true);
  readonly ariaLabel = input<string>();
  /** An item was activated (after its `command` ran). */
  readonly triggered = output<HxMenuItem>();

  private readonly menu = viewChild(CdkMenu);
  protected readonly visible = (list: readonly HxMenuItem[]) =>
    list.filter((item) => item.visible !== false);

  focusFirst(): void {
    this.menu()?.focusFirstItem('keyboard');
  }

  protected run(item: HxMenuItem, originalEvent: Event): void {
    item.command?.({ originalEvent, item });
    this.triggered.emit(item);
  }
}
