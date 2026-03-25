import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GvHighlight } from '../../landing.model';
import { GvHighlightsWidget } from './highlights-widget';

describe('GvHighlightsWidget', () => {
  let component: GvHighlightsWidget;
  let fixture: ComponentFixture<GvHighlightsWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GvHighlightsWidget],
    }).compileComponents();

    fixture = TestBed.createComponent(GvHighlightsWidget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default sectionTitle "Powerful Everywhere"', () => {
    expect(component.sectionTitle()).toBe('Powerful Everywhere');
  });

  it('should have 2 default highlights', () => {
    expect(component.highlights().length).toBe(2);
  });

  it('should reflect custom sectionTitle input', () => {
    fixture.componentRef.setInput('sectionTitle', 'Custom Section');
    fixture.detectChanges();
    expect(component.sectionTitle()).toBe('Custom Section');
  });

  it('should reflect custom highlights input', () => {
    const highlights: GvHighlight[] = [
      {
        icon: 'pi pi-mobile',
        iconBgClass: 'bg-blue-200',
        iconColorClass: 'text-blue-700',
        title: 'Mobile',
        description: 'Mobile highlight',
        imageUrl: 'https://example.com/img.png',
        imageAlt: 'mobile',
        imageBgClass: 'bg-blue-100',
        imageAlign: 'left',
      },
    ];
    fixture.componentRef.setInput('highlights', highlights);
    fixture.detectChanges();
    expect(component.highlights().length).toBe(1);
    expect(component.highlights()[0].title).toBe('Mobile');
  });
});
