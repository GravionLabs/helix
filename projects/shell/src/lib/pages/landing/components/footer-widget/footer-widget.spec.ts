import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { HelixFooterColumn } from '../../../../layout/components/footer/footer.model';
import { HelixFooterWidget } from './footer-widget';

describe('HelixFooterWidget', () => {
  let component: HelixFooterWidget;
  let fixture: ComponentFixture<HelixFooterWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixFooterWidget],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixFooterWidget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 default columns', () => {
    expect(component.columns().length).toBe(4);
  });

  it('should have default homeRoute "/landing"', () => {
    expect(component.homeRoute()).toBe('/landing');
  });

  it('should have default brandName "SAKAI"', () => {
    expect(component.brandName()).toBe('SAKAI');
  });

  it('should reflect custom columns input', () => {
    const columns: HelixFooterColumn[] = [{ title: 'Custom', links: [{ label: 'Link 1' }] }];
    fixture.componentRef.setInput('columns', columns);
    fixture.detectChanges();
    expect(component.columns().length).toBe(1);
  });

  it('should reflect custom brandName input', () => {
    fixture.componentRef.setInput('brandName', 'MY BRAND');
    fixture.detectChanges();
    expect(component.brandName()).toBe('MY BRAND');
  });
});
