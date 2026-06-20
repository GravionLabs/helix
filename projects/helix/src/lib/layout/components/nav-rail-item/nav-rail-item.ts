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

  /** Explicit user toggle. null = no override yet, fall back to the active-descendant default. */
  private manualOpen = signal<boolean | null>(null);

  hasChildren = computed(() => !!this.item()?.items?.length);
  isCollapsed = computed(() => this.store.isCollapsed());

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

  isExpanded = computed(() => {
    const manual = this.manualOpen();
    if (manual !== null) return manual;
    return this.hasActiveDescendant();
  });

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
      this.manualOpen.set(!this.isExpanded());
    } else {
      this.store.closeMobileMenu();
    }
  }
}
