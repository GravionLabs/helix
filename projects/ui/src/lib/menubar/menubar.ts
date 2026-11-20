import { CdkMenuBar, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { HxMenu } from '../menu/menu';
import { HxMenuPanel } from '../menu/menu-panel';
import type { HxMenuItem } from '../menu-item';

/**
 * A horizontal menu of `HxMenuItem`s with dropdown submenus, on `@angular/cdk/menu`.
 *
 * ```html
 * <hx-menubar ariaLabel="Main" [model]="items">
 *   <a hxMenubarStart routerLink="/">Helix</a>
 *   <button hxMenubarEnd hx-button>Sign in</button>
 * </hx-menubar>
 * ```
 *
 * Content marked `hxMenubarStart` / `hxMenubarEnd` sits before and after the items. Below `breakpoint` (px) the
 * items collapse into a button that opens them as a `hx-menu` popup.
 *
 * Keyboard (the WAI-ARIA menubar pattern from the CDK): Left and Right move between the top items, Down (or Enter)
 * opens a submenu and moves into it, Escape closes it and returns to the item, typing jumps by label.
 */
@Component({
  selector: 'hx-menubar',
  imports: [
    CdkMenuBar,
    CdkMenuItem,
    CdkMenuTrigger,
    NgTemplateOutlet,
    RouterLink,
    HxMenu,
    HxMenuPanel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-menubar', '[class.hx-menubar-collapsed]': 'collapsed()' },
  templateUrl: './menubar.html',
})
export class HxMenubar {
  readonly model = input<readonly HxMenuItem[]>([]);
  /** Width in px below which the items collapse into a button. */
  readonly breakpoint = input(960, { transform: numberAttribute });
  /** Accessible name of the menubar. */
  readonly ariaLabel = input<string>();
  /** Accessible name of the button shown when collapsed. */
  readonly buttonLabel = input('Menu');

  /** An item was activated (after its `command`). */
  readonly triggered = output<HxMenuItem>();

  /** Whether the viewport is narrower than `breakpoint`. */
  readonly collapsed = signal(false);
  protected readonly visible = () => this.model().filter((item) => item.visible !== false);

  constructor() {
    effect((onCleanup) => {
      if (typeof matchMedia !== 'function') return;
      const query = matchMedia(`(max-width: ${this.breakpoint() - 0.02}px)`);
      const update = () => this.collapsed.set(query.matches);
      update();
      query.addEventListener('change', update);
      onCleanup(() => query.removeEventListener('change', update));
    });
  }

  protected readonly notify = (item: HxMenuItem) => this.triggered.emit(item);

  protected run(item: HxMenuItem, originalEvent: Event): void {
    item.command?.({ originalEvent, item });
    this.triggered.emit(item);
  }
}
