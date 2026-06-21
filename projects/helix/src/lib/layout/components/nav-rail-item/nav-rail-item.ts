import { CommonModule } from '@angular/common';
import { type AfterViewInit, Component, computed, inject, input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import type { HelixRouteMenuItem } from '../../route-menu.model';
import { LayoutStore } from '../../store/layout.store';

@Component({
  selector: '[helix-nav-rail-item]',
  standalone: true,
  imports: [CommonModule, RouterModule, RippleModule],
  templateUrl: './nav-rail-item.html',
  styleUrl: './nav-rail-item.scss',
  host: {
    '[class.helix-nav-rail-item-expanded]': 'isExpanded()',
    '[class.helix-nav-rail-item-collapsed]': 'isCollapsed()',
  },
})
export class HelixNavRailItem implements AfterViewInit {
  store = inject(LayoutStore);

  item = input<HelixRouteMenuItem | null>(null);
  parentPath = input<string | null>(null);
  depth = input(0);

  /** Whether this item's submenu, having animated open at least once, may transition on leave too. */
  initialized = signal(false);

  hasChildren = computed(() => !!this.item()?.items?.length);
  isCollapsed = computed(() => this.store.isCollapsed());

  /** Stable key used against LayoutStore.expandedRoot() — only one item app-wide is expanded at a time. */
  itemKey = computed(() => {
    const ownPath = this.item()?.path;
    if (ownPath) {
      const parent = this.parentPath();
      if (parent && !ownPath.startsWith(parent)) {
        return parent + ownPath;
      }
      return ownPath;
    }
    const label = this.item()?.label ?? '';
    const parent = this.parentPath();
    return parent ? `${parent}/${label}` : label;
  });

  fullPath = computed(() => {
    const itemPath = this.item()?.path;
    if (!itemPath) return this.parentPath();
    const parent = this.parentPath();
    if (parent && !itemPath.startsWith(parent)) {
      return parent + itemPath;
    }
    return itemPath;
  });

  isActive = computed(() => {
    if (this.hasChildren()) return false;
    const itemPath = this.item()?.path;
    if (!itemPath) return false;
    const normalizedPath = this.store.activePath()?.replace(/^\//, '') ?? '';
    const normalizedFull = (this.fullPath() ?? '').replace(/^\//, '');
    return normalizedPath.startsWith(normalizedFull);
  });

  hasActiveDescendant = computed(() => {
    const normalized = this.store.activePath()?.replace(/^\//, '') ?? '';
    const items = this.item()?.items;
    if (!items) return false;

    const match = (list: HelixRouteMenuItem[]): boolean =>
      list.some((child) => {
        if (
          child.path != null &&
          child.path !== '' &&
          normalized.startsWith(child.path.replace(/^\//, ''))
        ) {
          return true;
        }
        return child.items ? match(child.items) : false;
      });

    return match(items);
  });

  isExpanded = computed(
    () => this.hasActiveDescendant() || this.store.expandedRoot() === this.itemKey(),
  );

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
      this.store.setExpandedRoot(this.isExpanded() ? null : this.itemKey());
    } else {
      this.store.closeMobileMenu();
    }
  }
}
