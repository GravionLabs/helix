import { CommonModule } from '@angular/common';
import {
  type AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from '@gravionlabs/helix-core/ripple';
import { Tooltip } from '@gravionlabs/helix-core/tooltip';
import type { HelixRouteMenuItem } from '../../route-menu.model';
import { LayoutStore } from '../../store/layout.store';

/**
 * Whether the active URL matches an item path on a whole-segment boundary,
 * so `uikit/dynamicform` does not match `uikit/dynamicform-advanced` but
 * still matches child routes, query params and fragments.
 */
function isPathActive(activePath: string, itemPath: string): boolean {
  if (!itemPath || !activePath.startsWith(itemPath)) return false;
  const next = activePath[itemPath.length];
  return next === undefined || next === '/' || next === '?' || next === '#' || next === ';';
}

@Component({
  selector: '[helix-nav-rail-item]',
  standalone: true,
  imports: [CommonModule, RouterModule, RippleModule, Tooltip],
  templateUrl: './nav-rail-item.html',
  styleUrl: './nav-rail-item.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    '[class.helix-nav-rail-item-expanded]': 'isExpanded()',
    '[class.helix-nav-rail-item-collapsed]': 'isCollapsed()',
    '(mouseenter)': 'openFlyout()',
    '(mouseleave)': 'scheduleFlyoutClose()',
    '(focusin)': 'openFlyout()',
    '(focusout)': 'onFocusOut($event)',
    '(keydown.escape)': 'closeFlyout(true)',
  },
})
export class HelixNavRailItem implements AfterViewInit {
  store = inject(LayoutStore);

  item = input<HelixRouteMenuItem | null>(null);
  parentPath = input<string | null>(null);
  depth = input(0);

  /** Renders inside a collapsed-rail flyout: always expanded (labels visible), never itself a flyout. */
  flyout = input(false);

  /** Whether this item's submenu, having animated open at least once, may transition on leave too. */
  initialized = signal(false);

  hasChildren = computed(() => !!this.item()?.items?.length);
  isCollapsed = computed(() => this.store.isCollapsed() && !this.flyout());

  /** Collapsed rail: the item's children are shown in a flyout next to it. */
  flyoutOpen = signal(false);
  flyoutTop = signal(0);
  flyoutLeft = signal(0);

  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  #suppressOpen = false;
  #closeTimer: ReturnType<typeof setTimeout> | undefined;

  /** Stable key used against LayoutStore.expandedKeys() — several items can be expanded at once. */
  itemKey = computed(() => {
    const ownPath = this.item()?.path;
    if (ownPath) {
      const parent = this.parentPath();
      if (parent && !ownPath.startsWith(parent)) {
        return `${parent}/${ownPath}`;
      }
      return ownPath;
    }
    const label = this.item()?.label ?? '';
    const parent = this.parentPath();
    return parent ? `${parent}/${label}` : label;
  });

  fullPath = computed(() => {
    const itemPath = this.item()?.path;
    if (itemPath == null) return this.parentPath();
    const parent = this.parentPath();
    if (parent && !itemPath.startsWith(parent)) {
      return `${parent}/${itemPath}`;
    }
    return itemPath;
  });

