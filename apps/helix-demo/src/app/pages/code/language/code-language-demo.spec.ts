import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { CodeLanguageDemo } from './code-language-demo';

describe('CodeLanguageDemo', () => {
  let fixture: ComponentFixture<CodeLanguageDemo>;

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
    fixture = TestBed.createComponent(CodeLanguageDemo);
    fixture.detectChanges();
  });

  const click = async (label: string) => {
    const buttons = [...(fixture.nativeElement as HTMLElement).querySelectorAll('button')];
    buttons.find((b) => b.textContent?.trim() === label)!.click();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  it('shows the loaded language for a file name', async () => {
    await click('app.ts');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Loaded: TypeScript');
  });

  it('says so when no language matches', async () => {
    await click('notes.xyz');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No language matches.');
  });
});
