import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { HxDrawer } from '@gravionlabs/helix-ui';
import { HxBottomBar, type HxBottomBarItem } from './bottom-bar';

/** A horizontal swipe toward the edge of the drawer closes it from this distance (px). */
const SWIPE_DISTANCE = 48;

/**
 * The layout of a phone app: a top bar with the menu button, the content, a bottom bar, and a drawer for
 * the sidebar views. It has no status bar and no hover tooltips. The notch, the home indicator and the
 * keyboard are kept clear with `env(safe-area-inset-*)`.
 *
 * ```html
 * <hx-mobile-shell #shell [items]="items" [(activeId)]="viewId" [(drawerOpen)]="drawer" heading="Helix">
 *   <nav slot="drawer"><button (click)="shell.chooseView('files')">Files</button></nav>
 *   ...the view of activeId...
 * </hx-mobile-shell>
 * ```
 *
 * Choose it by platform: `@if (platform === 'mobile') { <hx-mobile-shell> } @else { <hx-app-shell> }`
 * (`getHxPlatform()`), never by the window width. The drawer closes on a tap outside, on a swipe toward its
 * edge, on Escape and after `chooseView`. Set `<meta name="viewport" content="..., viewport-fit=cover,
 * interactive-widget=resizes-content">` so the safe-area insets and the keyboard work.
 */
@Component({
  selector: 'hx-mobile-shell',
  imports: [HxBottomBar, HxDrawer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-mobile-shell' },
  templateUrl: './mobile-shell.html',
})
export class HxMobileShell {
  /** The views and actions of the bottom bar (at most five are shown). */
  readonly items = input.required<readonly HxBottomBarItem[]>();
  /** The id of the active view (two-way). */
  readonly activeId = model<string | null>(null);
  /** Whether the drawer is open (two-way). */
  readonly drawerOpen = model(false);
  readonly heading = input('');
  readonly menuLabel = input('Menu');
  readonly closeLabel = input('Close');
  readonly barLabel = input('Views');

  private touchX: number | null = null;

  /** Make a view active and close the drawer: call it when a sidebar view was chosen. */
  chooseView(id: string): void {
    this.activeId.set(id);
    this.drawerOpen.set(false);
  }

  protected onBarSelect(id: string): void {
    if (this.items().find((i) => i.id === id)?.kind !== 'action') this.activeId.set(id);
    this.drawerOpen.set(false);
  }

  protected onTouchStart(event: TouchEvent): void {
    this.touchX = event.changedTouches[0]?.clientX ?? null;
  }

  protected onTouchEnd(event: TouchEvent): void {
    const start = this.touchX;
    this.touchX = null;
    const end = event.changedTouches[0]?.clientX;
    if (start === null || end === undefined) return;
    const rtl = getComputedStyle(event.target as HTMLElement).direction === 'rtl';
    const delta = end - start;
    if (rtl ? delta >= SWIPE_DISTANCE : delta <= -SWIPE_DISTANCE) this.drawerOpen.set(false);
  }
}
