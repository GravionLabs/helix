import { TestBed } from '@angular/core/testing';
import { HxBlocksSection } from './blocks-section';

describe('HxBlocksSection theme chooser', () => {
  it('offers the bundled presets and the preset of the app, helix first', () => {
    const component = TestBed.createComponent(HxBlocksSection).componentInstance;
    expect(component.presets).toEqual(['helix', 'vitepress', 'compact', 'forest']);
    expect(component.theme.preset()).toBe('helix');
  });

  it('the preset of the app sets primary and surface; the densities are the two of the theme', () => {
    const component = TestBed.createComponent(HxBlocksSection).componentInstance;
    expect(component.densities).toEqual(['comfortable', 'compact']);
    component.theme.setPreset('forest');
    expect(component.theme.activePrimary()).toBe('emerald');
    expect(component.theme.activeSurface()).toBe('stone');
  });
});
