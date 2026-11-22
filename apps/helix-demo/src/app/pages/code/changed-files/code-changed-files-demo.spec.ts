import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { CodeChangedFilesDemo } from './code-changed-files-demo';

describe('CodeChangedFilesDemo', () => {
  let fixture: ComponentFixture<CodeChangedFilesDemo>;
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
    fixture = TestBed.createComponent(CodeChangedFilesDemo);
    fixture.detectChanges();
  });

  it('lists the files', () => {
    expect(el().querySelectorAll('[role=option]').length).toBe(7);
  });

  it('selects a file on click', () => {
    el().querySelectorAll<HTMLElement>('[role=option]')[1].click();
    fixture.detectChanges();
    expect(el().textContent).toContain('Selected: src/app/greet.ts');
  });

  it('stages a file through the row slot', () => {
    el().querySelector<HTMLButtonElement>('.hx-changed-files-actions button')!.click();
    fixture.detectChanges();
    expect(
      el().querySelectorAll('hx-changed-files')[0].querySelectorAll('[role=option]').length,
    ).toBe(1);
  });
});
