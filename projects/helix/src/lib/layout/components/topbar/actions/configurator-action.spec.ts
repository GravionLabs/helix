import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HelixConfiguratorAction } from './configurator-action';

describe('HelixConfiguratorAction', () => {
  let fixture: ComponentFixture<HelixConfiguratorAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixConfiguratorAction],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixConfiguratorAction);
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
