import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HxChart } from '@gravionlabs/helix-ui/chart';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';
import { sampleFirst, sampleMonths, sampleSecond } from '../chart-sample-data';

/** Line chart of `@gravionlabs/helix-ui`; no colours are set, so the Helix palette is used. */
@Component({
  selector: 'app-line-chart-demo',
  imports: [SourceTabsComponent, HxChart],
  templateUrl: './line-chart-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LineChartDemo {
  readonly lineData = {
    labels: sampleMonths,
    datasets: [
      { label: 'First Dataset', data: sampleFirst, tension: 0.4 },
      { label: 'Second Dataset', data: sampleSecond, tension: 0.4 },
    ],
  };
}
