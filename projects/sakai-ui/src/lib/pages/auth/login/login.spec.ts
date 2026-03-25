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
import { GvLogin, GvLoginCredentials } from './login';

describe('GvLogin', () => {
  let component: GvLogin;
  let fixture: ComponentFixture<GvLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GvLogin],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(GvLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default title "Welcome!"', () => {
    expect(component.title()).toBe('Welcome!');
  });

  it('should have default subtitle "Sign in to continue"', () => {
    expect(component.subtitle()).toBe('Sign in to continue');
  });

  it('should have default submitLabel "Sign In"', () => {
    expect(component.submitLabel()).toBe('Sign In');
  });

  it('should have default forgotPasswordLabel "Forgot password?"', () => {
    expect(component.forgotPasswordLabel()).toBe('Forgot password?');
  });

  it('should reflect custom title input', () => {
    fixture.componentRef.setInput('title', 'Login Now');
    fixture.detectChanges();
    expect(component.title()).toBe('Login Now');
  });

  it('onSubmit() should emit login output with email, password, rememberMe', () => {
    const emitted: GvLoginCredentials[] = [];
    component.login.subscribe((v: GvLoginCredentials) => emitted.push(v));

    component.email = 'test@example.com';
    component.password = 'secret';
    component.checked = true;
    component.onSubmit();

    expect(emitted.length).toBe(1);
    expect(emitted[0].email).toBe('test@example.com');
    expect(emitted[0].password).toBe('secret');
    expect(emitted[0].rememberMe).toBe(true);
  });

  it('onSubmit() should use checked=false when not set', () => {
    const emitted: GvLoginCredentials[] = [];
    component.login.subscribe((v: GvLoginCredentials) => emitted.push(v));

    component.email = 'user@example.com';
    component.password = 'pass';
    component.onSubmit();

    expect(emitted[0].rememberMe).toBe(false);
  });

  it('onForgotPassword() should emit forgotPassword output', () => {
    let emitted = false;
    component.forgotPassword.subscribe(() => (emitted = true));

    component.onForgotPassword();

    expect(emitted).toBe(true);
  });
});
