import type { HelixRouteMenuItem } from '../../route-menu.model';

/**
 * A group of nav-rail items under an optional uppercase section label.
 * Reuses HelixRouteMenuItem for items so existing routerLink/path-driven
 * active state, breadcrumbs, and route generation keep working unchanged.
 */
export interface HelixNavGroup {
  /** Uppercase section label shown above the items. Omit for an unlabeled group. */
  section?: string;
  items: HelixRouteMenuItem[];
}

/**
 * Adapts a flat HelixRouteMenuItem tree (as used by the existing HelixMenu)
 * into HelixNavGroup[] by treating each top-level item as a group: its
 * label becomes the section, and its own children become the group's items.
 * A top-level item with no children becomes a single-item unlabeled group.
 */
export function helixNavGroupsFromMenu(items: HelixRouteMenuItem[]): HelixNavGroup[] {
  return items.map((item) => {
    if (item.items?.length) {
      return { section: item.label, items: item.items };
    }
    return { items: [item] };
  });
}
