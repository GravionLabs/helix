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
import { GvError } from './error';

describe('GvError', () => {
  let component: GvError;
  let fixture: ComponentFixture<GvError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GvError],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(GvError);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default title "Error Occured"', () => {
    expect(component.title()).toBe('Error Occured');
  });

  it('should have default message', () => {
    expect(component.message()).toBeTruthy();
  });

  it('should have default buttonLabel "Go to Dashboard"', () => {
    expect(component.buttonLabel()).toBe('Go to Dashboard');
  });

  it('should have default buttonRoute "/"', () => {
    expect(component.buttonRoute()).toBe('/');
  });

  it('should reflect custom title input', () => {
    fixture.componentRef.setInput('title', '500 Internal Error');
    fixture.detectChanges();
    expect(component.title()).toBe('500 Internal Error');
  });
});
