import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { CodeCommitGraphDemo } from './code-commit-graph-demo';

describe('CodeCommitGraphDemo', () => {
  let fixture: ComponentFixture<CodeCommitGraphDemo>;
  const el = () => fixture.nativeElement as HTMLElement;

  /** The viewport measures and renders in a microtask and after change detection. */
  async function flush(): Promise<void> {
    for (let i = 0; i < 3; i++) {
      fixture.detectChanges();
      await fixture.whenStable();
      await new Promise((r) => setTimeout(r, 0));
    }
    fixture.detectChanges();
  }

  afterEach(() => vi.restoreAllMocks());

  beforeEach(async () => {
    // jsdom has no layout: every element is 280 px high.
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(280);
    // jsdom has no `scrollTo`.
    HTMLElement.prototype.scrollTo = function (this: HTMLElement, opts?: ScrollToOptions | number) {
      this.scrollTop = typeof opts === 'object' ? (opts.top ?? 0) : 0;
    } as typeof HTMLElement.prototype.scrollTo;
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
    fixture = TestBed.createComponent(CodeCommitGraphDemo);
    await flush();
  });

  it('lists the commits', () => {
    expect(
      el().querySelectorAll('[role=listbox]')[0].querySelectorAll('[role=option]').length,
    ).toBe(5);
  });

  it('has the 10,000 commits example with paging', async () => {
    const lists = el().querySelectorAll('[role=listbox]');
    expect(lists.length).toBe(2);
    expect(el().textContent).toContain('Loaded: 500 of 10000');
    // Only the visible rows are rendered.
    expect(lists[1].querySelectorAll('[role=option]').length).toBeLessThan(30);
  });

  it('reveals a loaded commit and reports one that is not loaded', async () => {
    const buttons = [...el().querySelectorAll<HTMLButtonElement>('button')].filter((b) =>
      b.textContent!.includes('Reveal'),
    );
    buttons[1].click();
    await flush();
    expect(el().textContent).toContain('That commit is not loaded yet.');
    buttons[0].click();
    await flush();
    expect(el().textContent).not.toContain('That commit is not loaded yet.');
  });

  it('selects a commit on click', async () => {
    el().querySelectorAll<HTMLElement>('[role=option]')[1].click();
    await flush();
    expect(el().textContent).toContain('Selected: c90d5e2');
  });

  it('renders the row slot', async () => {
    el().querySelector<HTMLButtonElement>('.hx-commit-graph-cell button')!.click();
    await flush();
    expect(el().textContent).toContain('Copied: a1f3c9d');
  });
});
