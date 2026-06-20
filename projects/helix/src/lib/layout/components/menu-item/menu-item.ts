import { CommonModule } from '@angular/common';
import {
  type AfterViewInit,
  Component,
  computed,
  inject,
  input,
  type OnInit,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { filter } from 'rxjs/operators';
import { LayoutStore } from '../../store/layout.store';

/** @deprecated Use HelixNavRailItem instead. HelixMenuItem is no longer wired into HelixAppLayout. */
@Component({
  selector: '[helix-menuitem]',
  standalone: true,
  imports: [CommonModule, RouterModule, RippleModule],
  templateUrl: './menu-item.html',
  styleUrl: './menu-item.scss',
  host: {
    '[class.active-menuitem]': 'isExpanded()',
    '[class.layout-root-menuitem]': 'root()',
    '[class.layout-sidebar-collapsed]': 'isCollapsed()',
  },
})
export class HelixMenuItem implements OnInit, AfterViewInit {
  store = inject(LayoutStore);
  router = inject(Router);

  item = input<any>(null);
  root = input<boolean>(false);
  parentPath = input<string | null>(null);

  isVisible = computed(() => this.item()?.visible !== false);
  hasChildren = computed(() => this.item()?.items && this.item()?.items.length > 0);
  hasRouterLink = computed(() => !!this.item()?.routerLink);
  initialized = signal<boolean>(false);

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

  isCollapsed = computed(() => this.store.isCollapsed());

  isActive = computed(() => {
    const activePath = this.store.activePath();
    if (this.item()?.path) {
      const normalizedPath = activePath?.replace(/^\//, '') ?? '';
      const normalizedFull = (this.fullPath() ?? '').replace(/^\//, '');
      return normalizedPath?.startsWith(normalizedFull) ?? false;
    }
    return false;
  });

  hasActiveDescendant = computed(() => {
    const normalized = this.store.activePath()?.replace(/^\//, '') ?? '';
    const items = this.item()?.items;
    if (!items) return false;

    const match = (list: any[]): boolean =>
      list.some((child: any) => {
        if (
          child.path != null &&
          child.path !== '' &&
          normalized.startsWith(child.path.replace(/^\//, ''))
        )
          return true;
        return child.items ? match(child.items) : false;
      });

    return match(items);
  });

  isExpanded = computed(
    () =>
      this.isActive() || this.hasActiveDescendant() || this.store.expandedRoot() === this.itemKey(),
  );

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (this.item()?.routerLink) {
        this.updateActiveStateFromRoute();
      }
    });
  }

  ngOnInit() {
    if (this.item()?.routerLink) {
      this.updateActiveStateFromRoute();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => this.initialized.set(true));
  }

  updateActiveStateFromRoute() {
    const item = this.item();
    if (!item?.routerLink) return;

    const isRouteActive = this.router.isActive(item.routerLink[0], {
      paths: 'exact',
      queryParams: 'ignored',
      matrixParams: 'ignored',
      fragment: 'ignored',
    });

    if (isRouteActive) {
      const parentPath = this.parentPath();
      if (parentPath) {
        this.store.setActivePath(parentPath);
      }
    }
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
      if (this.isExpanded()) {
        this.store.setExpandedRoot(null);
        this.store.setActivePath(null);
      } else {
        this.store.setExpandedRoot(this.itemKey());
        this.store.setActivePath(this.fullPath() ?? this.item()?.label ?? '');
        this.store.setMenuHoverActive(true);
      }
    } else {
      this.store.closeMobileMenu();
    }
  }
}
