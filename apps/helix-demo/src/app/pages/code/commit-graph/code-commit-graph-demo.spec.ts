import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { CodeCommitGraphDemo } from './code-commit-graph-demo';

describe('CodeCommitGraphDemo', () => {
  let fixture: ComponentFixture<CodeCommitGraphDemo>;
  const el = () => fixture.nativeElement as HTMLElement;

  beforeEach(() => {
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
    fixture.detectChanges();
  });

  it('lists the commits', () => {
    expect(el().querySelectorAll('[role=option]').length).toBe(5);
  });

  it('selects a commit on click', () => {
    el().querySelectorAll<HTMLElement>('[role=option]')[1].click();
    fixture.detectChanges();
    expect(el().textContent).toContain('Selected: c90d5e2');
  });

  it('renders the row slot', () => {
    el().querySelector<HTMLButtonElement>('.hx-commit-graph-cell button')!.click();
    fixture.detectChanges();
    expect(el().textContent).toContain('Copied: a1f3c9d');
  });
});
