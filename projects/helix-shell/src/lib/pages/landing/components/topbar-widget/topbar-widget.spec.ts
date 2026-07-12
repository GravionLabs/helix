vi.mock('@primeuix/themes', () => ({
  $t: vi.fn(() => ({
    preset: vi.fn().mockReturnThis(),
    surfacePalette: vi.fn().mockReturnThis(),
    use: vi.fn().mockReturnThis(),
  })),
  updatePreset: vi.fn(),
  updateSurfacePalette: vi.fn(),
}));
vi.mock('@primeuix/themes/aura', () => ({ default: { primitive: {} } }));
vi.mock('@primeuix/themes/lara', () => ({ default: { primitive: {} } }));
vi.mock('@primeuix/themes/nora', () => ({ default: { primitive: {} } }));

import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { HelixNavLink } from '../../landing.model';
import { HelixTopbarWidget } from './topbar-widget';

describe('HelixTopbarWidget', () => {
  let component: HelixTopbarWidget;
  let fixture: ComponentFixture<HelixTopbarWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixTopbarWidget],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixTopbarWidget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 default navLinks', () => {
    expect(component.navLinks().length).toBe(4);
  });

  it('default navLinks should include Home, Features, Highlights, Pricing', () => {
    const labels = component.navLinks().map((l) => l.label);
    expect(labels).toContain('Home');
    expect(labels).toContain('Features');
    expect(labels).toContain('Highlights');
    expect(labels).toContain('Pricing');
  });

  it('should have default loginLabel "Login"', () => {
    expect(component.loginLabel()).toBe('Login');
  });

  it('should have default registerLabel "Register"', () => {
    expect(component.registerLabel()).toBe('Register');
  });

  it('should reflect custom navLinks input', () => {
    const navLinks: HelixNavLink[] = [{ label: 'About', route: '/about', fragment: 'about' }];
    fixture.componentRef.setInput('navLinks', navLinks);
    fixture.detectChanges();
    expect(component.navLinks().length).toBe(1);
    expect(component.navLinks()[0].label).toBe('About');
  });
});
