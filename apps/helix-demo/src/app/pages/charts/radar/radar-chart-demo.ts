import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HxChart } from '@gravionlabs/helix-ui/chart';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

/** Radar chart of `@gravionlabs/helix-ui`; no colours are set, so the Helix palette is used. */
@Component({
  selector: 'app-radar-chart-demo',
  imports: [SourceTabsComponent, HxChart],
  templateUrl: './radar-chart-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class RadarChartDemo {
  readonly radarData = {
    labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
    datasets: [
      { label: 'My First dataset', data: [65, 59, 90, 81, 56, 55, 40] },
      { label: 'My Second dataset', data: [28, 48, 40, 19, 96, 27, 100] },
    ],
  };
}
