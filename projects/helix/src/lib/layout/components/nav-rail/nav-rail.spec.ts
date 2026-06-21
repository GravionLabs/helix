import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LayoutStore } from '../../store/layout.store';
import { HelixNavRail } from './nav-rail';

describe('HelixNavRail', () => {
  let component: HelixNavRail;
  let fixture: ComponentFixture<HelixNavRail>;

  beforeEach(async () => {
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
});
