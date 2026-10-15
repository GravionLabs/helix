import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HxChart } from '@gravionlabs/helix-ui/chart';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';
import { PolarAreaChartDemo } from './polar-area-chart-demo';

describe('PolarAreaChartDemo', () => {
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
    const fixture = TestBed.createComponent(PolarAreaChartDemo);
    fixture.detectChanges();
    return fixture;
  }

  it('shows the polar-area source tabs of helix-ui', () => {
    const tabs = create().debugElement.query(By.directive(SourceTabsComponent))
      .componentInstance as SourceTabsComponent;
    expect(tabs.directory()).toBe('charts/polar-area');
    expect(tabs.componentName()).toBe('polar-area-chart-demo');
    expect(tabs.docs()).toEqual([]);
    expect(tabs.library()).toBe('helix-ui');
  });

  it('renders a single polar area chart', () => {
    const charts = create().debugElement.queryAll(By.directive(HxChart));
    expect(charts.map((c) => (c.componentInstance as HxChart).type())).toEqual(['polarArea']);
  });
});
