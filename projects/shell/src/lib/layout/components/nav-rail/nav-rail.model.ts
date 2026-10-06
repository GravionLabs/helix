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

/** How a flat menu is mapped onto the nav rail. */
export type HelixNavStyle = 'sections' | 'tree';

/**
 * Adapts a flat HelixRouteMenuItem tree (as used by HelixAppLayout's `menu`
 * input) into HelixNavGroup[].
 *
 * - `'sections'` (default): every top-level item with children becomes an
 *   uppercase section whose children are listed directly; consecutive
 *   top-level items without children form one unlabeled group. Deeper levels
 *   still expand inline.
 * - `'tree'`: the whole menu is one unlabeled group, so each top-level item
 *   with children renders as an expandable HelixNavRailItem.
 */
export function helixNavGroupsFromMenu(
  items: HelixRouteMenuItem[],
  style: HelixNavStyle = 'sections',
): HelixNavGroup[] {
  if (style === 'tree') return [{ items }];

  const groups: HelixNavGroup[] = [];
  let plain: HelixRouteMenuItem[] = [];
  const flushPlain = () => {
    if (plain.length) groups.push({ items: plain });
    plain = [];
  };

  for (const item of items) {
    if (item.items?.length) {
      flushPlain();
      groups.push({ section: item.label, items: item.items });
    } else {
      plain.push(item);
    }
  }
  flushPlain();
  return groups;
}
