import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HelixMobileMenuAction } from './mobile-menu-action';

describe('HelixMobileMenuAction', () => {
  let fixture: ComponentFixture<HelixMobileMenuAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixMobileMenuAction],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixMobileMenuAction);
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
