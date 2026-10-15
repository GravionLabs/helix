import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { type DemoLibrary, SourceTabsComponent } from './source-tabs';

@Component({
  imports: [SourceTabsComponent],
  template: `<app-source-tabs directory="button" componentName="button-demo" [library]="library">demo</app-source-tabs>`,
})
class Host {
  library: DemoLibrary | undefined;
}

function render(library?: DemoLibrary): HTMLElement {
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
  const fixture = TestBed.createComponent(Host);
  fixture.componentInstance.library = library;
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('SourceTabsComponent library tag', () => {
  it('shows the package name as a tag when a library is set', () => {
    const tag = render('helix-ag-grid').querySelector('hx-tag');
    expect(tag?.textContent?.trim()).toBe('@gravionlabs/helix-ag-grid');
  });

  it('renders each supported library as @gravionlabs/<library>', () => {
    for (const lib of ['helix-ui', 'helix-shell', 'helix-zod'] as const) {
      TestBed.resetTestingModule();
      expect(render(lib).querySelector('hx-tag')?.textContent?.trim()).toBe(`@gravionlabs/${lib}`);
    }
  });

  it('renders no tag without a library', () => {
    expect(render().querySelector('hx-tag')).toBeNull();
  });

  it('keeps the tag out of the tab list', () => {
    expect(render('helix-ui').querySelector('hx-tab-list hx-tag')).toBeNull();
  });
});
