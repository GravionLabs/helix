import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HxChart } from '@gravionlabs/helix-ui/chart';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

/** Pie and doughnut chart of `@gravionlabs/helix-ui`; no colours are set, so the Helix palette is used. */
@Component({
  selector: 'app-pie-chart-demo',
  imports: [SourceTabsComponent, HxChart],
  templateUrl: './pie-chart-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class PieChartDemo {
  readonly pieData = {
    labels: ['A', 'B', 'C'],
    datasets: [{ data: [540, 325, 702] }],
  };
  readonly pieOptions = { plugins: { legend: { labels: { usePointStyle: true } } } };
}
