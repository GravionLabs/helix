import type { Type } from '@angular/core';
import type { Routes } from '@angular/router';
import { BarChartDemo } from './bar/bar-chart-demo';
import { CHARTS_MENU_ITEMS } from './charts-menu-items';
import { LineChartDemo } from './line/line-chart-demo';
import { PieChartDemo } from './pie/pie-chart-demo';
import { PolarAreaChartDemo } from './polar-area/polar-area-chart-demo';
import { RadarChartDemo } from './radar/radar-chart-demo';

const COMPONENTS: Record<string, Type<unknown>> = {
  line: LineChartDemo,
  bar: BarChartDemo,
  pie: PieChartDemo,
  'polar-area': PolarAreaChartDemo,
  radar: RadarChartDemo,
};

export default [
  { path: '', redirectTo: 'line', pathMatch: 'full' },
  ...CHARTS_MENU_ITEMS.filter((item) => item.path != null && COMPONENTS[item.path]).map((item) => ({
    path: item.path!,
    component: COMPONENTS[item.path!],
    data: { breadcrumb: item.label },
  })),
  { path: '**', redirectTo: '/notfound' },
] as Routes;
