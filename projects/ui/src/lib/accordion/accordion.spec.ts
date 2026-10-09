import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HxAccordion,
  HxAccordionContent,
  HxAccordionHeader,
  HxAccordionPanel,
  type HxAccordionValue,
} from './accordion';

@Component({
  imports: [HxAccordion, HxAccordionPanel, HxAccordionHeader, HxAccordionContent],
  template: `
    <hx-accordion id="single" [(value)]="single" [headingLevel]="4">
      <hx-accordion-panel value="a"><hx-accordion-header>First</hx-accordion-header><hx-accordion-content>Content A</hx-accordion-content></hx-accordion-panel>
      <hx-accordion-panel value="b"><hx-accordion-header>Second</hx-accordion-header><hx-accordion-content>Content B</hx-accordion-content></hx-accordion-panel>
      <hx-accordion-panel value="c" disabled><hx-accordion-header>Third</hx-accordion-header><hx-accordion-content>Content C</hx-accordion-content></hx-accordion-panel>
      <hx-accordion-panel value="d"><hx-accordion-header>Fourth</hx-accordion-header><hx-accordion-content>Content D</hx-accordion-content></hx-accordion-panel>
    </hx-accordion>
    <hx-accordion id="multi" multiple [(value)]="multi">
      <hx-accordion-panel value="x"><hx-accordion-header>X</hx-accordion-header><hx-accordion-content>Content X</hx-accordion-content></hx-accordion-panel>
      <hx-accordion-panel value="y"><hx-accordion-header>Y</hx-accordion-header><hx-accordion-content>Content Y</hx-accordion-content></hx-accordion-panel>
    </hx-accordion>
  `,
})
class Host {
  single = signal<HxAccordionValue>('a');
  multi = signal<HxAccordionValue>(['x']);
}

describe('HxAccordion', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const el = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const triggers = (id: string) => [
    ...el(id).querySelectorAll<HTMLButtonElement>('.hx-accordion-trigger'),
  ];
  const regions = (id: string) => [...el(id).querySelectorAll<HTMLElement>('[role=region]')];
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
  });

  it('puts every header button in a heading of the requested level', () => {
    expect(el('single').querySelectorAll('h4 > .hx-accordion-trigger').length).toBe(4);
    expect(el('multi').querySelectorAll('h3 > .hx-accordion-trigger').length).toBe(2);
  });

  it('wires aria-expanded, aria-controls and labelled regions; the value opens a panel', () => {
    const [first, second] = triggers('single');
    expect(first.getAttribute('aria-expanded')).toBe('true');
    expect(second.getAttribute('aria-expanded')).toBe('false');
    expect(first.getAttribute('aria-controls')).toBe(regions('single')[0].id);
    expect(regions('single')[0].getAttribute('aria-labelledby')).toBe(first.id);
    expect(el('single').querySelectorAll('hx-accordion-content[inert]').length).toBe(3);
  });

  it('opens one panel at a time and writes the value', async () => {
    triggers('single')[1].click();
    await settle();
    expect(host.single()).toBe('b');
    expect(triggers('single').map((t) => t.getAttribute('aria-expanded'))).toEqual([
      'false',
      'true',
      'false',
      'false',
    ]);
    triggers('single')[1].click();
    await settle();
    expect(host.single()).toBeNull();
  });

  it('does not open a disabled panel', async () => {
    expect(triggers('single')[2].disabled).toBe(true);
    triggers('single')[2].click();
    await settle();
    expect(host.single()).toBe('a');
  });

  it('opens several panels with multiple', async () => {
    triggers('multi')[1].click();
    await settle();
    expect(host.multi()).toEqual(['x', 'y']);
    triggers('multi')[0].click();
    await settle();
    expect(host.multi()).toEqual(['y']);
  });

  it('follows the value when it is set from outside', async () => {
    host.single.set('d');
    await settle();
    expect(triggers('single').map((t) => t.getAttribute('aria-expanded'))).toEqual([
      'false',
      'false',
      'false',
      'true',
    ]);
  });

  it('moves between headers with Down, Up, Home and End, skipping disabled ones', async () => {
    const press = (key: string) =>
      (document.activeElement as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key, bubbles: true }),
      );
    const t = triggers('single');
    t[0].focus();
    press('ArrowDown');
    expect(document.activeElement).toBe(t[1]);
    press('ArrowDown');
    expect(document.activeElement).toBe(t[3]);
    press('ArrowDown');
    expect(document.activeElement).toBe(t[0]);
    press('ArrowUp');
    expect(document.activeElement).toBe(t[3]);
    press('Home');
    expect(document.activeElement).toBe(t[0]);
    press('End');
    expect(document.activeElement).toBe(t[3]);
  });
});
