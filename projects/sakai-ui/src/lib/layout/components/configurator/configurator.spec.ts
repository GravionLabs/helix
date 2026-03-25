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
import { GvConfigurator } from './configurator';

describe('GvConfigurator', () => {
  let component: GvConfigurator;
  let fixture: ComponentFixture<GvConfigurator>;
  let store: InstanceType<typeof LayoutStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GvConfigurator],
      providers: [provideRouter([])],
    }).compileComponents();

    store = TestBed.inject(LayoutStore);
    store.reset();

    fixture = TestBed.createComponent(GvConfigurator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onMenuModeChange("overlay") should call store.setMenuMode("overlay")', () => {
    component.onMenuModeChange('overlay');
    expect(store.menuMode()).toBe('overlay');
  });

  it('onMenuModeChange("static") should call store.setMenuMode("static")', () => {
    store.setMenuMode('overlay');
    component.onMenuModeChange('static');
    expect(store.menuMode()).toBe('static');
  });

  it('onPresetChange("Lara") should call store.setPreset("Lara")', () => {
    component.onPresetChange('Lara');
    expect(store.preset()).toBe('Lara');
  });

  it('onPresetChange("Nora") should call store.setPreset("Nora")', () => {
    component.onPresetChange('Nora');
    expect(store.preset()).toBe('Nora');
  });

  it('updateColors(event, "primary", { name: "blue" }) should call store.setPrimary("blue")', () => {
    const event = new Event('click');
    component.updateColors(event, 'primary', { name: 'blue' });
    expect(store.primary()).toBe('blue');
  });

  it('updateColors(event, "surface", { name: "slate" }) should call store.setSurface("slate")', () => {
    const event = new Event('click');
    component.updateColors(event, 'surface', { name: 'slate' });
    expect(store.surface()).toBe('slate');
  });

  it('should expose presetOptions with Aura, Lara, Nora', () => {
    expect(component.presetOptions).toContain('Aura');
    expect(component.presetOptions).toContain('Lara');
    expect(component.presetOptions).toContain('Nora');
  });

  it('selectedPreset should reflect store.preset()', () => {
    store.setPreset('Lara');
    expect(component.selectedPreset()).toBe('Lara');
  });

  it('menuMode should reflect store.menuMode()', () => {
    store.setMenuMode('overlay');
    expect(component.menuMode()).toBe('overlay');
  });
});
