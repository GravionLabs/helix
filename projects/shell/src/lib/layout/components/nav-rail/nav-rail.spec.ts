import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LayoutStore } from '../../store/layout.store';
import { HelixNavRail } from './nav-rail';

describe('HelixNavRail', () => {
  let component: HelixNavRail;
  let fixture: ComponentFixture<HelixNavRail>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [HelixNavRail],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixNavRail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a section label for each named group', () => {
    fixture.componentRef.setInput('model', [
      { section: 'Overview', items: [{ label: 'Dashboard', path: '/dashboard' }] },
      { section: 'Workspace', items: [{ label: 'Projects', path: '/projects' }] },
    ]);
    fixture.detectChanges();

    const sections = fixture.nativeElement.querySelectorAll('.helix-nav-rail-section');
    expect(sections.length).toBe(2);
    expect(sections[0].textContent.trim()).toBe('Overview');
    expect(sections[1].textContent.trim()).toBe('Workspace');
  });

  it('should render a helix-nav-rail-item for each item across all groups', () => {
    fixture.componentRef.setInput('model', [
      {
        section: 'Overview',
        items: [
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Analytics', path: '/analytics' },
        ],
      },
    ]);
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('[helix-nav-rail-item]');
    expect(items.length).toBe(2);
  });

  it('should have a collapse toggle button', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.helix-nav-rail-collapse-button');
    expect(button).toBeTruthy();
  });

  it('should toggle store.sidebarCollapsed on collapse button click', () => {
    fixture.detectChanges();
    const store = TestBed.inject(LayoutStore);
    expect(store.sidebarCollapsed()).toBe(false);

    const button = fixture.nativeElement.querySelector('.helix-nav-rail-collapse-button');
    button.click();
    fixture.detectChanges();
    expect(store.sidebarCollapsed()).toBe(true);
  });

  it('should hide section labels when collapsed', () => {
    fixture.componentRef.setInput('model', [
      { section: 'Overview', items: [{ label: 'Dashboard', path: '/dashboard' }] },
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.helix-nav-rail-section')).toBeTruthy();

    const store = TestBed.inject(LayoutStore);
    store.toggleSidebar();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.helix-nav-rail-section')).toBeNull();
  });

  it('renders the appTitle in the brand area', () => {
    fixture.componentRef.setInput('appTitle', 'Acme');
    fixture.detectChanges();

    const brandEl = fixture.nativeElement.querySelector('.helix-nav-rail-brand');
    expect(brandEl?.textContent).toContain('Acme');
  });

  it('renders default SVG icon when brandIcon is not set', () => {
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('.helix-nav-rail-brand svg');
    expect(svg).toBeTruthy();
  });

  it('renders an img tag when brandIcon is a URL', () => {
    fixture.componentRef.setInput('brandIcon', '/assets/logo.svg');
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('.helix-nav-rail-brand img');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('/assets/logo.svg');
  });

  it('renders inline SVG when brandIcon starts with <svg', () => {
    fixture.componentRef.setInput(
      'brandIcon',
      '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>',
    );
    fixture.detectChanges();
    expect((component as unknown as { isInlineSvg: () => boolean }).isInlineSvg()).toBe(true);
  });

  describe('collapsed sections', () => {
    it('shows a section with an icon as one entry with a flyout of its items', () => {
      fixture.componentRef.setInput('model', [
        {
          section: 'Components',
          icon: 'pi pi-th-large',
          items: [
            { label: 'Button', path: '/uikit/button' },
            { label: 'Table', path: '/uikit/table' },
          ],
        },
      ]);
      TestBed.inject(LayoutStore).toggleSidebar();
      fixture.detectChanges();

      const entries = fixture.nativeElement.querySelectorAll(':scope .helix-nav-rail-list > li');
      expect(entries.length).toBe(1);

      const link: HTMLElement = entries[0].querySelector('a');
      link.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      fixture.detectChanges();

      const flyout = fixture.nativeElement.querySelector('.helix-nav-rail-flyout');
      expect(flyout.textContent).toContain('Components');
      expect(flyout.textContent).toContain('Button');
      expect(flyout.textContent).toContain('Table');
    });

    it('lists the items directly when the section has no icon', () => {
      fixture.componentRef.setInput('model', [
        { section: 'Pages', items: [{ label: 'Landing', path: '/landing', icon: 'pi pi-home' }] },
      ]);
      TestBed.inject(LayoutStore).toggleSidebar();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll('[helix-nav-rail-item]').length).toBe(1);
      expect(fixture.nativeElement.querySelector('.helix-nav-rail-flyout')).toBeNull();
    });
  });

  describe('filter, groups and shortcut', () => {
    const model = [
      {
        section: 'Overview',
        items: [
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Analytics', path: '/analytics' },
        ],
      },
      { section: 'Workspace', items: [{ label: 'Projects', path: '/projects' }] },
    ];
    const type = (value: string) => {
      const input = fixture.nativeElement.querySelector('.helix-nav-rail-search input');
      input.value = value;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };

    beforeEach(() => {
      fixture.componentRef.setInput('model', model);
      fixture.detectChanges();
    });

    it('filters the items by label and drops sections without a match', () => {
      type('proj');
      const items = fixture.nativeElement.querySelectorAll('[helix-nav-rail-item]');
      expect(items.length).toBe(1);
      expect(fixture.nativeElement.querySelectorAll('.helix-nav-rail-section').length).toBe(1);
      type('');
      expect(fixture.nativeElement.querySelectorAll('[helix-nav-rail-item]').length).toBe(3);
    });

    it('collapses a section and remembers it', () => {
      const section = fixture.nativeElement.querySelector('.helix-nav-rail-section');
      expect(section.getAttribute('aria-expanded')).toBe('true');
      section.click();
      fixture.detectChanges();
      expect(section.getAttribute('aria-expanded')).toBe('false');
      expect(localStorage.getItem('helix.nav-rail.collapsed-groups')).toBe('["Overview"]');
      expect(fixture.nativeElement.querySelector('.helix-nav-rail-list').hidden).toBe(true);
    });

    it('focuses the filter on Ctrl+K and expands a collapsed rail', async () => {
      const store = TestBed.inject(LayoutStore);
      store.toggleSidebar();
      fixture.detectChanges();
      expect(store.isCollapsed()).toBe(true);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
      await new Promise((resolve) => setTimeout(resolve));
      fixture.detectChanges();
      expect(store.isCollapsed()).toBe(false);
      await new Promise((resolve) => setTimeout(resolve));
      expect(document.activeElement).toBe(
        fixture.nativeElement.querySelector('.helix-nav-rail-search input'),
      );
    });
  });
});
