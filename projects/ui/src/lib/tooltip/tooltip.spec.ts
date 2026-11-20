import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxTooltip } from './tooltip';

@Component({
  imports: [HxTooltip],
  template: `
    <button id="both" [hx-tooltip]="text()" hxTooltipPosition="right" [hxTooltipDisabled]="off()" [hxTooltipShortcut]="shortcut()">A</button>
    <button id="hover" hx-tooltip="Only hover" hxTooltipEvent="hover">B</button>
    <button id="focus" hx-tooltip="Only focus" hxTooltipEvent="focus">C</button>
    <span id="trunc" hx-tooltip="Long name" hxTooltipWhenTruncated style="display:block;width:50px;overflow:hidden;white-space:nowrap">{{ label() }}</span>
  `,
})
class Host {
  text = signal('Add item');
  off = signal(false);
  label = signal('x'.repeat(200));
  shortcut = signal<string[] | undefined>(undefined);
}

describe('HxTooltip', () => {
  let fixture: ComponentFixture<Host>;
  const el = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const bubble = () => document.querySelector('.hx-tooltip') as HTMLElement | null;
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const fire = (id: string, type: string) => {
    el(id).dispatchEvent(new Event(type, { bubbles: type === 'focusin' || type === 'focusout' }));
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(Host);
    await settle();
  });

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach((c) => {
      c.innerHTML = '';
    });
  });

  it('shows a tooltip bubble on hover and hides it again', async () => {
    fire('both', 'mouseenter');
    await settle();
    expect(bubble()?.textContent?.trim()).toBe('Add item');
    expect(bubble()?.getAttribute('role')).toBe('tooltip');
    expect(el('both').getAttribute('aria-describedby')).toBe(bubble()?.id);

    fire('both', 'mouseleave');
    await settle();
    expect(bubble()).toBeNull();
    expect(el('both').getAttribute('aria-describedby')).toBeNull();
  });

  it('shows on keyboard focus and closes with Escape', async () => {
    fire('both', 'focusin');
    await settle();
    expect(bubble()).toBeTruthy();
    el('both').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settle();
    expect(bubble()).toBeNull();
  });

  it('honours the event setting', async () => {
    fire('hover', 'focusin');
    fire('focus', 'mouseenter');
    await settle();
    expect(bubble()).toBeNull();
    fire('hover', 'mouseenter');
    await settle();
    expect(bubble()?.textContent?.trim()).toBe('Only hover');
  });

  it('shows nothing while disabled or without text', async () => {
    fixture.componentInstance.off.set(true);
    await settle();
    fire('both', 'mouseenter');
    await settle();
    expect(bubble()).toBeNull();

    fixture.componentInstance.off.set(false);
    fixture.componentInstance.text.set('');
    await settle();
    fire('both', 'mouseenter');
    await settle();
    expect(bubble()).toBeNull();
  });

  it('follows the text while visible', async () => {
    fire('both', 'mouseenter');
    await settle();
    fixture.componentInstance.text.set('Changed');
    await settle();
    expect(bubble()?.textContent?.trim()).toBe('Changed');
  });

  it('shows no key caps without a shortcut', async () => {
    fire('both', 'mouseenter');
    await settle();
    expect(bubble()?.querySelector('hx-kbd')).toBeNull();
  });

  it('shows the shortcut as key caps after the text', async () => {
    fixture.componentInstance.shortcut.set(['Ctrl', 'K']);
    await settle();
    fire('both', 'mouseenter');
    await settle();
    const kbd = bubble()?.querySelector('hx-kbd') as HTMLElement;
    expect(kbd).toBeTruthy();
    expect(kbd.classList).toContain('hx-kbd-sm');
    expect([...kbd.querySelectorAll('kbd')].map((k) => k.textContent)).toEqual(['Ctrl', 'K']);
    expect(bubble()?.textContent?.trim().startsWith('Add item')).toBe(true);
    // the caps are inside the described-by element, so a screen reader gets them as text
    expect(el('both').getAttribute('aria-describedby')).toBe(bubble()?.id);
  });

  it('follows the shortcut while visible', async () => {
    fire('both', 'mouseenter');
    await settle();
    fixture.componentInstance.shortcut.set(['Esc']);
    await settle();
    expect(bubble()?.querySelectorAll('kbd').length).toBe(1);
    fixture.componentInstance.shortcut.set([]);
    await settle();
    expect(bubble()?.querySelector('hx-kbd')).toBeNull();
  });

  describe('hxTooltipWhenTruncated', () => {
    // no layout in the test DOM: the width of the content is a signal-driven stub
    beforeEach(() => {
      const t = el('trunc');
      Object.defineProperty(t, 'clientWidth', { configurable: true, value: 50 });
      Object.defineProperty(t, 'scrollWidth', {
        configurable: true,
        get: () => (fixture.componentInstance.label().length > 10 ? 200 : 50),
      });
    });

    it('opens when the text is cut off', async () => {
      fire('trunc', 'mouseenter');
      await settle();
      expect(bubble()?.textContent?.trim()).toBe('Long name');
    });

    it('does not open when the text fits', async () => {
      fixture.componentInstance.label.set('x');
      await settle();
      fire('trunc', 'mouseenter');
      await settle();
      expect(bubble()).toBeNull();
    });

    it('measures at open time, not before', async () => {
      fixture.componentInstance.label.set('x');
      await settle();
      fire('trunc', 'mouseenter');
      await settle();
      expect(bubble()).toBeNull();
      fixture.componentInstance.label.set('x'.repeat(200));
      await settle();
      fire('trunc', 'mouseenter');
      await settle();
      expect(bubble()).toBeTruthy();
    });

    it('is unchanged without the option', async () => {
      fire('hover', 'mouseenter');
      await settle();
      expect(bubble()).toBeTruthy();
    });
  });
});
