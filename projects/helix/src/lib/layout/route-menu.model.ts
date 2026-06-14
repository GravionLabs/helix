import type { Type } from '@angular/core';
import type { ActivatedRouteSnapshot, CanActivateFn, Route, Routes } from '@angular/router';
import type { MenuItem } from 'primeng/api';

/**
 * Extends PrimeNG's MenuItem with Angular routing properties.
 * Allows a single array to define both the sidebar menu and the router configuration.
 */
export interface HelixRouteMenuItem extends MenuItem {
  /** Angular route path segment (relative to the parent route). */
  path?: string;
  /** Breadcrumb label or resolver for auto-generated breadcrumbs. */
  breadcrumb?: string | ((route: ActivatedRouteSnapshot) => string);
  /** Component to render for this route. */
  component?: Type<unknown>;
  /** Lazy-loaded children module or routes. */
  loadChildren?: Route['loadChildren'];
  /** Route guards. */
  canActivate?: CanActivateFn[];
  /** Additional route data (merged with the auto-injected menu data). */
  data?: Record<string, unknown>;
  /** Typed override of MenuItem.items — supports nested HelixRouteMenuItem entries. */
  items?: HelixRouteMenuItem[];
}

/**
 * Recursively copies a HelixRouteMenuItem tree and auto-populates `routerLink`
 * from `path` for any item that does not already have a `routerLink`.
 *
 * @param items  The source menu items.
 * @param basePath  Absolute base path prefix (e.g. `'/uikit'`).
 *
 * @example
 * // uikit-menu-items.ts defines: { path: 'formlayout', label: '...', icon: '...' }
 * helixMenuLinksFrom(UIKIT_ITEMS, '/uikit')
 * // → { path: 'formlayout', label: '...', icon: '...', routerLink: ['/uikit/formlayout'] }
 */
export function helixMenuLinksFrom(
  items: HelixRouteMenuItem[],
  basePath: string,
): HelixRouteMenuItem[] {
  return items.map((item) => {
    const resolved: HelixRouteMenuItem = {
      ...item,
      items: item.items ? helixMenuLinksFrom(item.items, basePath) : undefined,
    };

    if (resolved.breadcrumb !== undefined) {
      resolved.data = { ...resolved.data, ['breadcrumb']: resolved.breadcrumb };
    }

    if (!resolved.routerLink && resolved.path !== undefined) {
      const fullPath = `${basePath}/${resolved.path}`.replace(/\/+/g, '/');
      resolved.routerLink = [fullPath];
    }

    return resolved;
  });
}

/**
 * Converts a HelixRouteMenuItem tree into Angular Routes.
 *
 * - Items with `path` + `component` or `loadChildren` generate a route entry.
 * - Items without `path` (visual-only section headers) are skipped for routing
 *   but their `items` children are still recursed.
 * - Items with only `routerLink` (e.g. links into lazy-loaded sub-modules) are
 *   skipped — they do not need a route entry here.
 */
export function helixRoutesFrom(items: HelixRouteMenuItem[]): Routes {
  const routes: Routes = [];

  for (const item of items) {
    if (item.path === undefined) {
      // Visual-only item (section header etc.) — recurse into children
      if (item.items?.length) {
        routes.push(...helixRoutesFrom(item.items));
      }
      continue;
    }

    const hasRoute = item.component != null || item.loadChildren != null;
    if (!hasRoute) {
      // Has a path but no component/loadChildren — skip as route, but recurse
      if (item.items?.length) {
        routes.push(...helixRoutesFrom(item.items));
      }
      continue;
    }

    const routeData: Record<string, unknown> = { ...(item.data as Record<string, unknown>) };
    if (item.breadcrumb !== undefined) {
      routeData['breadcrumb'] = item.breadcrumb;
    }

    const route: Route = { path: item.path };

    if (item.component) route.component = item.component;
    if (item.loadChildren) route.loadChildren = item.loadChildren;
    if (item.canActivate) route.canActivate = item.canActivate;
    if (Object.keys(routeData).length > 0) route.data = routeData;

    // Items nested under a routable item become child routes (not recursed flat)
    if (item.items?.length) {
      const childRoutes = helixRoutesFrom(item.items);
      if (childRoutes.length) {
        route.children = childRoutes;
      }
    }

    routes.push(route);
  }

  return routes;
}
