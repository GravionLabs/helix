import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HxChart } from '@gravionlabs/helix-ui/chart';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';
import { first, months, second } from '../chart-sample-data';

/** Line chart of `@gravionlabs/helix-ui`; no colours are set, so the Helix palette is used. */
@Component({
  selector: 'app-line-chart-demo',
  standalone: true,
  imports: [SourceTabsComponent, HxChart],
  templateUrl: './line-chart-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './line-chart-demo.scss',
})
export class LineChartDemo {
  readonly lineData = {
    labels: months,
    datasets: [
      { label: 'First Dataset', data: first, tension: 0.4 },
      { label: 'Second Dataset', data: second, tension: 0.4 },
    ],
  };
}
