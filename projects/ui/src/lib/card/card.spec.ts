import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxCard } from './card';

@Component({
  imports: [HxCard],
  template: `
    <hx-card id="shortcut" title="Billing" subtitle="October" [headingLevel]="3">
      <img hxCardHeader src="x.png" alt="" />
      Total due
      <div hxCardFooter><button type="button">Pay</button></div>
    </hx-card>
    <hx-card id="slots">
      <span hxCardTitle>Slot title</span>
      <span hxCardSubtitle>Slot subtitle</span>
      Content only
    </hx-card>
    <hx-card id="bare">Just content</hx-card>
    <hx-card id="deep" title="Deep" [headingLevel]="9">x</hx-card>
  `,
})
class Host {}

describe('HxCard', () => {
  let fixture: ComponentFixture<Host>;
  const el = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
  });

  it('projects header, title, subtitle, content and footer into their regions', () => {
    const card = el('shortcut');
    expect(card.classList).toContain('hx-card');
    expect(card.querySelector('.hx-card-header img')).toBeTruthy();
    expect(card.querySelector('.hx-card-title')?.textContent?.trim()).toBe('Billing');
    expect(card.querySelector('.hx-card-subtitle')?.textContent?.trim()).toBe('October');
    expect(card.querySelector('.hx-card-content')?.textContent?.trim()).toBe('Total due');
    expect(card.querySelector('.hx-card-footer button')).toBeTruthy();
  });

  it('makes the title a heading of the requested level', () => {
    expect(el('shortcut').querySelector('h3.hx-card-title')).toBeTruthy();
    expect(el('slots').querySelector('h2.hx-card-title')).toBeTruthy();
    expect(el('deep').querySelector('h6.hx-card-title')).toBeTruthy();
  });

  it('takes the title and subtitle from slots too', () => {
    expect(el('slots').querySelector('.hx-card-title')?.textContent?.trim()).toBe('Slot title');
    expect(el('slots').querySelector('.hx-card-subtitle')?.textContent?.trim()).toBe(
      'Slot subtitle',
    );
    expect(el('slots').querySelector('.hx-card-content')?.textContent?.trim()).toBe('Content only');
  });

  it('leaves empty regions empty so they can be hidden', () => {
    const bare = el('bare');
    expect(bare.querySelector('.hx-card-header')?.childNodes.length).toBe(0);
    expect(bare.querySelector('.hx-card-footer')?.childNodes.length).toBe(0);
    expect(bare.querySelector('.hx-card-title')?.textContent).toBe('');
  });
});
