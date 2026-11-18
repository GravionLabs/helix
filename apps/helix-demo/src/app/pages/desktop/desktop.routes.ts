import type { Type } from '@angular/core';
import type { Routes } from '@angular/router';
import { DESKTOP_MENU_ITEMS } from './desktop-menu-items';
import { DesktopDemo } from './overview/desktop-demo';

const COMPONENTS: Record<string, Type<unknown>> = {
  overview: DesktopDemo,
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
