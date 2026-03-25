import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GvFeature, GvTestimonial } from '../../landing.model';
import { GvFeaturesWidget } from './features-widget';

describe('GvFeaturesWidget', () => {
  let component: GvFeaturesWidget;
  let fixture: ComponentFixture<GvFeaturesWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GvFeaturesWidget],
    }).compileComponents();

    fixture = TestBed.createComponent(GvFeaturesWidget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default sectionTitle "Marvelous Features"', () => {
    expect(component.sectionTitle()).toBe('Marvelous Features');
  });

  it('should have 9 default features', () => {
    expect(component.features().length).toBe(9);
  });

  it('should have a default testimonial', () => {
    expect(component.testimonial()).not.toBeNull();
  });

  it('should reflect custom sectionTitle input', () => {
    fixture.componentRef.setInput('sectionTitle', 'Our Features');
    fixture.detectChanges();
    expect(component.sectionTitle()).toBe('Our Features');
  });

  it('should reflect custom features input', () => {
    const features: GvFeature[] = [
      {
        icon: 'pi pi-star',
        iconBgClass: 'bg-blue-200',
        iconColorClass: 'text-blue-700',
        title: 'Custom',
        description: 'Custom feature',
      },
    ];
    fixture.componentRef.setInput('features', features);
    fixture.detectChanges();
    expect(component.features().length).toBe(1);
    expect(component.features()[0].title).toBe('Custom');
  });

  it('should reflect custom testimonial input', () => {
    const testimonial: GvTestimonial = { name: 'John', company: 'ACME', text: 'Great!' };
    fixture.componentRef.setInput('testimonial', testimonial);
    fixture.detectChanges();
    expect(component.testimonial()?.name).toBe('John');
  });

  it('should accept null testimonial', () => {
    fixture.componentRef.setInput('testimonial', null);
    fixture.detectChanges();
    expect(component.testimonial()).toBeNull();
  });
});
