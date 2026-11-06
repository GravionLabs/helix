import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  ElementRef,
  Injector,
  inject,
  input,
  model,
  output,
  type Signal,
  signal,
  type TemplateRef,
  viewChild,
} from '@angular/core';
import { HxTabScroller } from '../internal/tab-scroller/tab-scroller';
import { HxMenu } from '../menu/menu';
import type { HxMenuItem } from '../menu-item';

/** One tab of an `hx-tab-bar`. */
export interface HxTabBarItem {
  /** Identifies the tab; the `value` of the bar is the `id` of the active tab. */
  id: string;
  label: string;
  /** Shown in capitals before the label, separated by a slash (e.g. the workspace). */
  group?: string;
  /** Shown in italics, as editors do for a preview tab. */
  preview?: boolean;
  /** Tooltip; the label when missing. */
  title?: string;
  /** Rings the tab (it needs the user) until the owner clears it. */
  attention?: boolean;
  /** Shows an unread mark. */
  unread?: boolean;
}

/** An entry of the tab context menu; `action` is reported back with the tab id by `menuAction`. */
export interface HxTabBarMenuItem {
  action: string;
  label: string;
  /** A short text shown next to the label, e.g. the key combination. */
  shortcut?: string;
  disabled?: boolean;
  /** Whether the entry is offered for the tab with this id; absent means for every tab. */
  appliesTo?: (tabId: string) => boolean;
}

/** A tab was moved inside its bar: its position `from` before the move, `to` after it. */
export interface HxTabBarMove {
  from: number;
  to: number;
}

/** A tab dragged from the bar with `groupId` `from` was dropped at position `index` of this bar. */
export interface HxTabBarReceive {
  from: string;
  id: string;
  index: number;
}

/** The tab being dragged, shared by all bars so another bar can accept it. */
let activeDrag: { group: string; id: string } | null = null;

/**
 * An editor-style tab strip: tabs that the user closes, reorders (also between bars) and scrolls, without panels. The
 * app renders the content of the active tab itself. Use `hx-tabs` for a fixed set of tabs with panels.
 *
 * ```html
 * <hx-tab-bar
 *   [tabs]="tabs()"
 *   [(value)]="active"
 *   allTabsButton
 *   [menu]="menu"
 *   (closed)="close($event)"
 *   (moved)="move($event)"
 *   (menuAction)="run($event)"
 * >
 *   <button hx-button>+</button>
 * </hx-tab-bar>
 * ```
 *
 * `value` is the `id` of the active tab; choosing a tab sets it. Closing, pinning (double click), moving and menu
 * actions are reported and the app changes `tabs`. The tab strip scrolls when the tabs overflow: buttons at its ends
 * (shared with `hx-tabs` `scrollable`) and the vertical mouse wheel scroll it, `allTabsButton` lists every tab in a
 * menu, and the active tab is scrolled into view.
 *
 * Keyboard (roving tabindex): Tab enters the strip at the active tab, Left/Right (Home/End) move to the previous/next
 * (first/last) tab and select it, Delete or Ctrl+W close the focused tab, the Menu key or Shift+F10 open its
 * context menu. A middle click closes a tab.
 *
 * Content: `<ng-template #tabContent let-tab>` renders extra content after the label of every tab; projected content
 * sits at the right end of the bar.
 */
@Component({
  selector: 'hx-tab-bar',
  imports: [NgTemplateOutlet, HxTabScroller, HxMenu],
  templateUrl: './tab-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-tab-bar' },
})
export class HxTabBar {
  readonly #injector = inject(Injector);
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly tabs = input.required<readonly HxTabBarItem[]>();
  /** The `id` of the active tab. */
  readonly value = model<string | null>(null);
  /** Accessible name of the tab strip. */
  readonly ariaLabel = input<string>();
  /** Identifies this bar when a tab is dragged between bars. */
  readonly groupId = input('');
  /** Entries of the context menu; none disables it. */
  readonly menu = input<readonly HxTabBarMenuItem[]>([]);
  /** A button at the right end, while the tabs overflow, opens a menu of every tab. */
  readonly allTabsButton = input(false, { transform: booleanAttribute });

  /** The close button or the middle click of a tab, or Delete / Ctrl+W on it. */
  readonly closed = output<string>();
  /** Double click on a tab. */
  readonly pinned = output<string>();
  readonly moved = output<HxTabBarMove>();
  /** A tab dragged from another bar was dropped here. */
  readonly received = output<HxTabBarReceive>();
  /** A context menu entry was chosen for the tab `id`. */
  readonly menuAction = output<{ id: string; action: string }>();

  /** Optional template for the content of a tab (`let-tab`), rendered before the label. */
  readonly tabContent = contentChild<TemplateRef<{ $implicit: HxTabBarItem }>>('tabContent');

  private readonly scroller = viewChild.required(HxTabScroller);
  private readonly tabMenu = viewChild.required<HxMenu>('tabMenu');
  protected readonly overflowing: Signal<boolean> = computed(() => this.scroller().overflowing());

  protected readonly dragging = signal<number | null>(null);
  protected readonly dropAt = signal<number | null>(null);
  /** Where a tab from another bar would land. */
  protected readonly foreignAt = signal<number | null>(null);
  protected readonly tabMenuModel = signal<readonly HxMenuItem[]>([]);

  /** The index of the tab in the tab order of the keyboard: the active one, else the first. */
  protected readonly tabbable = computed(() => {
    const at = this.tabs().findIndex((tab) => tab.id === this.value());
    return Math.max(0, at);
  });

