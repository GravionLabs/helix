import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GvEmpty } from './empty';

describe('GvEmpty', () => {
  let component: GvEmpty;
  let fixture: ComponentFixture<GvEmpty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GvEmpty],
    }).compileComponents();

    fixture = TestBed.createComponent(GvEmpty);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default title "Empty Page"', () => {
    expect(component.title()).toBe('Empty Page');
  });

  it('should have default description', () => {
    expect(component.description()).toBeTruthy();
  });

  it('should reflect custom title input', () => {
    fixture.componentRef.setInput('title', 'My Empty Page');
    fixture.detectChanges();
    expect(component.title()).toBe('My Empty Page');
  });

  it('should reflect custom description input', () => {
    fixture.componentRef.setInput('description', 'Custom description');
    fixture.detectChanges();
    expect(component.description()).toBe('Custom description');
  });
});
