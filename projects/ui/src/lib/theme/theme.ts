import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  computed,
  DestroyRef,
  type EnvironmentProviders,
  effect,
  Injectable,
  InjectionToken,
  inject,
  makeEnvironmentProviders,
  PLATFORM_ID,
  provideEnvironmentInitializer,
  signal,
} from '@angular/core';
import { HX_SURFACES, type HxSurface } from './surfaces';

/** The colour scales an app can choose as its primary colour; `noir` uses the surface scale (black and white). */
export const HX_PRIMARY_COLORS = [
  'emerald',
  'green',
  'lime',
  'orange',
  'amber',
  'yellow',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'noir',
] as const;
export type HxPrimaryColor = (typeof HX_PRIMARY_COLORS)[number];
export const HX_SURFACE_NAMES = Object.keys(HX_SURFACES) as HxSurface[];
export type { HxSurface };

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const SURFACE_STEPS = [0, ...STEPS] as const;

export interface HxThemeOptions {
  /**
   * How dark mode is switched on: a class on `<html>` (`.app-dark`, the default, also the selector of
   * `tokens.css`) or an attribute (`[data-theme="dark"]`).
   */
  darkSelector?: string;
  /** Where the choice is remembered (localStorage). `null` (the default) remembers nothing. */
  storageKey?: string | null;
  /** Dark mode when nothing is remembered; by default the system setting (`prefers-color-scheme`). */
  dark?: boolean;
  /** The primary colour when nothing is remembered; `null` is the one of the preset (indigo). */
  primary?: HxPrimaryColor | null;
  /** The surface scale when nothing is remembered; `null` is the one of the preset. */
  surface?: HxSurface | null;
  /**
   * Cross-fades the page when dark mode is switched, with the View Transitions API where the browser has it
   * (the first value at start-up is applied at once). Default `false`.
   */
  viewTransition?: boolean;
}

/** The scales of the surfaces, by name: for swatches in a colour chooser (`HX_SURFACES.zinc[500]`). */
export { HX_SURFACES };

export const HX_THEME_OPTIONS = new InjectionToken<HxThemeOptions>('HX_THEME_OPTIONS', {
  providedIn: 'root',
  factory: () => ({}),
});

interface Saved {
  dark?: boolean;
  primary?: HxPrimaryColor | null;
  surface?: HxSurface | null;
}

/** A class (`.app-dark`) or an attribute (`[data-theme="dark"]`) selector, split into what the DOM needs. */
export function parseDarkSelector(selector: string): {
  css: string;
  apply: (el: Element, on: boolean) => void;
} {
  const cls = /^\.([a-zA-Z][\w-]*)$/.exec(selector);
  if (cls) {
    return { css: selector, apply: (el, on) => el.classList.toggle(cls[1], on) };
  }
  const attr = /^\[([\w-]+)(?:=["']?([^"'\]]+)["']?)?\]$/.exec(selector);
  if (attr) {
    const [, name, value = ''] = attr;
    return {
      css: selector,
      apply: (el, on) => (on ? el.setAttribute(name, value) : el.removeAttribute(name)),
    };
  }
  throw new Error(
    `HxTheme darkSelector "${selector}": use a class (".app-dark") or an attribute ("[data-theme=dark]")`,
  );
}

const scale = (name: string) =>
  STEPS.map((step) => `--h-primary-${step}:var(--h-${name}-${step});`).join('');

/** The primary colour: its scale, and for `noir` the scheme-dependent roles that are no scale step. */
function primaryCss(primary: HxPrimaryColor, dark: string): string {
  if (primary !== 'noir') return `:root:root{${scale(primary)}}`;
  const light =
    `${STEPS.map((step) => `--h-primary-${step}:var(--h-surface-${step});`).join('')}` +
    '--h-primary-color:var(--h-primary-950);--h-primary-contrast-color:#ffffff;' +
    '--h-primary-hover-color:var(--h-primary-800);--h-primary-active-color:var(--h-primary-700);' +
    '--h-highlight-background:var(--h-primary-950);--h-highlight-focus-background:var(--h-primary-700);' +
    '--h-highlight-color:#ffffff;--h-highlight-focus-color:#ffffff;';
  const night =
    '--h-primary-color:var(--h-primary-50);--h-primary-contrast-color:var(--h-primary-950);' +
    '--h-primary-hover-color:var(--h-primary-200);--h-primary-active-color:var(--h-primary-300);' +
    '--h-highlight-background:var(--h-primary-50);--h-highlight-focus-background:var(--h-primary-300);' +
    '--h-highlight-color:var(--h-primary-950);--h-highlight-focus-color:var(--h-primary-950);';
  return `:root:root{${light}}:root:root${dark}{${night}}`;
}

/** The surface scale, the same in both colour schemes (as the configurator of the shell always did). */
function surfaceCss(surface: HxSurface, dark: string): string {
  const palette = HX_SURFACES[surface] as Record<number, string>;
  const body = SURFACE_STEPS.map((step) => `--h-surface-${step}:${palette[step]};`).join('');
  return `:root:root{${body}}:root:root${dark}{${body}}`;
}

