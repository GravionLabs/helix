import { NgClass } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import type { HxMenuItem } from '@gravionlabs/helix-ui';
import { LayoutStore } from '../../store/layout.store';
import { HelixStatusBar } from '../status-bar/status-bar';
import { HelixTopbar } from '../topbar/topbar';
import { HelixAppLayout } from './app-layout';

describe('HelixAppLayout', () => {
  let component: HelixAppLayout;
  let fixture: ComponentFixture<HelixAppLayout>;
  let store: InstanceType<typeof LayoutStore>;

  beforeEach(async () => {
    localStorage.clear();
    // Override template, imports and styles BEFORE compileComponents() to prevent jsdom from
    // choking on HelixConfig CSS that uses `border: solid var(--surface-border)`. The computed
    // signals under test live on the class and need no rendered child components.
    await TestBed.configureTestingModule({
      imports: [HelixAppLayout],
      providers: [provideRouter([])],
    })
      .overrideComponent(HelixAppLayout, {
        set: { template: '<div></div>', imports: [], styles: [] },
      })
      .compileComponents();

    store = TestBed.inject(LayoutStore);
    store.reset();

    fixture = TestBed.createComponent(HelixAppLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default appTitle "Helix"', () => {
    expect(component.appTitle()).toBe('Helix');
  });

  it('should reflect custom appTitle input', () => {
    fixture.componentRef.setInput('appTitle', 'MY APP');
    expect(component.appTitle()).toBe('MY APP');
  });

  it('brandIcon() should reflect input', () => {
    expect(component.brandIcon()).toBeUndefined();
    fixture.componentRef.setInput('brandIcon', '<svg><path d="..." /></svg>');
    expect(component.brandIcon()).toBe('<svg><path d="..." /></svg>');
  });

  it('containerClass() should have layout-static when menuMode is static', () => {
    store.setMenuMode('static');
    const classes = component.containerClass();
    expect(classes['layout-static']).toBe(true);
    expect(classes['layout-overlay']).toBe(false);
  });

  it('containerClass() should have layout-overlay when menuMode is overlay', () => {
    store.setMenuMode('overlay');
    const classes = component.containerClass();
    expect(classes['layout-overlay']).toBe(true);
    expect(classes['layout-static']).toBe(false);
  });

  it('containerClass() should have layout-mobile-active when mobileMenuActive is true', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
    store.setMenuMode('static');
    store.onMenuToggle();
    const classes = component.containerClass();
    expect(classes['layout-mobile-active']).toBe(true);
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it('containerClass() should have layout-overlay-active when overlayMenuActive is true', () => {
    store.setMenuMode('overlay');
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    store.onMenuToggle();
    const classes = component.containerClass();
    expect(classes['layout-overlay-active']).toBe(true);
  });

  it('containerClass() still honours the legacy staticMenuDesktopInactive flag in static mode', () => {
    store.setMenuMode('static');
    // No longer reachable from the UI; kept in the store for compatibility.
    store.updateConfig({ staticMenuDesktopInactive: true } as never);
    const classes = component.containerClass();
    expect(classes['layout-static-inactive']).toBe(true);
  });

  it('containerClass() should have layout-sidebar-collapsed when sidebarCollapsed is true', () => {
    store.toggleSidebar();
    const classes = component.containerClass();
    expect(classes['layout-sidebar-collapsed']).toBe(true);
  });

  it('containerClass() should not have layout-sidebar-collapsed when sidebarCollapsed is false', () => {
    const classes = component.containerClass();
    expect(classes['layout-sidebar-collapsed']).toBe(false);
  });

  it('effectiveMenu() should return empty array when no input or route data', () => {
    const priv = component as unknown as { effectiveMenu: () => HxMenuItem[] };
    expect(priv.effectiveMenu()).toEqual([]);
  });

  it('effectiveMenu() should return input menu when set', () => {
    const menu = [{ label: 'Home', routerLink: ['/'] }];
    fixture.componentRef.setInput('menu', menu);
    expect((component as unknown as { effectiveMenu: () => HxMenuItem[] }).effectiveMenu()).toEqual(
      menu,
    );
  });

  describe('nav groups', () => {
    const menu = [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Components', items: [{ label: 'Button', path: '/uikit/button' }] },
    ];
    const groups = () =>
      (component as unknown as { effectiveNavGroups: () => unknown[] }).effectiveNavGroups();

    it('navStyle defaults to "sections"', () => {
      fixture.componentRef.setInput('menu', menu);
      expect(groups()).toEqual([
        { items: [menu[0]] },
        { section: 'Components', items: menu[1].items },
      ]);
    });

    it('navStyle "tree" keeps a single unlabeled group', () => {
      fixture.componentRef.setInput('menu', menu);
      fixture.componentRef.setInput('navStyle', 'tree');
      expect(groups()).toEqual([{ items: menu }]);
    });

    it('explicit navGroups win over the mapped menu', () => {
      const explicit = [{ section: 'Mine', items: [{ label: 'X', path: '/x' }] }];
      fixture.componentRef.setInput('menu', menu);
      fixture.componentRef.setInput('navGroups', explicit);
      expect(groups()).toEqual(explicit);
    });
  });

  it('should pass a custom environment through effectiveEnvironment', () => {
    const custom = { label: 'Sample data', severity: 'warn' } as const;
    fixture.componentRef.setInput('environment', custom);
    const priv = component as unknown as { effectiveEnvironment: () => unknown };
    expect(priv.effectiveEnvironment()).toEqual(custom);
  });

  it('should accept a custom statusBarEnvironment', () => {
    const custom = { label: 'Sample data', severity: 'info' } as const;
    fixture.componentRef.setInput('statusBarEnvironment', custom);
    expect(component.statusBarEnvironment()).toEqual(custom);
  });
});

@Component({
  imports: [HelixAppLayout],
  template: `
    <ng-template #tpl>Docs <a href="/docs">here</a></ng-template>
    <helix-app-layout [statusBarNote]="useTemplate() ? tpl : 'Plain note'">
      @if (withEnd()) {
        <button hxStatusBarEnd type="button">Help</button>
      }
    </helix-app-layout>
  `,
})
class LayoutHostComponent {
  useTemplate = signal(false);
  withEnd = signal(true);
}

describe('HelixAppLayout status bar forwarding', () => {
  let fixture: ComponentFixture<LayoutHostComponent>;
  let host: LayoutHostComponent;

  const note = (): HTMLElement => fixture.nativeElement.querySelector('.helix-status-bar-note');
  const end = (): HTMLElement => fixture.nativeElement.querySelector('.helix-status-bar-end');

  async function render(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LayoutHostComponent],
      providers: [provideRouter([])],
    })
      .overrideComponent(HelixAppLayout, {
        // Real template; only the status bar is real. Topbar, nav-rail and router-outlet are
        // left unknown (their CSS chokes jsdom), hence the schema.
        set: { imports: [HelixStatusBar], styles: [], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(LayoutHostComponent);
    host = fixture.componentInstance;
  });

  it('projects [hxStatusBarEnd] content into the status bar end slot', async () => {
    await render();
    expect(end().querySelector('button')?.textContent).toContain('Help');
  });

  it('leaves the end slot empty when no content is projected', async () => {
    host.withEnd.set(false);
    await render();
    expect(end().children.length).toBe(0);
    expect(Array.from(end().childNodes).filter((n) => n.nodeType === Node.TEXT_NODE)).toEqual([]);
  });

  it('renders a string statusBarNote', async () => {
    await render();
    expect(note().textContent?.trim()).toBe('Plain note');
  });

  it('renders a TemplateRef statusBarNote', async () => {
    host.useTemplate.set(true);
    await render();
    expect(note().querySelector('a')?.getAttribute('href')).toBe('/docs');
  });

  it('switches the note between string and TemplateRef at runtime', async () => {
    await render();
    host.useTemplate.set(true);
    await render();
    expect(note().querySelector('a')).not.toBeNull();
    host.useTemplate.set(false);
    await render();
    expect(note().querySelector('a')).toBeNull();
    expect(note().textContent?.trim()).toBe('Plain note');
  });
});

describe('HelixAppLayout topbar forwarding', () => {
  let fixture: ComponentFixture<LayoutHostComponent>;

  const centerSearch = (): HTMLElement | null =>
    fixture.nativeElement.querySelector('.layout-topbar-center helix-search-action');

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LayoutHostComponent],
      providers: [provideRouter([])],
    })
      .overrideComponent(HelixAppLayout, {
        // Real topbar; nav-rail and router-outlet stay unknown (their CSS chokes jsdom).
        set: { imports: [HelixTopbar], styles: [], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(LayoutHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders the default toolbar when topbarActions is not set', () => {
    expect(centerSearch()).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector('.layout-topbar-end helix-dark-mode-action'),
    ).toBeTruthy();
  });

  it('no longer projects [helixTopbarEnd] content', () => {
    expect(fixture.nativeElement.querySelector('[helixTopbarEnd]')).toBeNull();
  });

  it('forwards the typed search text as the search output', async () => {
    const texts: string[] = [];
    fixture.debugElement.children[0].componentInstance.search.subscribe((t: string) =>
      texts.push(t),
    );
    const input = centerSearch()?.querySelector('input') as HTMLInputElement;
    input.value = 'abc';
    input.dispatchEvent(new Event('input'));
    expect(texts).toEqual(['abc']);
  });
});

