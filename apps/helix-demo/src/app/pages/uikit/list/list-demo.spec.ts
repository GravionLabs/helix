import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { ListDemo } from './list-demo';

describe('ListDemo: list rows', () => {
  async function create() {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideHighlightOptions({
          coreLibraryLoader: () => import('highlight.js/lib/core'),
          languages: { xml: () => import('highlight.js/lib/languages/xml') },
        }),
      ],
    });
    const fixture = TestBed.createComponent(ListDemo);
    await fixture.whenStable();
    return fixture;
  }

  const row = (el: HTMLElement, label: string) =>
    [...el.querySelectorAll<HTMLElement>('[hx-list-row]')].find(
      (r) => r.querySelector('.hx-list-row-label')?.textContent?.trim() === label,
    )!;

  it('shows selected buttons, navigation links with a current page and a listbox', async () => {
    const el = (await create()).nativeElement as HTMLElement;
    expect(el.querySelectorAll('hx-list')).toHaveLength(3);
    expect(row(el, 'main').getAttribute('aria-pressed')).toBe('true');
    expect(row(el, 'List').getAttribute('aria-current')).toBe('page');
    expect(row(el, 'Theming').getAttribute('aria-selected')).toBe('true');
  });

  it('selects the clicked row, but not a disabled one', async () => {
    const fixture = await create();
    const el = fixture.nativeElement as HTMLElement;
    row(el, 'release/next').click();
    row(el, 'archive').click();
    await fixture.whenStable();
    expect(row(el, 'release/next').getAttribute('aria-pressed')).toBe('true');
    expect(row(el, 'main').getAttribute('aria-pressed')).toBe('false');
    expect(row(el, 'archive').getAttribute('aria-pressed')).toBe('false');
  });
});
