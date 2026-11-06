import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HxTheme } from '@gravionlabs/helix-ui';
import { LayoutStore } from '../../store/layout.store';
import { HelixConfigurator } from './configurator';

describe('HelixConfigurator', () => {
  let component: HelixConfigurator;
  let fixture: ComponentFixture<HelixConfigurator>;
  let store: InstanceType<typeof LayoutStore>;
  let theme: HxTheme;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixConfigurator],
      providers: [provideRouter([])],
    }).compileComponents();

    store = TestBed.inject(LayoutStore);
    theme = TestBed.inject(HxTheme);
    store.reset();

    fixture = TestBed.createComponent(HelixConfigurator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  const buttons = (heading: string) => {
    const el = fixture.nativeElement as HTMLElement;
    const label = [...el.querySelectorAll('span')].find((s) => s.textContent?.trim() === heading);
    return [...(label?.parentElement?.querySelectorAll('button') ?? [])] as HTMLButtonElement[];
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('activePrimaryColor is the colour of the Helix preset (indigo) until one is chosen', () => {
    expect(store.primary()).toBeNull();
    expect(component.activePrimaryColor()).toBe('indigo');
  });

  it('activePrimaryColor follows the chosen colour', () => {
    store.setPrimary('teal');
    expect(component.activePrimaryColor()).toBe('teal');
  });

  it('offers noir first and then the colours, each with the colour of its step 500 as swatch', () => {
    const names = component.primaryColors.map((c) => c.name);
    expect(names).toHaveLength(17);
    expect(names[0]).toBe('noir');
    expect(names).toContain('emerald');
    expect(component.primaryColors[0].swatch).toBe('var(--text-color)');
    expect(component.primaryColors.find((c) => c.name === 'emerald')?.swatch).toBe(
      'var(--h-emerald-500)',
    );
  });

  it('offers the eight surface scales with their step 500 as swatch', () => {
    expect(component.surfaces.map((s) => s.name)).toEqual([
      'slate',
      'gray',
      'zinc',
      'neutral',
      'stone',
      'soho',
      'viva',
      'ocean',
    ]);
    expect(component.surfaces.find((s) => s.name === 'slate')?.swatch).toBe('#64748b');
  });

  it('renders a swatch button per primary colour and per surface, with the choice outlined', () => {
    fixture.detectChanges();
    expect(buttons('Primary')).toHaveLength(17);
    expect(buttons('Surface')).toHaveLength(8);
    store.setPrimary('teal');
    fixture.detectChanges();
    const outlined = buttons('Primary').filter((b) => b.classList.contains('outline'));
    expect(outlined.map((b) => b.title)).toEqual(['teal']);
  });

  it('a click on a primary swatch sets the primary colour of the theme service', () => {
    fixture.detectChanges();
    buttons('Primary')
      .find((b) => b.title === 'rose')
      ?.click();
    expect(theme.primary()).toBe('rose');
    expect(store.primary()).toBe('rose');
  });

  it('a click on a surface swatch sets the surface of the theme service', () => {
    fixture.detectChanges();
    buttons('Surface')
      .find((b) => b.title === 'stone')
      ?.click();
    expect(theme.surface()).toBe('stone');
  });

  it('offers the three bundled presets, helix being the default', () => {
    expect(component.presetOptions()).toEqual([
      { label: 'Helix', value: 'helix' },
      { label: 'Vitepress', value: 'vitepress' },
      { label: 'Compact', value: 'compact' },
    ]);
    expect(component.preset()).toBe('helix');
  });

  it('onPresetChange("compact") selects the preset: the density follows, the swatch stays indigo', () => {
    component.onPresetChange('compact');
    expect(theme.preset()).toBe('compact');
    expect(component.density()).toBe('compact');
    expect(component.activePrimaryColor()).toBe('indigo');
  });

  it('the vitepress preset has a scale of its own: no swatch is marked active', () => {
    component.onPresetChange('vitepress');
    expect(component.activePrimaryColor()).toBeNull();
    fixture.detectChanges();
    expect(buttons('Primary').filter((b) => b.classList.contains('outline'))).toHaveLength(0);
  });

  it('a primary swatch chosen after a preset wins over it', () => {
    component.onPresetChange('vitepress');
    fixture.detectChanges();
    buttons('Primary')
      .find((b) => b.title === 'rose')
      ?.click();
    expect(component.activePrimaryColor()).toBe('rose');
    expect(theme.css()).not.toContain('#3451b2');
  });

  it('rejects an unknown preset', () => {
    expect(() => component.onPresetChange('poimen')).toThrow(/unknown preset/);
  });

  it('renders a Preset chooser above the Primary colour', () => {
    fixture.detectChanges();
    const labels = [...(fixture.nativeElement as HTMLElement).querySelectorAll('span')].map((s) =>
      s.textContent?.trim(),
    );
    expect(labels.indexOf('Preset')).toBeGreaterThanOrEqual(0);
    expect(labels.indexOf('Preset')).toBeLessThan(labels.indexOf('Primary'));
  });

  it('offers comfortable and compact, comfortable being the default', () => {
    expect(component.densityOptions.map((o) => o.value)).toEqual(['comfortable', 'compact']);
    expect(component.density()).toBe('comfortable');
  });

  it('onDensityChange("compact") sets the density of the theme service, and back', () => {
    component.onDensityChange('compact');
    expect(theme.density()).toBe('compact');
    expect(component.density()).toBe('compact');
    component.onDensityChange('comfortable');
    expect(theme.density()).toBe('comfortable');
  });

  it('renders a Density chooser', () => {
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Density');
  });

  it('places the Density chooser directly after the Primary colour', () => {
    fixture.detectChanges();
    const labels = [...(fixture.nativeElement as HTMLElement).querySelectorAll('span')].map((s) =>
      s.textContent?.trim(),
    );
    expect(labels.indexOf('Density')).toBe(labels.indexOf('Primary') + 1);
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

  it('updateColors(event, "primary", { name: "blue" }) should call store.setPrimary("blue")', () => {
    const event = new Event('click');
    component.updateColors(event, 'primary', { name: 'blue', swatch: '' });
    expect(store.primary()).toBe('blue');
  });

  it('updateColors(event, "surface", { name: "slate" }) should call store.setSurface("slate")', () => {
    const event = new Event('click');
    component.updateColors(event, 'surface', { name: 'slate', swatch: '' });
    expect(store.surface()).toBe('slate');
  });

  it('menuMode should reflect store.menuMode()', () => {
    store.setMenuMode('overlay');
    expect(component.menuMode()).toBe('overlay');
  });
});
