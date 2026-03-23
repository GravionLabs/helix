import { Type } from '@angular/core';
import { CanActivateFn, Route, Routes } from '@angular/router';
import { MenuItem } from 'primeng/api';

/**
 * Extends PrimeNG's MenuItem with Angular routing properties.
 * Allows a single array to define both the sidebar menu and the router configuration.
 */
export interface GvRouteMenuItem extends MenuItem {
  /** Angular route path segment (relative to the parent route). */
  path?: string;
  /** Component to render for this route. */
  component?: Type<unknown>;
  /** Lazy-loaded children module or routes. */
  loadChildren?: Route['loadChildren'];
  /** Route guards. */
  canActivate?: CanActivateFn[];
  /** Additional route data (merged with the auto-injected menu data). */
  data?: Record<string, unknown>;
  /** Typed override of MenuItem.items — supports nested GvRouteMenuItem entries. */
  items?: GvRouteMenuItem[];
}

/**
 * Converts a GvRouteMenuItem tree into Angular Routes.
 *
 * - Items with `path` + `component` or `loadChildren` generate a route entry.
 * - Items without `path` (visual-only section headers) are skipped for routing
 *   but their `items` children are still recursed.
 * - Items with only `routerLink` (e.g. links into lazy-loaded sub-modules) are
 *   skipped — they do not need a route entry here.
 */
export function gvRoutesFrom(items: GvRouteMenuItem[]): Routes {
  const routes: Routes = [];

  for (const item of items) {
    if (item.path === undefined) {
      // Visual-only item (section header etc.) — recurse into children
      if (item.items?.length) {
        routes.push(...gvRoutesFrom(item.items));
      }
      continue;
    }

    const hasRoute = item.component != null || item.loadChildren != null;
    if (!hasRoute) {
      // Has a path but no component/loadChildren — skip as route, but recurse
      if (item.items?.length) {
        routes.push(...gvRoutesFrom(item.items));
      }
      continue;
    }

    const route: Route = { path: item.path };

    if (item.component) route.component = item.component;
    if (item.loadChildren) route.loadChildren = item.loadChildren;
    if (item.canActivate) route.canActivate = item.canActivate;
    if (item.data) route.data = item.data;

    // Items nested under a routable item become child routes (not recursed flat)
    if (item.items?.length) {
      const childRoutes = gvRoutesFrom(item.items);
      if (childRoutes.length) {
        route.children = childRoutes;
      }
    }

    routes.push(route);
  }

  return routes;
}
