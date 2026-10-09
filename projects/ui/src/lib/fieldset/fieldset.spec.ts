import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxFieldset } from './fieldset';

@Component({
  imports: [HxFieldset],
  template: `
    <hx-fieldset id="plain" legend="Plain"><input id="a" /></hx-fieldset>
    <hx-fieldset id="tog" legend="Address" toggleable [(collapsed)]="closed"><input id="b" /></hx-fieldset>
  `,
})
class Host {
  closed = signal(false);
}

describe('HxFieldset', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const el = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const toggle = () => el('tog').querySelector('legend button') as HTMLButtonElement;
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
  });

  it('renders a native fieldset with a legend and the content', () => {
    const box = el('plain').querySelector('fieldset') as HTMLFieldSetElement;
    expect(box).toBeTruthy();
    expect(box.querySelector('legend')?.textContent?.trim()).toBe('Plain');
    expect(box.querySelector('input')).toBeTruthy();
    expect(el('plain').querySelector('legend button')).toBeNull();
  });

  it('holds a button in the legend that is expanded and controls the content', () => {
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    const content = el('tog').querySelector('.hx-fieldset-content') as HTMLElement;
    expect(toggle().getAttribute('aria-controls')).toBe(content.id);
    expect(toggle().textContent?.trim()).toBe('Address');
  });

  it('collapses on click, makes the content inert and keeps the two-way model', async () => {
    toggle().click();
    await settle();
    expect(host.closed()).toBe(true);
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    expect(el('tog').classList).toContain('hx-fieldset-collapsed');
    expect(el('tog').querySelector('.hx-fieldset-collapse')?.hasAttribute('inert')).toBe(true);
    host.closed.set(false);
    await settle();
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
  });

  it('keeps the toggle focusable by keyboard', () => {
    toggle().focus();
    expect(document.activeElement).toBe(toggle());
  });
});
