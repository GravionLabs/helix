import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HxChart } from '@gravionlabs/helix-ui';

/**
 * The charts of `@gravionlabs/helix-ui`: chart.js with colours, grid and font from the design tokens, redrawn when the
 * theme changes. The data below sets no colours, so the Helix palette is used.
 */
@Component({
  selector: 'app-chart-demo',
  standalone: true,
  imports: [HxChart],
  templateUrl: './chart-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './chart-demo.scss',
})
export class ChartDemo {
  readonly months = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  readonly first = [65, 59, 80, 81, 56, 55, 40];
  readonly second = [28, 48, 40, 19, 86, 27, 90];

  readonly lineData = {
    labels: this.months,
    datasets: [
      { label: 'First Dataset', data: this.first, tension: 0.4 },
      { label: 'Second Dataset', data: this.second, tension: 0.4 },
    ],
  };

  readonly barData = {
    labels: this.months,
    datasets: [
      { label: 'My First dataset', data: this.first },
      { label: 'My Second dataset', data: this.second },
    ],
  };
  readonly barOptions = { scales: { x: { grid: { display: false } } } };

  readonly pieData = {
    labels: ['A', 'B', 'C'],
    datasets: [{ data: [540, 325, 702] }],
  };
  readonly pieOptions = { plugins: { legend: { labels: { usePointStyle: true } } } };

  readonly polarData = {
    labels: ['Indigo', 'Purple', 'Teal', 'Orange'],
    datasets: [{ label: 'My dataset', data: [11, 16, 7, 3] }],
  };
  readonly polarOptions = { scales: { r: { ticks: { display: false } } } };

  readonly radarData = {
    labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
    datasets: [
      { label: 'My First dataset', data: [65, 59, 90, 81, 56, 55, 40] },
      { label: 'My Second dataset', data: [28, 48, 40, 19, 96, 27, 100] },
    ],
  };
}
