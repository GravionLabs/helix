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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LayoutStore } from '../../store/layout.store';
import { GvFloatingConfigurator } from './floating-configurator';

describe('GvFloatingConfigurator', () => {
  let component: GvFloatingConfigurator;
  let fixture: ComponentFixture<GvFloatingConfigurator>;
  let store: InstanceType<typeof LayoutStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GvFloatingConfigurator],
      providers: [provideRouter([])],
    }).compileComponents();

    store = TestBed.inject(LayoutStore);
    store.reset();

    fixture = TestBed.createComponent(GvFloatingConfigurator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default float input as true', () => {
    expect(component.float()).toBe(true);
  });

  it('should reflect float input when set to false', () => {
    fixture.componentRef.setInput('float', false);
    fixture.detectChanges();
    expect(component.float()).toBe(false);
  });

  it('isDarkTheme() should reflect store.darkTheme()', () => {
    expect(component.isDarkTheme()).toBe(false);
    store.toggleDarkMode();
    expect(component.isDarkTheme()).toBe(true);
  });

  it('toggleDarkMode() should toggle store.darkTheme()', () => {
    expect(store.darkTheme()).toBe(false);
    component.toggleDarkMode();
    expect(store.darkTheme()).toBe(true);
    component.toggleDarkMode();
    expect(store.darkTheme()).toBe(false);
  });

  it('should have store injected', () => {
    expect(component.store).toBe(store);
  });
});
