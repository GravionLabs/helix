import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HelixEnvironmentBadge } from './environment-badge';

type HelixEnvBadgePrivate = { mapped: () => { severity: string; icon: string; label: string } };

describe('HelixEnvironmentBadge', () => {
  let component: HelixEnvironmentBadge;
  let fixture: ComponentFixture<HelixEnvironmentBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixEnvironmentBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixEnvironmentBadge);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('environment', 'development');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map development to success severity', () => {
    const priv = component as unknown as HelixEnvBadgePrivate;
    expect(priv.mapped().severity).toBe('success');
  });

  it('should map development to pi-code icon', () => {
    const priv = component as unknown as HelixEnvBadgePrivate;
    expect(priv.mapped().icon).toBe('pi pi-code');
  });

  it('should map development label to Development', () => {
    const priv = component as unknown as HelixEnvBadgePrivate;
    expect(priv.mapped().label).toBe('Development');
  });

  it('should map staging to warn severity', () => {
    fixture.componentRef.setInput('environment', 'staging');
    fixture.detectChanges();
    const priv = component as unknown as HelixEnvBadgePrivate;
    expect(priv.mapped().severity).toBe('warn');
  });

  it('should map production to error severity', () => {
    fixture.componentRef.setInput('environment', 'production');
    fixture.detectChanges();
    const priv = component as unknown as HelixEnvBadgePrivate;
    expect(priv.mapped().severity).toBe('error');
  });

  it('should map testing to info severity', () => {
    fixture.componentRef.setInput('environment', 'testing');
    fixture.detectChanges();
    const priv = component as unknown as HelixEnvBadgePrivate;
    expect(priv.mapped().severity).toBe('info');
  });

  it('should render a custom label and severity', () => {
    fixture.componentRef.setInput('environment', { label: 'Canary', severity: 'warn' });
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.helix-badge--warn')).toBeTruthy();
    expect(el.textContent?.trim()).toBe('Canary');
    expect(el.querySelector('i')).toBeNull();
  });

  it('should fall back to Unknown for an unrecognised string', () => {
    fixture.componentRef.setInput('environment', 'nonsense');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent?.trim()).toBe('Unknown');
    expect(el.querySelector('.helix-badge--info')).toBeTruthy();
  });

  it('should keep the visible label of known environments', () => {
    fixture.componentRef.setInput('environment', 'staging');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent?.trim()).toBe('Staging');
  });
});
