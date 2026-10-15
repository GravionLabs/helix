import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HxChart } from '@gravionlabs/helix-ui/chart';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';
import { BarChartDemo } from './bar-chart-demo';

describe('BarChartDemo', () => {
  function create() {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideHighlightOptions({
          coreLibraryLoader: () => import('highlight.js/lib/core'),
          languages: { xml: () => import('highlight.js/lib/languages/xml') },
        }),
      ],
    });
    const fixture = TestBed.createComponent(BarChartDemo);
    fixture.detectChanges();
    return fixture;
  }

  it('shows the bar source tabs of helix-ui', () => {
    const tabs = create().debugElement.query(By.directive(SourceTabsComponent))
      .componentInstance as SourceTabsComponent;
    expect(tabs.directory()).toBe('charts/bar');
    expect(tabs.componentName()).toBe('bar-chart-demo');
    expect(tabs.docs()).toEqual([]);
    expect(tabs.library()).toBe('helix-ui');
  });

  it('renders the bar chart and the fallback bar chart', () => {
    const charts = create().debugElement.queryAll(By.directive(HxChart));
    expect(charts.map((c) => (c.componentInstance as HxChart).type())).toEqual(['bar', 'bar']);
  });

  function fallbackChart(fixture: ReturnType<typeof create>) {
    const chart = fixture.debugElement
      .queryAll(By.directive(HxChart))
      .find((d) => d.nativeElement.querySelector('table[hxChartFallback]'));
    if (!chart) throw new Error('fallback chart not found');
    return chart;
  }

  it('renders the fallback table with one row per month plus the header', () => {
    const el = create().nativeElement as HTMLElement;
    const table = el.querySelector('table[hxChartFallback]');
    expect(table).not.toBeNull();
    expect(table?.querySelectorAll('tr')).toHaveLength(7);
    expect(table?.querySelectorAll('tr')[1].textContent).toContain('Jan');
    expect(table?.querySelectorAll('tr')[1].textContent).toContain('65');
  });

  it('starts with nothing picked', () => {
    expect(create().componentInstance.picked()).toBe('none');
  });

  it('updates picked with dataset label and month when a bar is selected', () => {
    const fixture = create();
    fallbackChart(fixture).triggerEventHandler('dataSelect', {
      originalEvent: new Event('click'),
      element: { datasetIndex: 1, index: 4 },
      dataset: [],
    });
    fixture.detectChanges();
    expect(fixture.componentInstance.picked()).toBe('Costs, May');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Costs, May');
  });

  it('ignores a selection without a dataset and month index', () => {
    const fixture = create();
    fallbackChart(fixture).triggerEventHandler('dataSelect', {
      originalEvent: new Event('click'),
      element: null,
      dataset: [],
    });
    expect(fixture.componentInstance.picked()).toBe('none');
  });
});
