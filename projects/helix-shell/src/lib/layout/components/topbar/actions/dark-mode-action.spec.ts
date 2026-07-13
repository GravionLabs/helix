import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HelixDarkModeAction } from './dark-mode-action';

describe('HelixDarkModeAction', () => {
  let component: HelixDarkModeAction;
  let fixture: ComponentFixture<HelixDarkModeAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixDarkModeAction],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixDarkModeAction);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle dark mode on click', () => {
    fixture.detectChanges();
    const store = component['store'];
    const initial = store.isDarkTheme();
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    expect(store.isDarkTheme()).toBe(!initial);
  });
});
