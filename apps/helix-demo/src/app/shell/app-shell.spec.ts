import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LayoutStore } from '@gravionlabs/helix-shell';
import { HighlightLoader } from 'ngx-highlightjs';
import { AppShell } from './app-shell';
import { BUILD_VERSION } from './build-info';
import { DemoSettings } from './demo-settings';

describe('AppShell', () => {
  it('shows the build version in the status bar versions', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LayoutStore, useValue: { isDarkTheme: () => false } },
        { provide: HighlightLoader, useValue: { setTheme: () => undefined } },
        { provide: DemoSettings, useValue: {} },
      ],
    });
    const shell = TestBed.runInInjectionContext(() => new AppShell());

    expect((shell as unknown as { versions: unknown }).versions).toEqual([
      { label: 'Helix', value: BUILD_VERSION },
    ]);
  });

  it('renders the filter as the search action of the default toolbar', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: HighlightLoader, useValue: { setTheme: () => undefined } },
      ],
    });
    const fixture = TestBed.createComponent(AppShell);
    await fixture.whenStable();

    const filter = (fixture.nativeElement as HTMLElement).querySelector(
      '.layout-topbar-center helix-search-action input.hx-input',
    );

    expect(filter).not.toBeNull();
  });
});
