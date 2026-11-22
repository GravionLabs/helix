import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { CodeOverviewDemo } from './code-overview-demo';

describe('CodeOverviewDemo', () => {
  let fixture: ComponentFixture<CodeOverviewDemo>;
  let root: HTMLElement;

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
    fixture = TestBed.createComponent(CodeOverviewDemo);
    root = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('shows the install line and the two entries', () => {
    expect(root.querySelector('.install')?.textContent).toContain(
      'pnpm add @gravionlabs/helix-code',
    );
    const entries = root.querySelector('.entries')?.textContent ?? '';
    expect(entries).toContain('@gravionlabs/helix-code:');
    expect(entries).toContain('@gravionlabs/helix-code/git');
  });

  it('lists the required peers and the optional CodeMirror peers', () => {
    const names = (selector: string) =>
      [...root.querySelectorAll(`${selector} code`)].map((e) => e.textContent);
    expect(names('.peers.required')).toEqual([
      '@angular/core',
      '@angular/common',
      '@angular/forms',
      '@angular/cdk',
    ]);
    expect(names('.peers.codemirror')).toContain('@codemirror/merge');
    expect(names('.peers.codemirror')).not.toContain('@codemirror/autocomplete');
  });

  it('wraps the page in the source tabs', () => {
    expect(root.querySelector('app-source-tabs')).not.toBeNull();
  });
});
