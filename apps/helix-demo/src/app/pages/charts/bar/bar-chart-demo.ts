import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HxChart, type HxChartSelectEvent } from '@gravionlabs/helix-ui/chart';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';
import { first, months, second } from '../chart-sample-data';

function isPickedElement(value: unknown): value is { datasetIndex: number; index: number } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'datasetIndex' in value &&
    typeof value.datasetIndex === 'number' &&
    'index' in value &&
    typeof value.index === 'number'
  );
}

/** Bar chart of `@gravionlabs/helix-ui`; no colours are set, so the Helix palette is used. */
@Component({
  selector: 'app-bar-chart-demo',
  standalone: true,
  imports: [SourceTabsComponent, HxChart],
  templateUrl: './bar-chart-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './bar-chart-demo.scss',
})
export class BarChartDemo {
  readonly barData = {
    labels: months,
    datasets: [
      { label: 'My First dataset', data: first },
      { label: 'My Second dataset', data: second },
    ],
  };
  readonly barOptions = { scales: { x: { grid: { display: false } } } };

  readonly fallbackMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  readonly sales = [65, 59, 80, 81, 56, 55];
  readonly costs = [28, 48, 40, 19, 86, 27];
  readonly fallbackData = {
    labels: this.fallbackMonths,
    datasets: [
      { label: 'Sales', data: this.sales },
      { label: 'Costs', data: this.costs },
    ],
  };
  readonly picked = signal('none');

  pick(event: HxChartSelectEvent): void {
    const picked = event.element;
    if (!isPickedElement(picked)) return;
    const { datasetIndex, index } = picked;
    this.picked.set(
      `${this.fallbackData.datasets[datasetIndex].label}, ${this.fallbackMonths[index]}`,
    );
  }
}
