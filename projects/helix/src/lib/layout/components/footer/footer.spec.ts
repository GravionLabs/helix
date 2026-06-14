import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HelixFooter } from './footer';
import type { HelixFooterColumn } from './footer.model';

describe('HelixFooter', () => {
  let component: HelixFooter;
  let fixture: ComponentFixture<HelixFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixFooter],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default brandName "SAKAI"', () => {
    expect(component.brandName()).toBe('SAKAI');
  });

  it('should reflect custom brandName input', () => {
    fixture.componentRef.setInput('brandName', 'MY BRAND');
    fixture.detectChanges();
    expect(component.brandName()).toBe('MY BRAND');
  });

  it('should have default brandUrl', () => {
    expect(component.brandUrl()).toBe('https://primeng.org');
  });

  it('should reflect custom brandUrl input', () => {
    fixture.componentRef.setInput('brandUrl', 'https://example.com');
    fixture.detectChanges();
    expect(component.brandUrl()).toBe('https://example.com');
  });

  it('should have default columns as empty array', () => {
    expect(component.columns()).toEqual([]);
  });

  it('should reflect custom columns input', () => {
    const columns: HelixFooterColumn[] = [{ title: 'Company', links: [{ label: 'About' }] }];
    fixture.componentRef.setInput('columns', columns);
    fixture.detectChanges();
    expect(component.columns()).toEqual(columns);
  });
});
