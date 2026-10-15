import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { UikitTableDemo } from './table-demo';

describe('UikitTableDemo', () => {
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
});
