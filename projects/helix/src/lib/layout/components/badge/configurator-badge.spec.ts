import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HelixConfiguratorBadge } from './configurator-badge';

describe('HelixConfiguratorBadge', () => {
  let fixture: ComponentFixture<HelixConfiguratorBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixConfiguratorBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixConfiguratorBadge);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render palette button', () => {
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn).toBeTruthy();
    expect(btn.classList.contains('layout-topbar-action-highlight')).toBe(true);
  });
});
