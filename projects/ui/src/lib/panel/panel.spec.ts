import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxPanel } from './panel';

@Component({
  imports: [HxPanel],
  template: `
    <hx-panel id="plain" header="Plain">Body<div hxPanelFooter>Foot</div></hx-panel>
    <hx-panel id="tog" header="Filters" toggleable [(collapsed)]="closed">
      <button hxPanelHeader type="button" id="act">Reset</button>
      Filter content <button type="button" id="inside">Inside</button>
    </hx-panel>
  `,
})
class Host {
  closed = signal(false);
}

describe('HxPanel', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const el = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const toggle = () => el('tog').querySelector('.hx-panel-toggle') as HTMLButtonElement;
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
  });

  it('shows header, content and footer; a plain panel has no toggle', () => {
    expect(el('plain').querySelector('.hx-panel-title')?.textContent).toBe('Plain');
    expect(el('plain').querySelector('.hx-panel-content')?.textContent?.trim()).toBe('Body');
    expect(el('plain').querySelector('.hx-panel-footer')?.textContent?.trim()).toBe('Foot');
    expect(el('plain').querySelector('.hx-panel-toggle')).toBeNull();
  });

  it('projects header actions next to the title', () => {
    expect(el('tog').querySelector('.hx-panel-header-actions #act')).toBeTruthy();
  });

  it('has a toggle button that is expanded and controls a labelled region', () => {
    const region = el('tog').querySelector('[role=region]') as HTMLElement;
    expect(toggle().tagName).toBe('BUTTON');
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    expect(toggle().getAttribute('aria-controls')).toBe(region.id);
    const title = el('tog').querySelector('.hx-panel-title') as HTMLElement;
    expect(region.getAttribute('aria-labelledby')).toBe(title.id);
    expect(toggle().getAttribute('aria-labelledby')).toBe(title.id);
  });

  it('collapses and expands on click and keeps the two-way model', async () => {
    toggle().click();
    await settle();
    expect(host.closed()).toBe(true);
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    expect(el('tog').classList).toContain('hx-panel-collapsed');
    expect(el('tog').querySelector('.hx-panel-collapse')?.hasAttribute('inert')).toBe(true);
    host.closed.set(false);
    await settle();
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    expect(el('tog').querySelector('.hx-panel-collapse')?.hasAttribute('inert')).toBe(false);
  });

  it('is reachable and operable by keyboard (a native button)', () => {
    toggle().focus();
    expect(document.activeElement).toBe(toggle());
  });
});
