import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { TableDemo } from './table-demo';

describe('TableDemo', () => {
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
    const fixture = TestBed.createComponent(TableDemo);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the invoices, the small and the sticky header table', () => {
    const el = create().nativeElement as HTMLElement;
    expect(el.querySelectorAll('table[hx-table]')).toHaveLength(3);
    expect(el.querySelectorAll('table[hx-table]')[0].querySelectorAll('tbody tr')).toHaveLength(8);
  });

  it('sums the invoice amounts in the footer', () => {
    const fixture = create();
    expect(fixture.componentInstance.total).toBeCloseTo(1442.4);
    const foot = (fixture.nativeElement as HTMLElement).querySelector('tfoot td');
    expect(foot?.textContent?.trim()).toBe('1442.4');
  });

  it('marks invoice 1003 as selected', () => {
    const el = create().nativeElement as HTMLElement;
    expect(el.querySelectorAll('tbody tr[aria-selected="true"]')).toHaveLength(1);
  });
});
