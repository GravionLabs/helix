import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LayoutStore } from '../../store/layout.store';
import { HelixNavRailItem } from './nav-rail-item';

describe('HelixNavRailItem', () => {
  let component: HelixNavRailItem;
  let fixture: ComponentFixture<HelixNavRailItem>;

  beforeEach(async () => {
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
});
