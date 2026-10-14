/*
 * Public API Surface of @gravionlabs/helix-ui/chart
 *
 * A secondary entry point so that only apps that import the chart reference chart.js (an optional peer
 * dependency): the root entry `@gravionlabs/helix-ui` builds without chart.js installed.
 */

export {
  HX_CHART_LOADER,
  HxChart,
  type HxChartInstance,
  type HxChartModule,
  type HxChartSelectEvent,
  type HxChartType,
} from './chart';
