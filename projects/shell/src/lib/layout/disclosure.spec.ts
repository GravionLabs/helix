import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HelixDisclosure } from './disclosure';

@Component({
  imports: [HelixDisclosure],
  template: `
    <button id="t" type="button" helixDisclosure>Toggle</button>
    <div id="p" class="hidden"><button id="inside">in</button></div>
    <button id="a" type="button" helixDisclosure helixDisclosureAnimate>Animated</button>
    <div id="ap" class="hidden">animated</div>
    <p id="outside">outside</p>
  `,
})
class Host {
  readonly dummy = signal(0);
}

describe('HelixDisclosure', () => {
  let fixture: ComponentFixture<Host>;
  const el = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const hidden = (id: string) => el(id).classList.contains('hidden');
  const tick = () => new Promise((r) => setTimeout(r));

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('starts collapsed and links trigger and panel for assistive technology', () => {
    expect(el('t').getAttribute('aria-expanded')).toBe('false');
    expect(hidden('p')).toBe(true);
  });

  it('shows and hides the next element on click', async () => {
    el('t').click();
    fixture.detectChanges();
    expect(hidden('p')).toBe(false);
    expect(el('t').getAttribute('aria-expanded')).toBe('true');
    expect(el('t').getAttribute('aria-controls')).toBe(el('p').id);

    el('t').click();
    fixture.detectChanges();
    expect(hidden('p')).toBe(true);
    expect(el('t').getAttribute('aria-expanded')).toBe('false');
  });

  it('closes on a click outside, but not on a click inside the panel', async () => {
    el('t').click();
    await tick();
    el('inside').click();
    expect(hidden('p')).toBe(false);
    el('outside').click();
    expect(hidden('p')).toBe(true);
  });

  it('closes on Escape and gives the focus back to the trigger', () => {
    el('t').click();
    el('inside').focus();
    el('t').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(hidden('p')).toBe(true);
    expect(document.activeElement).toBe(el('t'));
  });

  it('fades the panel in and out when animated', async () => {
    el('a').click();
    expect(el('ap').classList).toContain('animate-scalein');
    el('a').click();
    expect(el('ap').classList).toContain('animate-fadeout');
    await new Promise((r) => setTimeout(r, 450));
    expect(hidden('ap')).toBe(true);
    expect(el('ap').classList).not.toContain('animate-fadeout');
  });
});
