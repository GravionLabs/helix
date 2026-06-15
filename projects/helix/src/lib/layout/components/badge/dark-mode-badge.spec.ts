import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HelixDarkModeBadge } from './dark-mode-badge';

describe('HelixDarkModeBadge', () => {
  let component: HelixDarkModeBadge;
  let fixture: ComponentFixture<HelixDarkModeBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixDarkModeBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixDarkModeBadge);
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
