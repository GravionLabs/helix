import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HelixStatCard } from './stat-card';

@Component({
  imports: [HelixStatCard],
  template: `
    <helix-stat-card id="orders" label="Orders" [value]="152" icon="pi pi-shopping-cart" [trend]="trend()" trendUnit="" trendLabel="since last visit" />
    <helix-stat-card id="revenue" label="Revenue" [value]="2100" locale="en-US" [format]="{ style: 'currency', currency: 'USD' }" [trend]="-3.25" severity="warn" />
    <helix-stat-card id="plain" label="Comments" value="152 unread" />
  `,
})
class Host {
  trend = signal<number | undefined>(24);
}

describe('HelixStatCard', () => {
  let el: HTMLElement;
  let host: Host;
  let detect: () => void;
  const card = (id: string) => el.querySelector(`#${id}`) as HTMLElement;
  const text = (id: string, sel: string) => card(id).querySelector(sel)?.textContent?.trim();

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
    el = fixture.nativeElement;
    detect = () => fixture.detectChanges();
  });

  it('shows label, value and the icon box', () => {
    expect(text('orders', '.helix-stat-card__label')).toBe('Orders');
    expect(text('orders', '.helix-stat-card__value')).toBe('152');
    expect(card('orders').querySelector('.helix-stat-card__icon i')?.className).toBe(
      'pi pi-shopping-cart',
    );
    expect(card('orders').querySelector('.hx-card')?.getAttribute('aria-label')).toBe('Orders');
  });

  it('formats a numeric value and the trend with its direction', () => {
    expect(text('revenue', '.helix-stat-card__value')).toBe('$2,100.00');
    expect(text('revenue', '.helix-stat-card__trend-value')).toBe('-3.3%'); // trendDigits defaults to 1
    expect(text('revenue', '.helix-stat-card__sr')).toBe('down');
    expect(card('revenue').querySelector('.helix-stat-card__trend--down')).toBeTruthy();
    expect(card('revenue').classList.contains('helix-stat-card--warn')).toBe(true);
  });

  it('shows an upward trend with the unit and label, and none without a trend', () => {
    expect(text('orders', '.helix-stat-card__trend-value')).toBe('+24');
    expect(text('orders', '.helix-stat-card__sr')).toBe('up');
    expect(text('orders', '.helix-stat-card__trend-label')).toBe('since last visit');
    expect(card('plain').querySelector('.helix-stat-card__trend')).toBeNull();
    expect(text('plain', '.helix-stat-card__value')).toBe('152 unread');
    host.trend.set(0);
    detect();
    expect(text('orders', '.helix-stat-card__sr')).toBe('flat');
    expect(text('orders', '.helix-stat-card__trend-value')).toBe('0');
  });
});