  isActive = computed(() => {
    if (this.hasChildren()) return false;
    const itemPath = this.item()?.path;
    if (itemPath == null) return false;
    const normalizedPath = this.store.activePath()?.replace(/^\//, '') ?? '';
    const normalizedFull = (this.fullPath() ?? '').replace(/^\//, '');
    return isPathActive(normalizedPath, normalizedFull);
  });

  hasActiveDescendant = computed(() => {
    const normalized = this.store.activePath()?.replace(/^\//, '') ?? '';
    const items = this.item()?.items;
    if (!items) return false;

    const parentFullPath = (this.fullPath() ?? '').replace(/^\//, '');

    const match = (list: HelixRouteMenuItem[], prefix: string): boolean =>
      list.some((child) => {
        const childFullPath = child.path
          ? prefix
            ? `${prefix}/${child.path.replace(/^\//, '')}`
            : child.path.replace(/^\//, '')
          : prefix;
        if (childFullPath && isPathActive(normalized, childFullPath)) {
          return true;
        }
        return child.items ? match(child.items, childFullPath) : false;
      });

    return match(items, parentFullPath);
  });

  isExpanded = computed(() => this.store.expandedKeys().includes(this.itemKey()));

  constructor() {
    // Navigating (or expanding the rail) always dismisses an open flyout.
    effect(() => {
      this.store.activePath();
      this.isCollapsed();
      untracked(() => this.closeFlyout(false));
    });

    // The group holding the active route opens itself on navigation; the user can still collapse it.
    effect(() => {
      if (this.hasActiveDescendant()) {
        const key = this.itemKey();
        untracked(() => this.store.setExpanded(key, true));
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.initialized.set(true));
  }

  itemClick(event: Event) {
    const item = this.item();
    if (item?.disabled) {
      event.preventDefault();
      return;
    }
    if (item?.command) {
      item.command({ originalEvent: event, item });
    }
    if (this.hasChildren()) {
      event.preventDefault();
      if (this.isCollapsed()) {
        this.flyoutOpen() ? this.closeFlyout(false) : this.openFlyout();
      } else {
        this.store.setExpanded(this.itemKey(), !this.isExpanded());
      }
    } else {
      this.store.closeMobileMenu();
    }
  }

  openFlyout() {
    if (this.#suppressOpen || !this.isCollapsed() || !this.hasChildren()) return;
    clearTimeout(this.#closeTimer);
    if (this.flyoutOpen()) return;
    const rect = this.#host.nativeElement.getBoundingClientRect();
    this.flyoutTop.set(rect.top);
    // Anchor to the rail's edge (not the padded item) so the flyout sits beside the rail.
    const rail = this.#host.nativeElement.closest('.helix-nav-rail');
    this.flyoutLeft.set((rail?.getBoundingClientRect().right ?? rect.right) + 4);
    this.flyoutOpen.set(true);
    // Keep the flyout inside the viewport once it has rendered.
    setTimeout(() => {
      const el = this.#host.nativeElement.querySelector<HTMLElement>('.helix-nav-rail-flyout');
      if (!el) return;
      const overflow = el.getBoundingClientRect().bottom - (window.innerHeight - 8);
      if (overflow > 0) this.flyoutTop.set(Math.max(8, rect.top - overflow));
    });
  }

  closeFlyout(restoreFocus: boolean) {
    clearTimeout(this.#closeTimer);
    if (!this.flyoutOpen()) return;
    this.flyoutOpen.set(false);
    if (restoreFocus)
      this.#host.nativeElement.querySelector<HTMLElement>('.helix-nav-rail-link')?.focus();
  }

  scheduleFlyoutClose() {
    clearTimeout(this.#closeTimer);
    this.#closeTimer = setTimeout(() => this.closeFlyout(false), 120);
  }

  onFocusOut(event: FocusEvent) {
    const next = event.relatedTarget as Node | null;
    if (!next || !this.#host.nativeElement.contains(next)) this.closeFlyout(false);
  }

  /** Enter/Space activate expandable items; arrow keys move between visible links. */
  onKeydown(event: KeyboardEvent) {
    const link = event.currentTarget as HTMLElement;
    switch (event.key) {
      case 'Enter':
      case ' ':
        if (this.hasChildren()) {
          event.preventDefault();
          this.itemClick(event);
        }
        break;
      case 'ArrowDown':
      case 'ArrowUp': {
        const links = Array.from(
          (
            link.closest('nav') ??
            link.parentElement?.parentElement ??
            document
          ).querySelectorAll<HTMLElement>('.helix-nav-rail-link'),
        );
        const next = links[links.indexOf(link) + (event.key === 'ArrowDown' ? 1 : -1)];
        if (next) {
          event.preventDefault();
          next.focus();
        }
        break;
      }
      case 'ArrowRight':
        if (this.hasChildren() && this.isCollapsed()) {
          event.preventDefault();
          this.openFlyout();
        } else if (this.hasChildren() && !this.isExpanded()) {
          event.preventDefault();
          this.store.setExpanded(this.itemKey(), true);
        }
        break;
      case 'ArrowLeft':
        if (this.hasChildren() && this.isExpanded()) {
          event.preventDefault();
          this.store.setExpanded(this.itemKey(), false);
        }
        break;
    }
  }
}
