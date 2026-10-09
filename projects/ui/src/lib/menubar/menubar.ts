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
  template: `
    <div class="hx-menubar-start"><ng-content select="[hxMenubarStart]" /></div>

    @if (collapsed()) {
      <button
        type="button"
        class="hx-menubar-button"
        aria-haspopup="menu"
        [attr.aria-label]="buttonLabel()"
        (click)="menu.toggle($event)"
      >
        <span class="hx-menubar-button-icon" aria-hidden="true"></span>
      </button>
      <hx-menu #menu popup [model]="model()" [ariaLabel]="ariaLabel()" (triggered)="triggered.emit($event)" />
    } @else {
      <div cdkMenuBar class="hx-menubar-list" [attr.aria-label]="ariaLabel() ?? null">
        <ng-template #content let-item let-submenu="submenu">
          @if (item.icon) {
            <span class="hx-menu-icon" [class]="item.icon" aria-hidden="true"></span>
          }
          <span class="hx-menu-label">{{ item.label }}</span>
          @if (item.badge) {
            <span class="hx-menu-badge">{{ item.badge }}</span>
          }
          @if (submenu) {
            <span class="hx-menubar-submenu-icon" aria-hidden="true"></span>
          }
        </ng-template>

        @for (item of visible(); track $index) {
          @if (item.separator) {
            <div class="hx-menubar-separator" role="separator"></div>
          } @else if (item.items?.length) {
            <button
              type="button"
              class="hx-menubar-item"
              cdkMenuItem
              [cdkMenuTriggerFor]="sub"
              [cdkMenuItemDisabled]="!!item.disabled"
              [attr.id]="item.id ?? null"
              [attr.aria-label]="item.ariaLabel ?? null"
            >
              <ng-container [ngTemplateOutlet]="content" [ngTemplateOutletContext]="{ $implicit: item, submenu: true }" />
            </button>
            <ng-template #sub>
              <hx-menu-panel class="hx-menubar-submenu" [items]="item.items ?? []" [groups]="false" [notify]="notify" />
            </ng-template>
          } @else if (item.disabled) {
            <button type="button" class="hx-menubar-item" cdkMenuItem [cdkMenuItemDisabled]="true" [attr.id]="item.id ?? null" [attr.aria-label]="item.ariaLabel ?? null">
              <ng-container [ngTemplateOutlet]="content" [ngTemplateOutletContext]="{ $implicit: item }" />
            </button>
          } @else if (item.routerLink) {
            <a
              class="hx-menubar-item"
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
              class="hx-menubar-item"
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
              class="hx-menubar-item"
              cdkMenuItem
              [attr.id]="item.id ?? null"
              [attr.aria-label]="item.ariaLabel ?? null"
              (click)="run(item, $event)"
            >
              <ng-container [ngTemplateOutlet]="content" [ngTemplateOutletContext]="{ $implicit: item }" />
            </button>
          }
        }
      </div>
    }

    <div class="hx-menubar-end"><ng-content select="[hxMenubarEnd]" /></div>
  `,
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
