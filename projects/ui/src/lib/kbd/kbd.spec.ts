import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxKbd, type HxKbdSeparator, type HxKbdSize } from './kbd';

@Component({
  imports: [HxKbd],
  template: `<hx-kbd [keys]="keys()" [size]="size()" [separator]="separator()" />`,
})
class Host {
  keys = signal<string[]>(['Ctrl', 'Shift', 'P']);
  size = signal<HxKbdSize>('md');
  separator = signal<HxKbdSeparator | undefined>(undefined);
}

describe('HxKbd', () => {
  let fixture: ComponentFixture<Host>;
  const host = () => fixture.nativeElement.querySelector('hx-kbd') as HTMLElement;
  const caps = () => [...host().querySelectorAll('kbd.hx-kbd-key')].map((e) => e.textContent);
  const seps = () => host().querySelectorAll('.hx-kbd-separator');

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
  });

  it('renders one cap per key, in order, as <kbd>', () => {
    expect(caps()).toEqual(['Ctrl', 'Shift', 'P']);
    expect(host().classList).toContain('hx-kbd');
  });

  it('updates when the keys change and renders nothing for none', async () => {
    fixture.componentInstance.keys.set(['Esc']);
    await fixture.whenStable();
    expect(caps()).toEqual(['Esc']);
    fixture.componentInstance.keys.set([]);
    await fixture.whenStable();
    expect(caps()).toEqual([]);
  });

  it("joins the caps with '+' between them, not around them", async () => {
    fixture.componentInstance.separator.set('+');
    await fixture.whenStable();
    expect(seps().length).toBe(2);
    expect(host().firstElementChild?.tagName).toBe('KBD');
    expect(host().lastElementChild?.tagName).toBe('KBD');
    expect(seps()[0].getAttribute('aria-hidden')).toBe('true');
  });

  it("puts the caps side by side with separator 'none'", async () => {
    fixture.componentInstance.separator.set('none');
    await fixture.whenStable();
    expect(seps().length).toBe(0);
    expect(caps().length).toBe(3);
  });

  it('follows the platform by default: none on macOS, + elsewhere', async () => {
    const spy = vi.spyOn(navigator, 'platform', 'get');
    spy.mockReturnValue('MacIntel');
    const mac = TestBed.createComponent(Host);
    await mac.whenStable();
    expect(mac.nativeElement.querySelectorAll('.hx-kbd-separator').length).toBe(0);
    spy.mockReturnValue('Linux x86_64');
    const linux = TestBed.createComponent(Host);
    await linux.whenStable();
    expect(linux.nativeElement.querySelectorAll('.hx-kbd-separator').length).toBe(2);
    spy.mockRestore();
  });

  it('does not translate or change the labels', async () => {
    fixture.componentInstance.keys.set(['⌘', 'ctrl', 'Strg']);
    await fixture.whenStable();
    expect(caps()).toEqual(['⌘', 'ctrl', 'Strg']);
  });

  it('has a small size', async () => {
    expect(host().classList).not.toContain('hx-kbd-sm');
    fixture.componentInstance.size.set('sm');
    await fixture.whenStable();
    expect(host().classList).toContain('hx-kbd-sm');
  });

  it('is readable text for a screen reader', () => {
    expect(host().textContent?.replace(/\s+/g, ' ').trim()).toContain('Ctrl');
    expect(host().getAttribute('aria-hidden')).toBeNull();
  });
});
