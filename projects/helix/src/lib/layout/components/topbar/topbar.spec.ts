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
import { LayoutStore } from '../../store/layout.store';
import { HelixTopbar } from './topbar';

describe('HelixTopbar', () => {
  let component: HelixTopbar;
  let fixture: ComponentFixture<HelixTopbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixTopbar],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixTopbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default appTitle "SAKAI"', () => {
    expect(component.appTitle()).toBe('SAKAI');
  });

  it('should reflect custom appTitle input', () => {
    fixture.componentRef.setInput('appTitle', 'MY APP');
    fixture.detectChanges();
    expect(component.appTitle()).toBe('MY APP');
  });

  it('should have 3 default topbarActions', () => {
    expect(component.topbarActions().length).toBe(3);
  });

  it('should reflect custom topbarActions input', () => {
    const actions = [{ icon: 'pi pi-star', label: 'Star' }];
    fixture.componentRef.setInput('topbarActions', actions);
    fixture.detectChanges();
    expect(component.topbarActions()).toEqual(actions);
  });

  it('should have store injected', () => {
    const store = TestBed.inject(LayoutStore);
    expect(component.store).toBe(store);
  });
});
