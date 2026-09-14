vi.mock('@gravionlabs/helix-core/themes', () => ({
  $t: vi.fn(() => ({
    preset: vi.fn().mockReturnThis(),
    surfacePalette: vi.fn().mockReturnThis(),
    use: vi.fn().mockReturnThis(),
  })),
  updatePreset: vi.fn(),
  updateSurfacePalette: vi.fn(),
}));
vi.mock('@gravionlabs/helix-core/themes/aura', () => ({ auraPreset: { primitive: {} } }));
vi.mock('@gravionlabs/helix-core/themes/lara', () => ({ laraPreset: { primitive: {} } }));
vi.mock('@gravionlabs/helix-core/themes/nora', () => ({ noraPreset: { primitive: {} } }));

import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HelixLanding } from './landing';

describe('HelixLanding', () => {
  let component: HelixLanding;
  let fixture: ComponentFixture<HelixLanding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixLanding],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixLanding);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
