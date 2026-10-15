import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HxChart } from '@gravionlabs/helix-ui/chart';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { LineChartDemo } from './line-chart-demo';

describe('LineChartDemo', () => {
  it('renders 1 chart card(s)', () => {
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
    expect(fixture.debugElement.queryAll(By.directive(HxChart))).toHaveLength(1);
  });
});
