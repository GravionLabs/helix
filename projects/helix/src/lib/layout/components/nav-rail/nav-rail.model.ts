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
 * Adapts a flat HelixRouteMenuItem tree (as used by HelixAppLayout's `menu`
 * input) into HelixNavGroup[] by wrapping it as a single unlabeled group.
 * Each top-level item keeps its own identity (icon, children, etc.), so an
 * item with children renders as a normal expandable HelixNavRailItem rather
 * than being flattened into a static section heading.
 */
export function helixNavGroupsFromMenu(items: HelixRouteMenuItem[]): HelixNavGroup[] {
  return [{ items }];
}