describe('HelixAppLayout inset frame', () => {
  let fixture: ComponentFixture<LayoutHostComponent>;

  const wrapper = (): HTMLElement => fixture.nativeElement.querySelector('.layout-wrapper');

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LayoutHostComponent],
      providers: [provideRouter([])],
    })
      .overrideComponent(HelixAppLayout, {
        set: { imports: [NgClass, HelixStatusBar], styles: [], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(LayoutHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders the content panel as the only child of the main container', () => {
    const container = wrapper().querySelector(':scope > .layout-main-container');
    expect(container?.children.length).toBe(1);
    expect(container?.firstElementChild?.classList.contains('layout-panel')).toBe(true);
  });

  it('puts the page header first in the panel, above the scrolling .layout-main', () => {
    const panel = wrapper().querySelector('.layout-panel') as HTMLElement;
    expect(panel.children[0].tagName.toLowerCase()).toBe('helix-topbar');
    expect(panel.children[1].classList.contains('layout-main')).toBe(true);
  });

  it('does not render the page header as a child of the frame', () => {
    expect(wrapper().querySelector(':scope > helix-topbar')).toBeNull();
  });

  it('keeps the nav rail, content panel and status bar as siblings on the frame', () => {
    const tags = Array.from(wrapper().children).map(
      (el) => el.tagName.toLowerCase() + (el.className ? `.${el.className}` : ''),
    );
    expect(tags).toContain('helix-nav-rail');
    expect(tags).toContain('div.layout-main-container');
    expect(tags).toContain('helix-status-bar');
  });

  it('adds no classic-layout class', () => {
    expect(wrapper().className).not.toContain('classic');
  });

  it('puts the static state class on the frame by default', () => {
    expect(wrapper().classList.contains('layout-static')).toBe(true);
    expect(wrapper().classList.contains('layout-overlay')).toBe(false);
  });

  describe('content panel', () => {
    const panel = (): HTMLElement => fixture.nativeElement.querySelector('.layout-main');
    const openMobileMenu = (): void => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
      TestBed.inject(LayoutStore).onMenuToggle();
    };

    afterEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it('keeps the page header, with the menu toggle, outside the inert region', () => {
      openMobileMenu();
      fixture.detectChanges();
      const header = fixture.nativeElement.querySelector('helix-topbar') as HTMLElement;
      expect(panel().contains(header)).toBe(false);
      expect(header.closest('[inert]')).toBeNull();
    });

    it('is not inert while the mobile menu is closed', () => {
      expect(panel().hasAttribute('inert')).toBe(false);
    });

    it('becomes inert while the mobile overlay menu is open', async () => {
      openMobileMenu();
      fixture.detectChanges();
      expect(panel().hasAttribute('inert')).toBe(true);
    });

    it('does not block scrolling on the document body', async () => {
      openMobileMenu();
      fixture.detectChanges();
      expect(document.body.classList.contains('blocked-scroll')).toBe(false);
    });

    it('resets its scroll offset to the top after navigation', async () => {
      const router = TestBed.inject(Router);
      router.resetConfig([
        { path: 'a', children: [] },
        { path: 'b', children: [] },
      ]);
      await router.navigateByUrl('/a');
      panel().scrollTop = 120;
      await router.navigateByUrl('/b');
      expect(panel().scrollTop).toBe(0);
    });

    it('keeps its offset when the navigation targets a fragment', async () => {
      const router = TestBed.inject(Router);
      router.resetConfig([{ path: 'a', children: [] }]);
      await router.navigateByUrl('/a');
      panel().scrollTop = 120;
      await router.navigateByUrl('/a#section');
      expect(panel().scrollTop).toBe(120);
    });
  });
});

