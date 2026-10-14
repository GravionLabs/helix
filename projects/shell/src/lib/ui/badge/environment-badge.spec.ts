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
    expect(el.querySelector('.helix-badge--warn')).not.toBeNull();
    expect(el.textContent?.trim()).toBe('Canary');
    expect(el.querySelector('i')).toBeNull();
  });

  it('should fall back to Unknown for an unrecognised string', () => {
    fixture.componentRef.setInput('environment', 'nonsense');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent?.trim()).toBe('Unknown');
    expect(el.querySelector('.helix-badge--info')).not.toBeNull();
  });

  it('should keep the visible label of known environments', () => {
    fixture.componentRef.setInput('environment', 'staging');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent?.trim()).toBe('Staging');
  });

  it('should expose the custom label as the whole visible text', () => {
    fixture.componentRef.setInput('environment', { label: 'Sample data', severity: 'info' });
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.helix-badge__label')?.textContent).toBe('Sample data');
    expect(el.textContent?.trim()).toBe('Sample data');
  });

  it('should show only the label text for a known value (icon has no text)', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent?.trim()).toBe('Development');
  });

  it.each(['constructor', 'toString', '__proto__', 'hasOwnProperty'])(
    'should fall back to Unknown for inherited key %s',
    (key) => {
      fixture.componentRef.setInput('environment', key);
      fixture.detectChanges();
      expect((fixture.nativeElement as HTMLElement).textContent?.trim()).toBe('Unknown');
    },
  );

  it('should render no label element for an empty custom label', () => {
    fixture.componentRef.setInput('environment', { label: '', severity: 'warn' });
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.helix-badge__label')).toBeNull();
    expect(el.textContent?.trim()).toBe('');
  });

  it('should switch between custom and known values', () => {
    const el = fixture.nativeElement as HTMLElement;
    fixture.componentRef.setInput('environment', { label: 'Canary', severity: 'error' });
    fixture.detectChanges();
    expect(el.textContent?.trim()).toBe('Canary');
    expect(el.querySelector('.helix-badge--error')).not.toBeNull();
    expect(el.querySelector('i')).toBeNull();

    fixture.componentRef.setInput('environment', 'production');
    fixture.detectChanges();
    expect(el.textContent?.trim()).toBe('Production');
    expect(el.querySelector('i.pi-verified')).not.toBeNull();

    fixture.componentRef.setInput('environment', { label: 'Back', severity: 'success' });
    fixture.detectChanges();
    expect(el.textContent?.trim()).toBe('Back');
    expect(el.querySelector('.helix-badge--success')).not.toBeNull();
    expect(el.querySelector('.helix-badge--error')).toBeNull();
  });
});
