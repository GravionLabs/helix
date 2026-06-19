import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LayoutStore } from '../../store/layout.store';
import { HelixSidebar } from './sidebar';

describe('HelixSidebar', () => {
  let component: HelixSidebar;
  let fixture: ComponentFixture<HelixSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixSidebar],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a collapse toggle button', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.layout-sidebar-collapse-button');
    expect(button).toBeTruthy();
  });

  it('should toggle sidebarCollapsed on collapse button click', () => {
    fixture.detectChanges();
    const store = TestBed.inject(LayoutStore);
    expect(store.sidebarCollapsed()).toBe(false);

    const button = fixture.nativeElement.querySelector('.layout-sidebar-collapse-button');
    button.click();
    fixture.detectChanges();
    expect(store.sidebarCollapsed()).toBe(true);
  });

  it('should accept appTitle input', () => {
    fixture.detectChanges();
    expect(component.appTitle()).toBe('Helix');

    fixture.componentRef.setInput('appTitle', 'My App');
    expect(component.appTitle()).toBe('My App');
  });

  it('should pass menu input to helix-menu', () => {
    const menu = [{ label: 'Home', routerLink: ['/'] }];
    fixture.componentRef.setInput('menu', menu);
    fixture.detectChanges();

    const menuEl = fixture.nativeElement.querySelector('helix-menu');
    expect(menuEl).toBeTruthy();
  });

  it('menu input should be reflected as model passed to helix-menu', () => {
    const menu = [{ label: 'Home', routerLink: ['/'] }];
    fixture.componentRef.setInput('menu', menu);
    fixture.detectChanges();

    expect(component.menu()).toEqual(menu);
  });
});
