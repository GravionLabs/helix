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

  const click = (el: HTMLElement, label: string) => {
    const button = Array.from(el.querySelectorAll('button')).find((b) =>
      b.textContent?.includes(label),
    );
    button?.click();
  };

  it('shows and hides the loading state with the Toggle loading button', () => {
    const fixture = create();
    const el = fixture.nativeElement as HTMLElement;
    const first = () => el.querySelectorAll('hx-data-table')[0];
    expect(first().querySelector('.hx-data-table-loading')).toBeNull();
    click(el, 'Toggle loading');
    fixture.detectChanges();
    expect(first().querySelector('.hx-data-table-loading')).not.toBeNull();
    click(el, 'Toggle loading');
    fixture.detectChanges();
    expect(first().querySelector('.hx-data-table-loading')).toBeNull();
  });

  it('shows the empty message and then the four products again with Toggle empty', () => {
    const fixture = create();
    const el = fixture.nativeElement as HTMLElement;
    const first = () => el.querySelectorAll('hx-data-table')[0];
    expect(first().querySelectorAll('tbody tr')).toHaveLength(4);
    click(el, 'Toggle empty');
    fixture.detectChanges();
    expect(first().querySelector('.hx-data-table-empty')?.textContent).toContain(
      'No records found',
    );
    click(el, 'Toggle empty');
    fixture.detectChanges();
    expect(first().querySelectorAll('tbody tr')).toHaveLength(4);
  });

  it('dims only the cheap rows of the paged table', () => {
    const el = create().nativeElement as HTMLElement;
    const rows = Array.from(el.querySelectorAll('hx-data-table')[1].querySelectorAll('tbody tr'));
    // prices on page 1: 10, 27, 44, 61, 78
    expect(rows.map((r) => r.classList.contains('data-table-dim'))).toEqual([
      true,
      true,
      false,
      false,
      false,
    ]);
  });

  it('reduces the rows of the selectable table with the global filter', () => {
    const fixture = create();
    const el = fixture.nativeElement as HTMLElement;
    const table = el.querySelectorAll('hx-data-table')[2];
    expect(table.querySelectorAll('tbody tr')).toHaveLength(5);
    const input = el.querySelector<HTMLInputElement>('input[aria-label="Global filter"]');
    if (!input) throw new Error('global filter not found');
    input.value = 'Product 47';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(table.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(table.querySelector('tbody tr')?.textContent).toContain('Product 47');
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
