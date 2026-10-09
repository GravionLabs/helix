import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HxChart } from '@gravionlabs/helix-ui';

/** Quarterly revenue; `hx-chart` takes its colours, grid and font from the tokens and redraws on a theme change. */
@Component({
  standalone: true,
  selector: 'app-revenue-stream-widget',
  imports: [HxChart],
  templateUrl: './revenuestreamwidget.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './revenuestreamwidget.scss',
})
export class RevenueStreamWidget {
  readonly quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  readonly subscriptions = [4000, 10000, 15000, 4000];
  readonly advertising = [2100, 8400, 2400, 7500];
  readonly affiliate = [4100, 5200, 3400, 7400];

  readonly chartData = {
    labels: this.quarters,
    datasets: [
      { type: 'bar', label: 'Subscriptions', data: this.subscriptions, barThickness: 32 },
      { type: 'bar', label: 'Advertising', data: this.advertising, barThickness: 32 },
      {
        type: 'bar',
        label: 'Affiliate',
        data: this.affiliate,
        borderRadius: { topLeft: 8, topRight: 8, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
        barThickness: 32,
      },
    ],
  };

  readonly chartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true, grid: { color: 'transparent' } },
      y: { stacked: true, grid: { drawTicks: false } },
    },
  };
}