describe('HelixAppLayout content gaps', () => {
  // The real stylesheet: jsdom does not resolve var(), so the rules are read as text.
  function layoutStyles(): string {
    TestBed.configureTestingModule({ imports: [HelixAppLayout], providers: [provideRouter([])] });
    TestBed.createComponent(HelixAppLayout);
    return Array.from(document.querySelectorAll('style'))
      .map((style) => style.textContent ?? '')
      .join('\n')
      .replace(/\s+/g, ' ');
  }

  function rule(css: string, selector: string): string {
    const match = css.match(new RegExp(`(?:^|[ }])${selector.replace('.', '\\.')} \\{([^}]*)\\}`));
    return match?.[1] ?? '';
  }

  it('gives the content below the page header the same gap as the content next to the nav rail', () => {
    const css = layoutStyles();
    // Horizontal: rail edge, then the container's panel gap, the panel border, the main padding.
    expect(rule(css, '.layout-main-container')).toContain('padding: var(--helix-panel-gap)');
    expect(rule(css, '.layout-panel')).toContain('border: var(--helix-panel-border-width) solid');
    expect(rule(css, '.layout-main')).toContain('padding: var(--helix-layout-gap)');
    // Vertical: the same three terms between the page header and the content.
    const top = rule(css, '.layout-main').match(/padding-top: calc\(([^;]*)\);/)?.[1] ?? '';
    expect(top.split('+').map((term) => term.trim().replace(/^var\((.*)\)$/, '$1'))).toEqual([
      '--helix-panel-gap',
      '--helix-panel-border-width',
      '--helix-layout-gap',
    ]);
  });
});
