import { type ComponentFixture, TestBed } from '@angular/core/testing';
import type { HelixPricingPlan } from '../../landing.model';
import { HelixPricingWidget } from './pricing-widget';

describe('HelixPricingWidget', () => {
  let component: HelixPricingWidget;
  let fixture: ComponentFixture<HelixPricingWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixPricingWidget],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixPricingWidget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default sectionTitle "Matchless Pricing"', () => {
    expect(component.sectionTitle()).toBe('Matchless Pricing');
  });

  it('should have 3 default plans', () => {
    expect(component.plans().length).toBe(3);
  });

  it('should have default plan titles: Free, Startup, Enterprise', () => {
    const titles = component.plans().map((p) => p.title);
    expect(titles).toContain('Free');
    expect(titles).toContain('Startup');
    expect(titles).toContain('Enterprise');
  });

  it('should reflect custom sectionTitle input', () => {
    fixture.componentRef.setInput('sectionTitle', 'Our Plans');
    fixture.detectChanges();
    expect(component.sectionTitle()).toBe('Our Plans');
  });

  it('should reflect custom plans input', () => {
    const plans: HelixPricingPlan[] = [
      {
        title: 'Pro',
        price: '$10',
        pricePeriod: 'per month',
        imageUrl: 'https://example.com/pro.svg',
        imageAlt: 'pro',
        buttonLabel: 'Buy Pro',
        features: ['Feature A'],
      },
    ];
    fixture.componentRef.setInput('plans', plans);
    fixture.detectChanges();
    expect(component.plans().length).toBe(1);
    expect(component.plans()[0].title).toBe('Pro');
  });

  it('planSelect output should emit selected plan', () => {
    const emitted: HelixPricingPlan[] = [];
    component.planSelect.subscribe((p: HelixPricingPlan) => emitted.push(p));

    const plan = component.plans()[0];
    component.planSelect.emit(plan);

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toBe(plan);
  });
});
