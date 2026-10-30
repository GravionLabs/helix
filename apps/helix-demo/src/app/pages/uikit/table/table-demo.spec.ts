import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { UikitTableDemo } from './table-demo';

describe('UikitTableDemo', () => {
  function create() {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideHighlightOptions({
          coreLibraryLoader: () => import('highlight.js/lib/core'),
          languages: { xml: () => import('highlight.js/lib/languages/xml') },
        }),
      ],
    });
    const fixture = TestBed.createComponent(UikitTableDemo);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the invoices, the small and the sticky header table', () => {
    const el = create().nativeElement as HTMLElement;
    expect(el.querySelectorAll('table[hx-table]')).toHaveLength(3);
    const rows = Array.from(el.querySelectorAll('table[hx-table]')).map(
      (table) => table.querySelectorAll('tbody tr').length,
    );
    expect(rows).toEqual([8, 3, 8]);
  });

  it('sums the invoice amounts in the footer', () => {
    const fixture = create();
    expect(fixture.componentInstance.total).toBeCloseTo(1442.4);
    const foot = (fixture.nativeElement as HTMLElement).querySelector('tfoot td');
    expect(Number(foot?.textContent)).toBeCloseTo(1442.4);
  });

  it('marks invoice 1003 as selected', () => {
    const el = create().nativeElement as HTMLElement;
    expect(el.querySelectorAll('tbody tr[aria-selected="true"]')).toHaveLength(1);
  });

  it('is labelled Native table and links to the Data table page', () => {
    const el = create().nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toBe('Native table');
    const link = el.querySelector<HTMLAnchorElement>('a[href="/uikit/data-table"]');
    expect(link?.textContent).toBe('Data table');
  });
});
