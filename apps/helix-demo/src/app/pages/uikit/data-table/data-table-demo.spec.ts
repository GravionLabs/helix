import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { DataTableDemo } from './data-table-demo';

describe('DataTableDemo', () => {
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
    const fixture = TestBed.createComponent(DataTableDemo);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the three data table cards', () => {
    const el = create().nativeElement as HTMLElement;
    expect(el.querySelectorAll('hx-data-table')).toHaveLength(3);
  });

  it('toggles loading on and off', () => {
    const cmp = create().componentInstance;
    expect(cmp.tableLoading()).toBe(false);
    cmp.toggleLoading();
    expect(cmp.tableLoading()).toBe(true);
    cmp.toggleLoading();
    expect(cmp.tableLoading()).toBe(false);
  });

  it('toggles the rows empty and back to the four products', () => {
    const cmp = create().componentInstance;
    expect(cmp.tableRows()).toHaveLength(4);
    cmp.toggleEmpty();
    expect(cmp.tableRows()).toEqual([]);
    cmp.toggleEmpty();
    expect(cmp.tableRows()).toHaveLength(4);
  });

  it('dims only products cheaper than 30', () => {
    const { dimCheap } = create().componentInstance;
    expect(dimCheap({ price: 29 })).toBe('data-table-dim');
    expect(dimCheap({ price: 30 })).toBeNull();
  });

  it('starts with nothing selected and no filters, 47 rows to page', () => {
    const cmp = create().componentInstance;
    expect(cmp.selected()).toEqual([]);
    expect(cmp.filters()).toEqual({});
    expect(cmp.manyProducts).toHaveLength(47);
  });

  it('shows 5 rows on the first page of the paged table', () => {
    const el = create().nativeElement as HTMLElement;
    const paged = el.querySelectorAll('hx-data-table')[1];
    expect(paged.querySelectorAll('tbody tr')).toHaveLength(5);
  });
});
