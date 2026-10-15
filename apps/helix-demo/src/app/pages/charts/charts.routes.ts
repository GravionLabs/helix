import type { Type } from '@angular/core';
import type { Routes } from '@angular/router';
import { CHARTS_MENU_ITEMS } from './charts-menu-items';
import { ChartDemo } from './overview/chart-demo';

const COMPONENTS: Record<string, Type<unknown>> = {
  overview: ChartDemo,
};

export default [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  ...CHARTS_MENU_ITEMS.filter((item) => item.path != null && COMPONENTS[item.path]).map((item) => ({
    path: item.path!,
    component: COMPONENTS[item.path!],
    data: { breadcrumb: item.label },
  })),
  { path: '**', redirectTo: '/notfound' },
] as Routes;
