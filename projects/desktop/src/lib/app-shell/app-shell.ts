import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  numberAttribute,
  output,
} from '@angular/core';

/** The width and the collapsed state of the sidebar, as the app stores them. */
export interface HxSidebarState {
  readonly width: number;
  readonly collapsed: boolean;
}

/**
 * The layout of a desktop app: toolbar, activity bar, one sidebar, content, an optional right panel and a
 * status bar.
 *
 * ```html
 * <hx-app-shell #shell [(sidebarWidth)]="width" [(collapsed)]="collapsed" [(activeId)]="viewId">
 *   <hx-app-toolbar slot="toolbar">...</hx-app-toolbar>
 *   <hx-activity-bar slot="activity" [items]="items" [activeId]="shell.activeId()"
 *     [expanded]="!shell.collapsed()" (selected)="shell.selectView($event)" />
 *   <nav slot="sidebar">...the view of activeId...</nav>
 *   <hx-tab-bar>...</hx-tab-bar>
 *   <aside slot="panel">...</aside>
 *   <hx-status-bar slot="status">...</hx-status-bar>
 * </hx-app-shell>
 * ```
 *
 * There is one sidebar: the app puts the view of `activeId` into it. `selectView` collapses the sidebar
 * when the active view is selected again and expands it for another one. The splitter is a
 * `role="separator"`: drag it, or use the arrow keys (Shift for a larger step), Home and End. The shell
 * has no tab logic: the unslotted content is the app's tab layout.
 *
 * `slot="bottom"` is a panel below the content (not under the activity bar), for an output panel or the
 * panel of an editor. It shows when `bottomOpen` is true; its horizontal splitter resizes `bottomHeight`
 * with the pointer or the Up and Down keys (Shift for a larger step), Home and End.
 */
@Component({
  selector: 'hx-app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-app-shell' },
  templateUrl: './app-shell.html',
})
export class HxAppShell {
  /** The sidebar width in px (two-way); it is kept between `minWidth` and `maxWidth`. */
  readonly sidebarWidth = model(260);
  /** Whether the sidebar is collapsed (two-way). */
  readonly collapsed = model(false);
  /** The id of the active sidebar view (two-way). */
  readonly activeId = model<string | null>(null);
  readonly minWidth = input(160, { transform: numberAttribute });
  readonly maxWidth = input(480, { transform: numberAttribute });
  /** The step of an arrow key in px; Shift multiplies it by 4. */
  readonly step = input(16, { transform: numberAttribute });
  readonly resizerLabel = input('Resize sidebar');
  /** Set to disable the pointer and keyboard resize. */
  readonly fixedWidth = input(false, { transform: booleanAttribute });

  /** The height in px of the bottom panel (two-way); it is kept between `minBottomHeight` and `maxBottomHeight`. */
  readonly bottomHeight = model(200);
  /** Whether the bottom panel (`slot="bottom"`) is open (two-way); closed hides the slot and its splitter. */
  readonly bottomOpen = model(false);
  readonly minBottomHeight = input(80, { transform: numberAttribute });
  readonly maxBottomHeight = input(480, { transform: numberAttribute });
  readonly bottomResizerLabel = input('Resize bottom panel');

  /** Emits the width and the collapsed state whenever either changes through the shell. */
  readonly sidebarChange = output<HxSidebarState>();

  protected readonly width = computed(() => this.clamp(this.sidebarWidth()));
  protected readonly height = computed(() => this.clampHeight(this.bottomHeight()));

  private dragStartX = 0;
  private dragStartWidth = 0;
  private dragging = false;
  private dragStartY = 0;
  private dragStartHeight = 0;
  private draggingBottom = false;

  /**
   * Select a sidebar view: the active one collapses the sidebar (when open), any other shows it and
   * expands the sidebar.
   */
  selectView(id: string): void {
    if (id === this.activeId() && !this.collapsed()) {
      this.collapsed.set(true);
    } else {
      this.activeId.set(id);
      this.collapsed.set(false);
    }
    this.report();
  }

  /** Set the width, clamped to the minimum and the maximum. */
  resizeTo(width: number): void {
    const next = this.clamp(width);
    if (next === this.sidebarWidth()) return;
    this.sidebarWidth.set(next);
    this.report();
  }

  /** Open the bottom panel when it is closed and close it when it is open. */
  toggleBottom(): void {
    this.bottomOpen.update((open) => !open);
  }

  /** Set the height of the bottom panel, clamped to the minimum and the maximum. */
  resizeBottomTo(height: number): void {
    const next = this.clampHeight(height);
    if (next === this.bottomHeight()) return;
    this.bottomHeight.set(next);
  }

  protected onBottomPointerDown(event: PointerEvent): void {
    if (this.fixedWidth() || event.button > 0) return;
    this.draggingBottom = true;
    this.dragStartY = event.clientY;
    this.dragStartHeight = this.height();
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  protected onBottomPointerMove(event: PointerEvent): void {
    if (!this.draggingBottom) return;
    this.resizeBottomTo(this.dragStartHeight - (event.clientY - this.dragStartY));
  }

  protected onBottomPointerEnd(event: PointerEvent): void {
    if (!this.draggingBottom) return;
    this.draggingBottom = false;
    (event.target as HTMLElement).releasePointerCapture?.(event.pointerId);
  }

  protected onBottomKeydown(event: KeyboardEvent): void {
    if (this.fixedWidth()) return;
    const step = this.step() * (event.shiftKey ? 4 : 1);
    switch (event.key) {
      case 'ArrowUp':
        this.resizeBottomTo(this.height() + step);
        break;
      case 'ArrowDown':
        this.resizeBottomTo(this.height() - step);
        break;
      case 'Home':
        this.resizeBottomTo(this.minBottomHeight());
        break;
      case 'End':
        this.resizeBottomTo(this.maxBottomHeight());
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  protected onPointerDown(event: PointerEvent): void {
    if (this.fixedWidth() || event.button > 0) return;
    this.dragging = true;
    this.dragStartX = event.clientX;
    this.dragStartWidth = this.width();
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.dragging) return;
    const rtl = getComputedStyle(event.target as HTMLElement).direction === 'rtl';
    const delta = event.clientX - this.dragStartX;
    this.resizeTo(this.dragStartWidth + (rtl ? -delta : delta));
  }

  protected onPointerEnd(event: PointerEvent): void {
    if (!this.dragging) return;
    this.dragging = false;
    (event.target as HTMLElement).releasePointerCapture?.(event.pointerId);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.fixedWidth()) return;
    const step = this.step() * (event.shiftKey ? 4 : 1);
    const rtl = getComputedStyle(event.target as HTMLElement).direction === 'rtl';
    switch (event.key) {
      case 'ArrowLeft':
        this.resizeTo(this.width() + (rtl ? step : -step));
        break;
      case 'ArrowRight':
        this.resizeTo(this.width() + (rtl ? -step : step));
        break;
      case 'Home':
        this.resizeTo(this.minWidth());
        break;
      case 'End':
        this.resizeTo(this.maxWidth());
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  private clamp(width: number): number {
    return Math.min(this.maxWidth(), Math.max(this.minWidth(), Math.round(width)));
  }

  private clampHeight(height: number): number {
    return Math.min(this.maxBottomHeight(), Math.max(this.minBottomHeight(), Math.round(height)));
  }

  private report(): void {
    this.sidebarChange.emit({ width: this.width(), collapsed: this.collapsed() });
  }
}
