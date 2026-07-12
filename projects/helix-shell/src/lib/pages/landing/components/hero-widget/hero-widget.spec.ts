import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HelixHeroWidget } from './hero-widget';

describe('HelixHeroWidget', () => {
  let component: HelixHeroWidget;
  let fixture: ComponentFixture<HelixHeroWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelixHeroWidget],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixHeroWidget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default headlineLight', () => {
    expect(component.headlineLight()).toBeTruthy();
  });

  it('should have default headline "eget magna fermentum"', () => {
    expect(component.headline()).toBe('eget magna fermentum');
  });

  it('should have default buttonLabel "Get Started"', () => {
    expect(component.buttonLabel()).toBe('Get Started');
  });

  it('should have default imageAlt "Hero Image"', () => {
    expect(component.imageAlt()).toBe('Hero Image');
  });

  it('should reflect custom headline input', () => {
    fixture.componentRef.setInput('headline', 'Custom Headline');
    fixture.detectChanges();
    expect(component.headline()).toBe('Custom Headline');
  });

  it('buttonClick output should emit when triggered', () => {
    let emitted = false;
    component.buttonClick.subscribe(() => (emitted = true));

    component.buttonClick.emit();

    expect(emitted).toBe(true);
  });
});
