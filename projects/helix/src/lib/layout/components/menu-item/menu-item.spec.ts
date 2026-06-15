import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LayoutStore } from '../../store/layout.store';
import { HelixMenuItem } from './menu-item';

describe('HelixMenuItem', () => {
  let component: HelixMenuItem;
  let fixture: ComponentFixture<HelixMenuItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixMenuItem],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixMenuItem);
    component = fixture.componentInstance;
    // Provide a non-null item before change detection to avoid template errors
    fixture.componentRef.setInput('item', { label: 'Test' });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isActive() should be false when item has no path', () => {
    expect(component.isActive()).toBe(false);
  });

  it('isActive() should be false when store has no activePath', () => {
    const store = TestBed.inject(LayoutStore);
    store.setActivePath(null);
    fixture.componentRef.setInput('item', { label: 'Home', path: '/home' });
    fixture.detectChanges();
    expect(component.isActive()).toBe(false);
  });

  it('isActive() should be true when activePath matches item path', () => {
    const store = TestBed.inject(LayoutStore);
    store.setActivePath('/home');
    fixture.componentRef.setInput('item', { label: 'Home', path: '/home' });
    fixture.detectChanges();
    expect(component.isActive()).toBe(true);
  });

  it('isVisible() should be true when item has no visible property', () => {
    fixture.componentRef.setInput('item', { label: 'Home' });
    fixture.detectChanges();
    expect(component.isVisible()).toBe(true);
  });

  it('isVisible() should be false when item visible is false', () => {
    fixture.componentRef.setInput('item', { label: 'Home', visible: false });
    fixture.detectChanges();
    expect(component.isVisible()).toBe(false);
  });

  it('isVisible() should be true when item visible is true', () => {
    fixture.componentRef.setInput('item', { label: 'Home', visible: true });
    fixture.detectChanges();
    expect(component.isVisible()).toBe(true);
  });

  it('hasChildren() should be false when item has no items', () => {
    fixture.componentRef.setInput('item', { label: 'Home' });
    fixture.detectChanges();
    expect(component.hasChildren()).toBeFalsy();
  });

  it('hasChildren() should be true when item has child items', () => {
    fixture.componentRef.setInput('item', { label: 'Parent', items: [{ label: 'Child' }] });
    fixture.detectChanges();
    expect(component.hasChildren()).toBe(true);
  });

  it('isCollapsed() should reflect store sidebarCollapsed', () => {
    const store = TestBed.inject(LayoutStore);
    expect(component.isCollapsed()).toBe(false);
    store.toggleSidebar();
    fixture.detectChanges();
    expect(component.isCollapsed()).toBe(true);
  });

  it('should hide menu text when collapsed', () => {
    fixture.componentRef.setInput('item', {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: ['/'],
    });
    fixture.detectChanges();
    const textEl = fixture.nativeElement.querySelector('.layout-menuitem-text');
    expect(textEl).toBeTruthy();

    const store = TestBed.inject(LayoutStore);
    store.toggleSidebar();
    fixture.detectChanges();
    const textAfter = fixture.nativeElement.querySelector('.layout-menuitem-text');
    expect(textAfter).toBeNull();
  });

  it('should add layout-sidebar-collapsed class when collapsed', () => {
    fixture.detectChanges();
    const hostEl = fixture.nativeElement;
    expect(hostEl.classList.contains('layout-sidebar-collapsed')).toBe(false);

    const store = TestBed.inject(LayoutStore);
    store.toggleSidebar();
    fixture.detectChanges();
    expect(hostEl.classList.contains('layout-sidebar-collapsed')).toBe(true);
  });
});
