import { Component, signal, viewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxPopover } from './popover';

@Component({
  imports: [HxPopover],
  template: `
    <button id="trigger" type="button" aria-haspopup="dialog" (click)="op.toggle($event)">Share</button>
    <button id="other" type="button">Other</button>
    <hx-popover
      #op
      ariaLabel="Share this page"
      [dismissable]="dismissable()"
      [closeOnEscape]="closeOnEscape()"
      (shown)="log.push('shown')"
      (hidden)="log.push('hidden')"
    >
      <input id="link" value="https://example.com" />
      <button id="copy" type="button">Copy</button>
    </hx-popover>
    <button id="target-trigger" type="button" (click)="named.toggle($event, anchor)">Anchored</button>
    <span id="anchor" #anchor>anchor</span>
    <hx-popover #named ariaLabelledBy="heading"><h3 id="heading">Heading</h3>Text only</hx-popover>
  `,
})
class Host {
  dismissable = signal(true);
  closeOnEscape = signal(true);
  log: string[] = [];
  readonly popover = viewChild.required<HxPopover>('op');
}

describe('HxPopover', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const panel = () => document.querySelector('.hx-popover') as HTMLElement | null;
  const trigger = () => fixture.nativeElement.querySelector('#trigger') as HTMLButtonElement;
  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 20));
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
  });

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach((c) => {
      c.innerHTML = '';
    });
  });

  it('shows nothing until it is opened, then a named non-modal dialog with the content', async () => {
    expect(panel()).toBeNull();
    trigger().click();
    await settle();
    expect(panel()?.getAttribute('role')).toBe('dialog');
    expect(panel()?.getAttribute('aria-label')).toBe('Share this page');
    expect(panel()?.hasAttribute('aria-modal')).toBe(false);
    expect(panel()?.querySelector('#link')).toBeTruthy();
    expect(document.querySelector('.hx-popover-overlay')).toBeTruthy();
    expect(host.log).toEqual(['shown']);
  });

  it('moves the focus to the first control and gives it back to the trigger on Escape', async () => {
    trigger().focus();
    trigger().click();
    await settle();
    expect(document.activeElement?.id).toBe('link');
    document.activeElement?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await settle();
    expect(panel()).toBeNull();
    expect(document.activeElement).toBe(trigger());
    expect(host.log).toEqual(['shown', 'hidden']);
  });

  it('toggles from the trigger', async () => {
    trigger().click();
    await settle();
    trigger().click();
    await settle();
    expect(panel()).toBeNull();
    expect(host.log).toEqual(['shown', 'hidden']);
  });

  it('closes on an outside click, unless it is not dismissable', async () => {
    host.dismissable.set(false);
    trigger().click();
    await settle();
    (fixture.nativeElement.querySelector('#other') as HTMLElement).click();
    await settle();
    expect(panel()).toBeTruthy();
    host.dismissable.set(true);
    await settle();
    (fixture.nativeElement.querySelector('#other') as HTMLElement).click();
    await settle();
    expect(panel()).toBeNull();
  });

  it('a click inside does not close it; Escape does nothing when closeOnEscape is off', async () => {
    host.closeOnEscape.set(false);
    trigger().click();
    await settle();
    (document.getElementById('copy') as HTMLElement).click();
    await settle();
    expect(panel()).toBeTruthy();
    document.activeElement?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await settle();
    expect(panel()).toBeTruthy();
  });

  it('can be anchored to another element, named by aria-labelledby, with nothing to focus', async () => {
    (fixture.nativeElement.querySelector('#target-trigger') as HTMLElement).click();
    await settle();
    expect(panel()?.getAttribute('aria-labelledby')).toBe('heading');
    expect(panel()?.hasAttribute('aria-label')).toBe(false);
    expect(panel()?.contains(document.activeElement)).toBe(false); // nothing inside to focus
  });

  it('marks the side of the arrow from the position the overlay chose', async () => {
    trigger().click();
    await settle();
    expect(panel()?.classList).not.toContain('hx-popover-above');
    (host.popover() as unknown as { onPosition: (c: unknown) => void }).onPosition({
      connectionPair: { overlayX: 'end', overlayY: 'bottom' },
    });
    await settle();
    expect(panel()?.classList).toContain('hx-popover-above');
    expect(panel()?.classList).toContain('hx-popover-end');
  });
});
