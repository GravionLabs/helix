import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Tooltip } from '@gravionlabs/helix-core/tooltip';
import { LayoutStore } from '../../store/layout.store';
import { HelixNavRailItem } from './nav-rail-item';

describe('HelixNavRailItem', () => {
  let component: HelixNavRailItem;
  let fixture: ComponentFixture<HelixNavRailItem>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [HelixNavRailItem],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixNavRailItem);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', { label: 'Test' });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hasChildren() should be false for a leaf item', () => {
    fixture.componentRef.setInput('item', { label: 'Dashboard', path: '/dashboard' });
    fixture.detectChanges();
    expect(component.hasChildren()).toBe(false);
  });

  it('hasChildren() should be true when item has child items', () => {
    fixture.componentRef.setInput('item', {
      label: 'Workspace',
      items: [{ label: 'Projects', path: '/projects' }],
    });
    fixture.detectChanges();
    expect(component.hasChildren()).toBe(true);
  });

  it('isActive() should be false when item has no path', () => {
    fixture.componentRef.setInput('item', { label: 'Dashboard' });
    fixture.detectChanges();
    expect(component.isActive()).toBe(false);
  });

  it('isActive() should be true when store.activePath matches the item path', () => {
    const store = TestBed.inject(LayoutStore);
    store.setActivePath('/dashboard');
    fixture.componentRef.setInput('item', { label: 'Dashboard', path: '/dashboard' });
    fixture.detectChanges();
    expect(component.isActive()).toBe(true);
  });

  it('isActive() should be false when the active path only shares a name prefix', () => {
    const store = TestBed.inject(LayoutStore);
    store.setActivePath('/uikit/dynamicform-advanced');
    fixture.componentRef.setInput('item', { label: 'Dynamic Form', path: '/uikit/dynamicform' });
    fixture.detectChanges();
    expect(component.isActive()).toBe(false);
  });

  it('isActive() should be true for a child route of the item path', () => {
    const store = TestBed.inject(LayoutStore);
    store.setActivePath('/uikit/dynamicform/details');
    fixture.componentRef.setInput('item', { label: 'Dynamic Form', path: '/uikit/dynamicform' });
    fixture.detectChanges();
    expect(component.isActive()).toBe(true);
  });

  it('isActive() should ignore query params and fragments on the active path', () => {
    const store = TestBed.inject(LayoutStore);
    store.setActivePath('/dashboard?tab=2#top');
    fixture.componentRef.setInput('item', { label: 'Dashboard', path: '/dashboard' });
    fixture.detectChanges();
    expect(component.isActive()).toBe(true);
  });

  it('isActive() should be false for an item with children, even if a child path matches', () => {
    const store = TestBed.inject(LayoutStore);
    store.setActivePath('/projects');
    fixture.componentRef.setInput('item', {
      label: 'Workspace',
      items: [{ label: 'Projects', path: '/projects' }],
    });
    fixture.detectChanges();
    expect(component.isActive()).toBe(false);
  });

  it('renders aria-current="page" on the active leaf link', () => {
    const store = TestBed.inject(LayoutStore);
    store.setActivePath('/dashboard');
    fixture.componentRef.setInput('item', {
      label: 'Dashboard',
      path: '/dashboard',
      routerLink: ['/dashboard'],
    });
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('a');
    expect(link.getAttribute('aria-current')).toBe('page');
  });

  it('hasActiveDescendant() should be true when a child path matches the active path', () => {
    const store = TestBed.inject(LayoutStore);
    store.setActivePath('/projects');
    fixture.componentRef.setInput('item', {
      label: 'Workspace',
      items: [{ label: 'Projects', path: '/projects' }],
    });
    fixture.detectChanges();
    expect(component.hasActiveDescendant()).toBe(true);
  });

  it('hasActiveDescendant() should be false when a child path only shares a name prefix', () => {
    const store = TestBed.inject(LayoutStore);
    store.setActivePath('/projects-archive');
    fixture.componentRef.setInput('item', {
      label: 'Workspace',
      items: [{ label: 'Projects', path: '/projects' }],
    });
    fixture.detectChanges();
    expect(component.hasActiveDescendant()).toBe(false);
  });

  it('isExpanded() defaults to true when it has an active descendant', () => {
    const store = TestBed.inject(LayoutStore);
    store.setActivePath('/projects');
    fixture.componentRef.setInput('item', {
      label: 'Workspace',
      items: [{ label: 'Projects', path: '/projects' }],
    });
    fixture.detectChanges();
    expect(component.isExpanded()).toBe(true);
  });

  it('clicking a parent item toggles isExpanded()', () => {
    fixture.componentRef.setInput('item', {
      label: 'Workspace',
      items: [{ label: 'Projects', path: '/projects' }],
    });
    fixture.detectChanges();
    expect(component.isExpanded()).toBe(false);

    const link = fixture.nativeElement.querySelector('a');
    link.click();
    fixture.detectChanges();
    expect(component.isExpanded()).toBe(true);

    link.click();
    fixture.detectChanges();
    expect(component.isExpanded()).toBe(false);
  });

  it('isCollapsed() should reflect store.sidebarCollapsed', () => {
    const store = TestBed.inject(LayoutStore);
    expect(component.isCollapsed()).toBe(false);
    store.toggleSidebar();
    fixture.detectChanges();
    expect(component.isCollapsed()).toBe(true);
  });

  it('should hide the label when collapsed', () => {
    fixture.componentRef.setInput('item', { label: 'Dashboard', path: '/dashboard' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.helix-nav-rail-label')).toBeTruthy();

    const store = TestBed.inject(LayoutStore);
    store.toggleSidebar();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.helix-nav-rail-label')).toBeNull();
  });

  describe('tree behaviour', () => {
    const workspace = { label: 'Workspace', items: [{ label: 'Projects', path: '/projects' }] };
    const reports = { label: 'Reports', items: [{ label: 'Monthly', path: '/monthly' }] };

    it('allows several groups to be expanded at once', () => {
      const store = TestBed.inject(LayoutStore);
      const other = TestBed.createComponent(HelixNavRailItem);
      other.componentRef.setInput('item', reports);
      fixture.componentRef.setInput('item', workspace);
      fixture.detectChanges();
      other.detectChanges();

      fixture.nativeElement.querySelector('a').click();
      other.nativeElement.querySelector('a').click();
      fixture.detectChanges();
      other.detectChanges();

      expect(component.isExpanded()).toBe(true);
      expect(other.componentInstance.isExpanded()).toBe(true);
      expect(store.expandedKeys().length).toBe(2);
    });

    it('opens the group holding the active route when navigation happens', () => {
      const store = TestBed.inject(LayoutStore);
      fixture.componentRef.setInput('item', workspace);
      fixture.detectChanges();
      expect(component.isExpanded()).toBe(false);

      store.setActivePath('/projects');
      fixture.detectChanges();
      expect(component.isExpanded()).toBe(true);
    });

    it('lets the user collapse the group holding the active route', () => {
      TestBed.inject(LayoutStore).setActivePath('/projects');
      fixture.componentRef.setInput('item', workspace);
      fixture.detectChanges();
      expect(component.isExpanded()).toBe(true);

      fixture.nativeElement.querySelector('a').click();
      fixture.detectChanges();
      expect(component.isExpanded()).toBe(false);
    });

    it('exposes aria-expanded on expandable items only', () => {
      fixture.componentRef.setInput('item', workspace);
      fixture.detectChanges();
      const link = fixture.nativeElement.querySelector('a');
      expect(link.getAttribute('aria-expanded')).toBe('false');

      link.click();
      fixture.detectChanges();
      expect(link.getAttribute('aria-expanded')).toBe('true');

      fixture.componentRef.setInput('item', { label: 'Dashboard', path: '/d', routerLink: ['/d'] });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('a').hasAttribute('aria-expanded')).toBe(false);
    });

    it('toggles with Enter and Space, and opens/closes with ArrowRight/ArrowLeft', () => {
      fixture.componentRef.setInput('item', workspace);
      fixture.detectChanges();
      const link: HTMLElement = fixture.nativeElement.querySelector('a');
      const press = (key: string) => {
        link.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
        fixture.detectChanges();
      };

      press('Enter');
      expect(component.isExpanded()).toBe(true);
      press(' ');
      expect(component.isExpanded()).toBe(false);
      press('ArrowRight');
      expect(component.isExpanded()).toBe(true);
      press('ArrowLeft');
      expect(component.isExpanded()).toBe(false);
    });

    it('ArrowDown/ArrowUp move focus between links of the same nav', () => {
      const host = document.createElement('nav');
      document.body.appendChild(host);
      host.innerHTML =
        '<a class="helix-nav-rail-link" id="a" tabindex="0"></a><a class="helix-nav-rail-link" id="b" tabindex="0"></a>';
      const [a, b] = Array.from(host.querySelectorAll<HTMLElement>('a'));

      fixture.componentRef.setInput('item', { label: 'Dashboard', path: '/d', routerLink: ['/d'] });
      fixture.detectChanges();
      const own: HTMLElement = fixture.nativeElement.querySelector('a');
      own.className = 'helix-nav-rail-link';
      host.insertBefore(own, b);

      a.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      own.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(document.activeElement).toBe(b);
      host.remove();
    });
  });

  describe('collapsed rail', () => {
    const workspace = {
      label: 'Workspace',
      icon: 'pi pi-folder',
      items: [
        { label: 'Projects', path: '/projects', routerLink: ['/projects'] },
        { label: 'Archive', path: '/archive', routerLink: ['/archive'] },
      ],
    };
    const flyout = (): HTMLElement | null =>
      fixture.nativeElement.querySelector('.helix-nav-rail-flyout');
    const host = (): HTMLElement => fixture.nativeElement;
    const collapse = () => {
      TestBed.inject(LayoutStore).toggleSidebar();
      fixture.detectChanges();
    };

    it('shows a tooltip with the label on a leaf link, only when collapsed', () => {
      fixture.componentRef.setInput('item', {
        label: 'Dashboard',
        icon: 'pi pi-home',
        path: '/dashboard',
        routerLink: ['/dashboard'],
      });
      fixture.detectChanges();
      const tooltip = () => fixture.debugElement.query(By.directive(Tooltip)).injector.get(Tooltip);
      expect(tooltip().content()).toBe('Dashboard');
      expect(tooltip().disabled()).toBe(true);
      expect(host().querySelector('a')?.getAttribute('title')).toBe('Dashboard');

      collapse();
      expect(tooltip().disabled()).toBe(false);
      expect(tooltip().tooltipPosition()).toBe('right');
      expect(host().querySelector('a')?.hasAttribute('title')).toBe(false);
    });

    it('does not render a flyout while the rail is expanded', () => {
      fixture.componentRef.setInput('item', workspace);
      fixture.detectChanges();
      host().dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      expect(flyout()).toBeNull();
    });

    it('opens a flyout with the children on hover and closes it on mouse leave', () => {
      vi.useFakeTimers();
      fixture.componentRef.setInput('item', workspace);
      collapse();

      host().dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      expect(flyout()?.textContent).toContain('Workspace');
      expect(flyout()?.textContent).toContain('Projects');
      expect(flyout()?.textContent).toContain('Archive');

      host().dispatchEvent(new Event('mouseleave'));
      vi.advanceTimersByTime(200);
      fixture.detectChanges();
      expect(flyout()).toBeNull();
      vi.useRealTimers();
    });

    it('opens on keyboard focus and closes on Escape', async () => {
      fixture.componentRef.setInput('item', workspace);
      collapse();
      const link: HTMLElement = host().querySelector('a') as HTMLElement;

      document.body.appendChild(host());
      link.focus();
      await new Promise((resolve) => setTimeout(resolve));
      fixture.detectChanges();
      expect(flyout()).not.toBeNull();
      expect(link.getAttribute('aria-expanded')).toBe('true');

      link.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve));
      fixture.detectChanges();
      expect(flyout()).toBeNull();
    });

    it('opens with Enter and closes when navigation happens', () => {
      fixture.componentRef.setInput('item', workspace);
      collapse();
      const link: HTMLElement = host().querySelector('a') as HTMLElement;

      link.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      fixture.detectChanges();
      expect(flyout()).not.toBeNull();

      TestBed.inject(LayoutStore).setActivePath('/projects');
      fixture.detectChanges();
      expect(flyout()).toBeNull();
    });

    it('closes when focus leaves the item', () => {
      fixture.componentRef.setInput('item', workspace);
      collapse();
      const link: HTMLElement = host().querySelector('a') as HTMLElement;
      link.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      fixture.detectChanges();

      link.dispatchEvent(
        new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }),
      );
      fixture.detectChanges();
      expect(flyout()).toBeNull();
    });
  });
});
