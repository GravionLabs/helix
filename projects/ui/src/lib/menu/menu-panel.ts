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
  templateUrl: './menu-panel.html',
})
export class HxMenuPanel {
  readonly items = input<readonly HxMenuItem[]>([]);
  /** Draw items with children and no action as group headings (the first level of `hx-menu`). */
  readonly groups = input(true);
  readonly ariaLabel = input<string>();
  /** An item was activated (after its `command` ran). */
  readonly triggered = output<HxMenuItem>();
  /**
   * Where a submenu reports an activated item. The CDK closes (and destroys) a submenu before the click handler
   * runs, and an output of a destroyed component no longer delivers, so submenus call this function of the root.
   */
  readonly notify = input<(item: HxMenuItem) => void>();

  private readonly menu = viewChild(CdkMenu);
  protected readonly visible = (list: readonly HxMenuItem[]) =>
    list.filter((item) => item.visible !== false);

  focusFirst(): void {
    this.menu()?.focusFirstItem('keyboard');
  }

  protected run(item: HxMenuItem, originalEvent: Event): void {
    item.command?.({ originalEvent, item });
    const notify = this.notify();
    if (notify) notify(item);
    else this.triggered.emit(item);
  }

  protected readonly emit = (item: HxMenuItem) => this.triggered.emit(item);
}