  /** Every tab as a menu entry, for the "all tabs" menu. */
  protected readonly allTabsModel = computed<HxMenuItem[]>(() =>
    this.tabs().map((tab) => ({
      label: tab.group ? `${tab.group} / ${tab.label}` : tab.label,
      badge: tab.attention ? '!' : undefined,
      ariaLabel: tab.attention ? this.tabName(tab) : undefined,
      command: () => {
        this.select(tab.id);
        afterNextRender(() => this.revealActive(), { injector: this.#injector });
      },
    })),
  );

  constructor() {
    // the active tab is always in view: after a selection and after the tabs change
    afterRenderEffect(() => {
      this.value();
      this.tabs();
      this.revealActive();
    });
  }

  protected tabName(tab: HxTabBarItem): string {
    const name = tab.group ? `${tab.group} / ${tab.label}` : tab.label;
    return tab.attention ? `${name}, needs attention` : name;
  }

  protected select(id: string): void {
    this.value.set(id);
  }

  private tabElements(): HTMLElement[] {
    return [...this.#host.nativeElement.querySelectorAll<HTMLElement>('.hx-tab-bar-tab')];
  }

  private revealActive(): void {
    const active = this.tabElements().find((el) => el.getAttribute('aria-selected') === 'true');
    if (active) this.scroller().reveal(active);
  }

  // drag and drop

  protected dragStart(event: DragEvent, index: number): void {
    this.dragging.set(index);
    activeDrag = { group: this.groupId(), id: this.tabs()[index].id };
    event.dataTransfer?.setData('text/plain', String(index));
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }

  private foreign(): boolean {
    return activeDrag !== null && activeDrag.group !== this.groupId();
  }

  protected dragOver(event: DragEvent, index: number): void {
    if (this.foreign()) {
      event.preventDefault();
      event.stopPropagation();
      this.foreignAt.set(index);
      return;
    }
    if (this.dragging() === null) return;
    event.preventDefault();
    this.dropAt.set(index);
  }

  /** Over the free part of the strip: a tab from another bar lands at the end. */
  protected stripOver(event: DragEvent): void {
    if (!this.foreign()) return;
    event.preventDefault();
    this.foreignAt.set(this.tabs().length);
  }

  protected stripDrop(event: DragEvent): void {
    this.drop(event, this.tabs().length);
  }

  protected drop(event: DragEvent, index: number): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.foreign()) {
      const { group, id } = activeDrag as { group: string; id: string };
      this.dragEnd();
      this.received.emit({ from: group, id, index });
      return;
    }
    const from = this.dragging();
    this.dragEnd();
    // dropped on itself, or nothing of this bar was dragged
    if (from !== null && from !== index) this.moved.emit({ from, to: index });
  }

  protected dragEnd(): void {
    this.dragging.set(null);
    this.dropAt.set(null);
    this.foreignAt.set(null);
    activeDrag = null;
  }

  // context menu

  protected openMenu(event: MouseEvent, id: string): void {
    const tab = event.currentTarget as HTMLElement;
    if (!this.showMenu(id, { x: event.clientX, y: event.clientY }, tab)) return;
    event.preventDefault();
  }

  private showMenu(id: string, at: { x: number; y: number }, tab: HTMLElement): boolean {
    const entries = this.menu().filter((item) => !item.appliesTo || item.appliesTo(id));
    if (entries.length === 0) return false;
    this.tabMenuModel.set(
      entries.map((entry) => ({
        label: entry.label,
        badge: entry.shortcut,
        disabled: entry.disabled,
        command: () => this.menuAction.emit({ id, action: entry.action }),
      })),
    );
    const menu = this.tabMenu();
    menu.hide(false);
    menu.showAt(at, tab);
    return true;
  }

  // mouse and keyboard

  protected middleClick(event: MouseEvent, id: string): void {
    if (event.button !== 1) return;
    event.preventDefault();
    this.closed.emit(id);
  }

  protected key(event: KeyboardEvent, index: number): void {
    const tabs = this.tabs();
    const count = tabs.length;
    const key = event.key;
    let target: number | null = null;
    if (key === 'ArrowRight') target = (index + 1) % count;
    else if (key === 'ArrowLeft') target = (index - 1 + count) % count;
    else if (key === 'Home') target = 0;
    else if (key === 'End') target = count - 1;
    if (target !== null) {
      event.preventDefault();
      this.select(tabs[target].id);
      this.tabElements()[target]?.focus();
    } else if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      this.select(tabs[index].id);
    } else if (key === 'Delete' || (key.toLowerCase() === 'w' && event.ctrlKey)) {
      event.preventDefault();
      this.closeByKey(index);
    } else if (key === 'ContextMenu' || (key === 'F10' && event.shiftKey)) {
      const tab = event.currentTarget as HTMLElement;
      const box = tab.getBoundingClientRect();
      if (this.showMenu(tabs[index].id, { x: box.left, y: box.bottom }, tab))
        event.preventDefault();
    }
  }

  /** Closes the tab and moves the focus to its neighbour once the app has removed it. */
  private closeByKey(index: number): void {
    const tabs = this.tabs();
    const neighbour = tabs[index + 1] ?? tabs[index - 1];
    this.closed.emit(tabs[index].id);
    if (!neighbour) return;
    afterNextRender(
      () => {
        const at = this.tabs().findIndex((tab) => tab.id === neighbour.id);
        if (at >= 0) this.tabElements()[at]?.focus();
      },
      { injector: this.#injector },
    );
  }
}
