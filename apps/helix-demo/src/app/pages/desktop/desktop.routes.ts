import type { Type } from '@angular/core';
import type { Routes } from '@angular/router';
import { DesktopComponentsDemo } from './components/desktop-components-demo';
import { DESKTOP_MENU_ITEMS } from './desktop-menu-items';
import { DesktopOverviewDemo } from './overview/desktop-overview-demo';

const COMPONENTS: Record<string, Type<unknown>> = {
  overview: DesktopOverviewDemo,
  components: DesktopComponentsDemo,
};

export default [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  ...DESKTOP_MENU_ITEMS.filter((item) => item.path != null && COMPONENTS[item.path]).map(
    (item) => ({
      path: item.path!,
      component: COMPONENTS[item.path!],
      data: { breadcrumb: item.label },
    }),
  ),
  { path: '**', redirectTo: '/notfound' },
] as Routes;
