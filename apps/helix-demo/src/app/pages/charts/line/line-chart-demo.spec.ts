import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HxChart } from '@gravionlabs/helix-ui/chart';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';
import { LineChartDemo } from './line-chart-demo';

describe('LineChartDemo', () => {
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
    const fixture = TestBed.createComponent(LineChartDemo);
    fixture.detectChanges();
    return fixture;
  }

  it('shows the line source tabs for the chart docs of helix-ui', () => {
    const tabs = create().debugElement.query(By.directive(SourceTabsComponent))
      .componentInstance as SourceTabsComponent;
    expect(tabs.directory()).toBe('charts/line');
    expect(tabs.componentName()).toBe('line-chart-demo');
    expect(tabs.docs()).toEqual(['chart']);
    expect(tabs.library()).toBe('helix-ui');
  });

  it('renders a single line chart', () => {
    const charts = create().debugElement.queryAll(By.directive(HxChart));
    expect(charts.map((c) => (c.componentInstance as HxChart).type())).toEqual(['line']);
  });
});
