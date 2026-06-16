import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HelixAlertBadge } from './alert-badge';

describe('HelixAlertBadge', () => {
  let component: HelixAlertBadge;
  let fixture: ComponentFixture<HelixAlertBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixAlertBadge],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixAlertBadge);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('count', 3);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show count when > 0', () => {
    fixture.detectChanges();
    const countEl = fixture.nativeElement.querySelector('.alert-badge-count');
    expect(countEl).toBeTruthy();
    expect(countEl.textContent).toContain('3');
  });

  it('should hide count badge when count is 0', () => {
    fixture.componentRef.setInput('count', 0);
    fixture.detectChanges();
    const countEl = fixture.nativeElement.querySelector('.alert-badge-count');
    expect(countEl).toBeNull();
  });

  it('should show dropdown when alerts provided and button clicked', () => {
    fixture.componentRef.setInput('alerts', [{ id: '1', label: 'Alert 1', severity: 'error' }]);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    const dropdown = fixture.nativeElement.querySelector('.alert-badge-dropdown');
    expect(dropdown).toBeTruthy();
  });

  it('should render alert items in dropdown', () => {
    fixture.componentRef.setInput('alerts', [
      { id: '1', label: 'Alert 1', severity: 'warn' },
      { id: '2', label: 'Alert 2', severity: 'error' },
    ]);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.alert-badge-item');
    expect(items.length).toBe(2);
  });
});
