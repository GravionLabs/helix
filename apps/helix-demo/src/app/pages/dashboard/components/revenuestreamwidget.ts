import { afterNextRender, Component, effect, inject, signal } from '@angular/core';
import { LayoutStore } from '@gravionlabs/helix';
import { ChartModule } from 'primeng/chart';

@Component({
  standalone: true,
  selector: 'app-revenue-stream-widget',
  imports: [ChartModule],
  templateUrl: './revenuestreamwidget.html',
  styleUrl: './revenuestreamwidget.scss',
})
export class RevenueStreamWidget {
  store = inject(LayoutStore);

  chartData = signal<any>(null);

  chartOptions = signal<any>(null);

  constructor() {
    afterNextRender(() => {
      setTimeout(() => {
        this.initChart();
      }, 150);
    });

    effect(() => {
      this.store.darkTheme();
      setTimeout(() => {
        this.initChart();
      }, 150);
    });
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

    this.chartData.set({
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          type: 'bar',
          label: 'Subscriptions',
          backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
          data: [4000, 10000, 15000, 4000],
          barThickness: 32,
        },
        {
          type: 'bar',
          label: 'Advertising',
          backgroundColor: documentStyle.getPropertyValue('--p-primary-300'),
          data: [2100, 8400, 2400, 7500],
          barThickness: 32,
        },
        {
          type: 'bar',
          label: 'Affiliate',
          backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
          data: [4100, 5200, 3400, 7400],
          borderRadius: {
            topLeft: 8,
            topRight: 8,
            bottomLeft: 0,
            bottomRight: 0,
          },
          borderSkipped: false,
          barThickness: 32,
        },
      ],
    });

    this.chartOptions.set({
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textMutedColor,
          },
          grid: {
            color: 'transparent',
            borderColor: 'transparent',
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: textMutedColor,
          },
          grid: {
            color: borderColor,
            borderColor: 'transparent',
            drawTicks: false,
          },
        },
      },
    });
  }
}
