import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HelixAccess } from './access';

describe('HelixAccess', () => {
  let component: HelixAccess;
  let fixture: ComponentFixture<HelixAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixAccess],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixAccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default title "Access Denied"', () => {
    expect(component.title()).toBe('Access Denied');
  });

  it('should have default message', () => {
    expect(component.message()).toBeTruthy();
  });

  it('should have default buttonLabel "Go to Dashboard"', () => {
    expect(component.buttonLabel()).toBe('Go to Dashboard');
  });

  it('should have default buttonRoute "/"', () => {
    expect(component.buttonRoute()).toBe('/');
  });

  it('should reflect custom title input', () => {
    fixture.componentRef.setInput('title', 'Forbidden');
    fixture.detectChanges();
    expect(component.title()).toBe('Forbidden');
  });
});
