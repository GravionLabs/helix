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

  it('has no preset chooser any more: the Helix preset is the only one', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).not.toContain('Presets');
    expect(component).not.toHaveProperty('presetOptions');
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
