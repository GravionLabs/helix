import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxTooltip } from './tooltip';

@Component({
  imports: [HxTooltip],
  template: `
    <button id="both" [hx-tooltip]="text()" hxTooltipPosition="right" [hxTooltipDisabled]="off()">A</button>
    <button id="hover" hx-tooltip="Only hover" hxTooltipEvent="hover">B</button>
    <button id="focus" hx-tooltip="Only focus" hxTooltipEvent="focus">C</button>
  `,
})
class Host {
  text = signal('Add item');
  off = signal(false);
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
});
