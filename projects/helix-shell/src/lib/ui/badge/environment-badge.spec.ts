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
});
