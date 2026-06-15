import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HelixMobileMenuBadge } from './mobile-menu-badge';

describe('HelixMobileMenuBadge', () => {
  let fixture: ComponentFixture<HelixMobileMenuBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixMobileMenuBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixMobileMenuBadge);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render mobile menu button', () => {
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn).toBeTruthy();
    expect(btn.classList.contains('layout-topbar-menu-button')).toBe(true);
  });
});
