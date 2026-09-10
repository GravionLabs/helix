import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HelixBadge } from './badge';

describe('HelixBadge', () => {
  let component: HelixBadge;
  let fixture: ComponentFixture<HelixBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixBadge);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('severity', 'info');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect severity input', () => {
    expect(component.severity()).toBe('info');
  });

  it('should reflect label input', () => {
    fixture.componentRef.setInput('label', 'Info');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Info');
  });

  it('should reflect icon input', () => {
    fixture.componentRef.setInput('icon', 'pi pi-info-circle');
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('i');
    expect(icon).toBeTruthy();
    expect(icon.className).toContain('pi-info-circle');
  });

  it('should render with sm size', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.helix-badge--sm')).toBeTruthy();
  });

  it('should apply correct severity class', () => {
    fixture.componentRef.setInput('severity', 'warn');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.helix-badge--warn')).toBeTruthy();
  });
});