/**
 * Switches dark mode, the primary colour and the surface scale while the app runs, with CSS custom properties
 * only: no styling engine, no rebuild of the tokens. `tokens.css` defines every `--h-*` token for the Helix look;
 * this service overrides the ones that carry the colour choice, in a style sheet of its own that wins over
 * `tokens.css` in both colour schemes.
 *
 * ```ts
 * // app.config.ts
 * provideHxTheme({ storageKey: 'my-app-theme' })
 *
 * // anywhere
 * readonly theme = inject(HxTheme);
 * theme.toggleDark();
 * theme.setPrimary('emerald');
 * theme.setSurface('zinc');
 * ```
 *
 * Nothing touches the DOM on the server; `css()` is the style text, for an app that renders it itself.
 */
@Injectable({ providedIn: 'root' })
export class HxTheme {
  readonly #doc = inject(DOCUMENT);
  readonly #browser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly #options = inject(HX_THEME_OPTIONS);
  readonly #darkSelector = parseDarkSelector(this.#options.darkSelector ?? '.app-dark');
  readonly #saved = this.#load();

  readonly #dark = signal(this.#saved.dark ?? this.#options.dark ?? this.#systemDark());
  readonly #primary = signal<HxPrimaryColor | null>(
    this.#saved.primary ?? this.#options.primary ?? null,
  );
  readonly #surface = signal<HxSurface | null>(
    this.#saved.surface ?? this.#options.surface ?? null,
  );

  readonly dark = this.#dark.asReadonly();
  readonly primary = this.#primary.asReadonly();
  readonly surface = this.#surface.asReadonly();

  /** The overrides for the chosen primary colour and surface (empty while both are the preset's own). */
  readonly css = computed(() => {
    const dark = this.#darkSelector.css;
    const primary = this.#primary();
    const surface = this.#surface();
    return `${surface ? surfaceCss(surface, dark) : ''}${primary ? primaryCss(primary, dark) : ''}`;
  });

  #darkApplied = false;
  #write: ((css: string) => void) | null = null;
  #remove: (() => void) | null = null;

  constructor() {
    effect(() => {
      const dark = this.#dark();
      if (!this.#browser) return;
      const root = this.#doc.documentElement;
      const doc = this.#doc as Document & { startViewTransition?: (update: () => void) => unknown };
      const apply = () => this.#darkSelector.apply(root, dark);
      // the first value is the start-up state: nothing to cross-fade from
      if (this.#darkApplied && this.#options.viewTransition && doc.startViewTransition) {
        doc.startViewTransition(apply);
      } else {
        apply();
      }
      this.#darkApplied = true;
    });
    effect(() => {
      const css = this.css();
      if (this.#browser) this.#writeSheet(css);
    });
    effect(() =>
      this.#save({ dark: this.#dark(), primary: this.#primary(), surface: this.#surface() }),
    );
    // an instance that is not the root one (provided on a component) takes its overrides with it
    inject(DestroyRef).onDestroy(() => this.#remove?.());
  }

  setDark(dark: boolean): void {
    this.#dark.set(dark);
  }

  toggleDark(): void {
    this.#dark.update((dark) => !dark);
  }

  /** `null` goes back to the primary colour of the preset. */
  setPrimary(primary: HxPrimaryColor | null): void {
    if (primary !== null && !HX_PRIMARY_COLORS.includes(primary))
      throw new Error(`unknown primary colour "${primary}"`);
    this.#primary.set(primary);
  }

  /** `null` goes back to the surface scale of the preset. */
  setSurface(surface: HxSurface | null): void {
    if (surface !== null && !(surface in HX_SURFACES))
      throw new Error(`unknown surface "${surface}"`);
    this.#surface.set(surface);
  }

  #systemDark(): boolean {
    const view = this.#doc.defaultView;
    return this.#browser && !!view?.matchMedia?.('(prefers-color-scheme: dark)').matches;
  }

  #load(): Saved {
    const key = this.#options.storageKey;
    if (!this.#browser || !key) return {};
    try {
      const value = JSON.parse(
        this.#doc.defaultView?.localStorage.getItem(key) ?? 'null',
      ) as Saved | null;
      return value && typeof value === 'object' ? value : {};
    } catch {
      return {}; // blocked or damaged storage: start from the defaults
    }
  }

  #save(state: Saved): void {
    const key = this.#options.storageKey;
    if (!this.#browser || !key) return;
    try {
      this.#doc.defaultView?.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // storage full or blocked: the choice just does not survive a reload
    }
  }

  /** One style sheet of the service: a constructed one where the browser has them, else a `<style>`. */
  #writeSheet(css: string): void {
    if (!this.#write) {
      const doc = this.#doc;
      const view = doc.defaultView as (Window & { CSSStyleSheet?: typeof CSSStyleSheet }) | null;
      if (
        view?.CSSStyleSheet &&
        'adoptedStyleSheets' in doc &&
        'replaceSync' in view.CSSStyleSheet.prototype
      ) {
        const sheet = new view.CSSStyleSheet();
        doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, sheet];
        this.#write = (text) => sheet.replaceSync(text);
        this.#remove = () => {
          doc.adoptedStyleSheets = doc.adoptedStyleSheets.filter((s) => s !== sheet);
        };
      } else {
        const style = doc.createElement('style');
        style.setAttribute('data-hx-theme', '');
        doc.head.appendChild(style);
        this.#write = (text) => {
          style.textContent = text;
        };
        this.#remove = () => style.remove();
      }
    }
    this.#write(css);
  }
}

/** Provides the theme service with its options and creates it at start-up, so the saved choice applies at once. */
export function provideHxTheme(options: HxThemeOptions = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: HX_THEME_OPTIONS, useValue: options },
    provideEnvironmentInitializer(() => {
      inject(HxTheme);
    }),
  ]);
}
