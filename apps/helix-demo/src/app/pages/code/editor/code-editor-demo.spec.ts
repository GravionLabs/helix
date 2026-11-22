import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { CodeEditorDemo } from './code-editor-demo';

describe('CodeEditorDemo', () => {
  let fixture: ComponentFixture<CodeEditorDemo>;

  beforeEach(async () => {
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
    fixture = TestBed.createComponent(CodeEditorDemo);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('renders an editor with the sample text', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.cm-editor')).not.toBeNull();
    expect(el.querySelector('.cm-content')?.textContent).toContain('greeting');
  });

  it('switches the sample with the file buttons', async () => {
    const el = fixture.nativeElement as HTMLElement;
    [...el.querySelectorAll('button')].find((b) => b.textContent?.trim() === 'data.json')!.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(el.querySelector('.cm-content')?.textContent).toContain('helix');
  });
});
