import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HxChart } from '@gravionlabs/helix-ui/chart';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

/** Polar area chart of `@gravionlabs/helix-ui`; no colours are set, so the Helix palette is used. */
@Component({
  selector: 'app-polar-area-chart-demo',
  imports: [SourceTabsComponent, HxChart],
  templateUrl: './polar-area-chart-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class PolarAreaChartDemo {
  readonly polarData = {
    labels: ['Indigo', 'Purple', 'Teal', 'Orange'],
    datasets: [{ label: 'My dataset', data: [11, 16, 7, 3] }],
  };
  readonly polarOptions = { scales: { r: { ticks: { display: false } } } };
}
