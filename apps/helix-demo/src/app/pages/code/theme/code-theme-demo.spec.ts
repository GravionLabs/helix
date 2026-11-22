import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { CodeThemeDemo } from './code-theme-demo';

describe('CodeThemeDemo', () => {
  let fixture: ComponentFixture<CodeThemeDemo>;

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
    fixture = TestBed.createComponent(CodeThemeDemo);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('mounts an editor with the Helix theme and the sample code', () => {
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.editor .cm-editor')).not.toBeNull();
    expect(root.querySelector('.cm-content')?.textContent).toContain('export function greet');
  });

  it('wraps the page in the source tabs', () => {
    expect((fixture.nativeElement as HTMLElement).querySelector('app-source-tabs')).not.toBeNull();
  });
});
