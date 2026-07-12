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
import { HelixNotfound, type HelixNotfoundSuggestion } from './notfound';

describe('HelixNotfound', () => {
  let component: HelixNotfound;
  let fixture: ComponentFixture<HelixNotfound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixNotfound],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixNotfound);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default errorCode "404"', () => {
    expect(component.errorCode()).toBe('404');
  });

  it('should have default title "Not Found"', () => {
    expect(component.title()).toBe('Not Found');
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

  it('should have 3 default suggestions', () => {
    expect(component.suggestions().length).toBe(3);
  });

  it('should reflect custom errorCode input', () => {
    fixture.componentRef.setInput('errorCode', '403');
    fixture.detectChanges();
    expect(component.errorCode()).toBe('403');
  });

  it('should reflect custom suggestions input', () => {
    const suggestions: HelixNotfoundSuggestion[] = [
      { icon: 'pi pi-home', title: 'Home', description: 'Go home', route: '/' },
    ];
    fixture.componentRef.setInput('suggestions', suggestions);
    fixture.detectChanges();
    expect(component.suggestions().length).toBe(1);
  });
});
