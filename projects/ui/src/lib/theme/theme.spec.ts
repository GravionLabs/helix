import {
  ApplicationInitStatus,
  createEnvironmentInjector,
  EnvironmentInjector,
  PLATFORM_ID,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HX_SURFACES } from './surfaces';
import {
  HX_PRIMARY_COLORS,
  HX_SURFACE_NAMES,
  HX_THEME_OPTIONS,
  HxTheme,
  type HxThemeOptions,
  parseDarkSelector,
  provideHxTheme,
} from './theme';

const html = document.documentElement;
const sheet = () => document.querySelector('style[data-hx-theme]')?.textContent ?? null;

function setup(options: HxThemeOptions = {}, platform: 'browser' | 'server' = 'browser') {
  TestBed.configureTestingModule({
    providers: [
      { provide: HX_THEME_OPTIONS, useValue: options },
      { provide: PLATFORM_ID, useValue: platform },
    ],
  });
  const theme = TestBed.inject(HxTheme);
  TestBed.tick();
  return theme;
}

describe('HxTheme', () => {
  afterEach(() => {
    html.classList.remove('app-dark');
    html.removeAttribute('data-theme');
    document.querySelectorAll('style[data-hx-theme]').forEach((el) => {
      el.remove();
    });
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('starts with the look of the preset: light, no colour override', () => {
    const theme = setup();
    expect(theme.dark()).toBe(false);
    expect(theme.primary()).toBeNull();
    expect(theme.surface()).toBeNull();
    expect(theme.css()).toBe('');
    expect(html.classList).not.toContain('app-dark');
  });

  describe('dark mode', () => {
    it('is the app-dark class on <html>', () => {
      const theme = setup();
      theme.setDark(true);
      TestBed.tick();
      expect(html.classList).toContain('app-dark');
      theme.toggleDark();
      TestBed.tick();
      expect(theme.dark()).toBe(false);
      expect(html.classList).not.toContain('app-dark');
    });

    it('can be an attribute instead, or another class', () => {
      TestBed.resetTestingModule();
      const theme = setup({ darkSelector: '[data-theme="dark"]' });
      theme.setDark(true);
      TestBed.tick();
      expect(html.getAttribute('data-theme')).toBe('dark');
      theme.setDark(false);
      TestBed.tick();
      expect(html.hasAttribute('data-theme')).toBe(false);
    });

    it('cross-fades with the View Transitions API when asked to, but not at start-up', () => {
      const start = vi.fn((update: () => void) => update());
      Object.defineProperty(document, 'startViewTransition', { configurable: true, value: start });
      try {
        const theme = setup({ viewTransition: true, dark: true });
        expect(start).not.toHaveBeenCalled(); // the start-up state
        expect(html.classList).toContain('app-dark');
        theme.setDark(false);
        TestBed.tick();
        expect(start).toHaveBeenCalledTimes(1);
        expect(html.classList).not.toContain('app-dark');
      } finally {
        Reflect.deleteProperty(document, 'startViewTransition');
      }
    });

    it('does not use view transitions unless asked to', () => {
      const start = vi.fn((update: () => void) => update());
      Object.defineProperty(document, 'startViewTransition', { configurable: true, value: start });
      try {
        const theme = setup();
        theme.setDark(true);
        TestBed.tick();
        expect(start).not.toHaveBeenCalled();
        expect(html.classList).toContain('app-dark');
      } finally {
        Reflect.deleteProperty(document, 'startViewTransition');
      }
    });

    it('follows the system setting when nothing says otherwise, and the option when given', () => {
      // jsdom has no matchMedia: the test provides one and removes it again
      Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        value: () => ({ matches: true }) as MediaQueryList,
      });
      try {
        expect(setup().dark()).toBe(true);
        TestBed.resetTestingModule();
        expect(setup({ dark: false }).dark()).toBe(false);
      } finally {
        Reflect.deleteProperty(window, 'matchMedia');
      }
    });
  });

  describe('primary colour', () => {
    it('points the primary scale at another colour scale', () => {
      const theme = setup();
      theme.setPrimary('emerald');
      TestBed.tick();
      for (const step of [50, 500, 950]) {
        expect(theme.css()).toContain(`--h-primary-${step}:var(--h-emerald-${step});`);
      }
      expect(sheet()).toBe(theme.css());
      expect(sheet()).toContain(':root:root{');
      expect(sheet()).not.toContain('--h-primary-color'); // the roles (600 light, 400 dark) stay the tokens'
    });

    it('offers every colour of the configurator, and noir', () => {
      expect(HX_PRIMARY_COLORS).toHaveLength(17);
      expect(HX_PRIMARY_COLORS).toContain('noir');
      const theme = setup();
      for (const color of HX_PRIMARY_COLORS) {
        theme.setPrimary(color);
        expect(theme.css(), color).toContain('--h-primary-500:');
      }
    });

    it('noir uses the surface scale, with its own roles per colour scheme', () => {
      const theme = setup();
      theme.setPrimary('noir');
      const css = theme.css();
      expect(css).toContain('--h-primary-500:var(--h-surface-500);');
      expect(css).toMatch(/:root:root\{[^}]*--h-primary-color:var\(--h-primary-950\);/);
      expect(css).toMatch(/:root:root\.app-dark\{[^}]*--h-primary-color:var\(--h-primary-50\);/);
      expect(css).toContain('--h-highlight-background:var(--h-primary-950);');
    });

    it('goes back to the preset with null, and refuses an unknown colour', () => {
      const theme = setup();
      theme.setPrimary('rose');
      theme.setPrimary(null);
      expect(theme.css()).toBe('');
      expect(() => theme.setPrimary('chartreuse' as never)).toThrow(/unknown primary colour/);
    });
  });

  describe('surface', () => {
    it('writes the whole scale for both colour schemes', () => {
      const theme = setup();
      theme.setSurface('zinc');
      TestBed.tick();
      const css = theme.css();
      for (const step of [0, 50, 500, 950]) {
        const value = (HX_SURFACES.zinc as Record<number, string>)[step];
        expect(css).toContain(`--h-surface-${step}:${value};`);
      }
      expect(css.match(/--h-surface-0:/g)).toHaveLength(2);
      expect(css).toContain(':root:root.app-dark{');
      expect(sheet()).toBe(css);
    });

    it('offers the scales of the configurator', () => {
      expect(HX_SURFACE_NAMES).toEqual([
        'slate',
        'gray',
        'zinc',
        'neutral',
        'stone',
        'soho',
        'viva',
        'ocean',
      ]);
      for (const name of HX_SURFACE_NAMES) expect(Object.keys(HX_SURFACES[name])).toHaveLength(12);
    });

    it('goes back to the preset with null, and refuses an unknown scale', () => {
      const theme = setup();
      theme.setSurface('stone');
      theme.setSurface(null);
      expect(theme.css()).toBe('');
      expect(() => theme.setSurface('mud' as never)).toThrow(/unknown surface/);
    });
  });

  it('keeps both overrides side by side and updates one style sheet, not several', () => {
    const theme = setup();
    theme.setPrimary('teal');
    theme.setSurface('slate');
    TestBed.tick();
    expect(sheet()).toContain('--h-primary-500:var(--h-teal-500)');
    expect(sheet()).toContain('--h-surface-500:#64748b');
    theme.setPrimary('pink');
    TestBed.tick();
    expect(document.querySelectorAll('style[data-hx-theme]')).toHaveLength(1);
    expect(sheet()).toContain('--h-primary-500:var(--h-pink-500)');
    expect(sheet()).not.toContain('teal');
  });

  describe('persistence', () => {
    it('remembers nothing without a storage key', () => {
      const theme = setup();
      theme.setPrimary('lime');
      TestBed.tick();
      expect(localStorage.length).toBe(0);
    });

    it('saves the choice and reads it at the next start', () => {
      const theme = setup({ storageKey: 'my-theme' });
      theme.setDark(true);
      theme.setPrimary('violet');
      theme.setSurface('ocean');
      TestBed.tick();
      expect(JSON.parse(localStorage.getItem('my-theme') ?? '')).toEqual({
        dark: true,
        primary: 'violet',
        surface: 'ocean',
      });

      TestBed.resetTestingModule();
      html.classList.remove('app-dark');
      const next = setup({ storageKey: 'my-theme', dark: false, primary: 'rose' });
      expect(next.dark()).toBe(true); // what was saved wins over the options
      expect(next.primary()).toBe('violet');
      expect(next.surface()).toBe('ocean');
      expect(html.classList).toContain('app-dark');
    });

    it('starts from the defaults when the saved value is damaged or storage fails', () => {
      localStorage.setItem('bad', '{not json');
      expect(setup({ storageKey: 'bad' }).primary()).toBeNull();
      TestBed.resetTestingModule();
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota');
      });
      const theme = setup({ storageKey: 'full' });
      expect(() => {
        theme.setPrimary('sky');
        TestBed.tick();
      }).not.toThrow();
    });
  });

  it('does not touch the DOM on the server, but still knows its style text', () => {
    const theme = setup({ dark: true, primary: 'emerald' }, 'server');
    theme.setSurface('gray');
    TestBed.tick();
    expect(html.classList).not.toContain('app-dark');
    expect(sheet()).toBeNull();
    expect(theme.css()).toContain('--h-primary-500:var(--h-emerald-500)');
    expect(theme.css()).toContain('--h-surface-500:#6b7280');
  });

  it('removes its style sheet when it is destroyed (an instance that is not the root one)', () => {
    TestBed.configureTestingModule({});
    const child = createEnvironmentInjector(
      [HxTheme, { provide: HX_THEME_OPTIONS, useValue: {} }],
      TestBed.inject(EnvironmentInjector),
    );
    const theme = child.get(HxTheme);
    theme.setPrimary('cyan');
    TestBed.tick();
    expect(sheet()).toContain('--h-primary-500:var(--h-cyan-500)');
    child.destroy();
    expect(sheet()).toBeNull();
  });

  it('is created at start-up by provideHxTheme, with its options', async () => {
    localStorage.setItem('boot', JSON.stringify({ dark: true }));
    TestBed.configureTestingModule({ providers: [provideHxTheme({ storageKey: 'boot' })] });
    await TestBed.inject(ApplicationInitStatus).donePromise;
    TestBed.tick();
    expect(html.classList).toContain('app-dark');
  });
});

describe('parseDarkSelector', () => {
  it('reads a class and an attribute selector', () => {
    const el = document.createElement('div');
    parseDarkSelector('.night').apply(el, true);
    expect(el.classList).toContain('night');
    parseDarkSelector('[data-mode=dark]').apply(el, true);
    expect(el.getAttribute('data-mode')).toBe('dark');
    parseDarkSelector('[data-dark]').apply(el, true);
    expect(el.getAttribute('data-dark')).toBe('');
  });

  it('refuses anything else', () => {
    expect(() => parseDarkSelector('@media (prefers-color-scheme: dark)')).toThrow(
      /class .* or an attribute/,
    );
    expect(() => parseDarkSelector('body .dark')).toThrow();
  });
});
