import { TestBed } from '@angular/core/testing';
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
});
