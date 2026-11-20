import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HxStatusBar } from './status-bar';
import { HxStatusItem, HxStatusPopover } from './status-item';
import { HxStatusVersion } from './status-version';
import { HxStatusZoom } from './status-zoom';

@Component({
  imports: [HxStatusBar, HxStatusItem, HxStatusPopover, HxStatusZoom, HxStatusVersion],
  template: `
    <button id="outside" type="button">outside</button>
    <hx-status-bar>
      <hx-status-item slot="start" id="text" tone="warn" title="Tip" ariaLabel="Warnings" (pressed)="presses = presses + 100">2 warnings</hx-status-item>
      <hx-status-item slot="start" id="sync" [announce]="true">Synced</hx-status-item>
      <hx-status-item slot="start" id="btn" kind="button" [disabled]="disabled()" (pressed)="presses = presses + 1">Go</hx-status-item>
      <hx-status-item slot="start" id="upd" kind="button" tone="accent" [(popoverOpen)]="open" (pressed)="updatePresses = updatePresses + 1">
        Update
        <div hxStatusPopover id="details">Details</div>
      </hx-status-item>
      <hx-status-zoom slot="end" [(value)]="zoom" [min]="50" [max]="70" />
      <hx-status-version slot="end" version="1.4.0" [channel]="channel()" />
    </hx-status-bar>
  `,
})
class Host {
  readonly zoom = signal(100);
  readonly open = signal(false);
  readonly disabled = signal(false);
  readonly channel = signal<string | null>('RC');
  presses = 0;
  updatePresses = 0;
}

describe('status bar', () => {
  const setup = () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const q = <T extends HTMLElement>(s: string) => root.querySelector(s) as T;
    return { fixture, root, q, host: fixture.componentInstance };
  };

  it('puts start and end items in their groups and gives the bar no role', () => {
    const { q } = setup();
    expect(q('.hx-status-start #text')).toBeTruthy();
    expect(q('.hx-status-end hx-status-zoom')).toBeTruthy();
    expect(q('hx-status-bar').getAttribute('role')).toBeNull();
  });

  it('renders text items as non-buttons with title, label and tone', () => {
    const { q } = setup();
    expect(q('#text button')).toBeNull();
    const control = q('#text .hx-status-control');
    expect(control.getAttribute('title')).toBe('Tip');
    expect(control.getAttribute('aria-label')).toBe('Warnings');
    expect(q('#text').classList).toContain('hx-status-warn');
    expect(q('#text').getAttribute('title')).toBeNull();
  });

  it('sets role=status only on announcing items', () => {
    const { root } = setup();
    const live = root.querySelectorAll('[role="status"]');
    expect(live.length).toBe(1);
    expect(root.querySelector('#sync[role="status"]')).toBeTruthy();
    expect(root.querySelector('hx-status-bar[role]')).toBeNull();
  });

  it('renders a button item and honors disabled', () => {
    const { fixture, q, host } = setup();
    const b = q<HTMLButtonElement>('#btn button');
    expect(b.disabled).toBe(false);
    host.disabled.set(true);
    fixture.detectChanges();
    expect(b.disabled).toBe(true);
  });

  it('zoom steps, clamps, resets and emits', () => {
    const { fixture, q, host } = setup();
    const level = q<HTMLButtonElement>('.hx-status-zoom-level');
    expect(level.textContent?.trim()).toBe('100%');
    // 100 is above max 70: zoom in is disabled, zoom out clamps to max
    expect(q<HTMLButtonElement>('.hx-status-zoom-in').disabled).toBe(true);
    q<HTMLButtonElement>('.hx-status-zoom-out').click();
    fixture.detectChanges();
    expect(host.zoom()).toBe(70);
    q<HTMLButtonElement>('.hx-status-zoom-out').click();
    q<HTMLButtonElement>('.hx-status-zoom-out').click();
    q<HTMLButtonElement>('.hx-status-zoom-out').click();
    fixture.detectChanges();
    expect(host.zoom()).toBe(50);
    expect(q<HTMLButtonElement>('.hx-status-zoom-out').disabled).toBe(true);
    level.click();
    fixture.detectChanges();
    expect(host.zoom()).toBe(70); // reset 100 clamped to max 70
  });

  it('shows the version and an optional channel badge', () => {
    const { fixture, q, host } = setup();
    expect(q('.hx-status-version-text').textContent?.trim()).toBe('v1.4.0');
    expect(q('.hx-status-channel').textContent?.trim()).toBe('RC');
    host.channel.set(null);
    fixture.detectChanges();
    expect(q('.hx-status-channel')).toBeNull();
  });

  it('emits pressed for an enabled button item only', () => {
    const { fixture, q, host } = setup();
    q<HTMLButtonElement>('#btn button').click();
    expect(host.presses).toBe(1);
    host.disabled.set(true);
    fixture.detectChanges();
    q<HTMLButtonElement>('#btn button').click();
    q('#btn').click(); // a click on the host, not on the button
    expect(host.presses).toBe(1);
    q('#text .hx-status-control').click();
    expect(host.presses).toBe(1);
  });

  it('emits pressed and toggles the popover; a click inside the popover does not emit', () => {
    const { fixture, q, host } = setup();
    q<HTMLButtonElement>('#upd button').click();
    fixture.detectChanges();
    expect(host.open()).toBe(true);
    expect(host.updatePresses).toBe(1);
    q('#details').click();
    expect(host.updatePresses).toBe(1);
    q<HTMLButtonElement>('#upd button').click();
    fixture.detectChanges();
    expect(host.open()).toBe(false);
    expect(host.updatePresses).toBe(2);
  });

  it('opens a popover on click; Escape and an outside click close it', () => {
    const { fixture, q, host } = setup();
    expect(q('#details')).toBeNull();
    q<HTMLButtonElement>('#upd button').click();
    fixture.detectChanges();
    expect(host.open()).toBe(true);
    expect(q('#details')).toBeTruthy();
    expect(q('#upd button').getAttribute('aria-expanded')).toBe('true');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(host.open()).toBe(false);

    q<HTMLButtonElement>('#upd button').click();
    fixture.detectChanges();
    q('#details').click(); // inside: stays open
    fixture.detectChanges();
    expect(host.open()).toBe(true);
    q<HTMLButtonElement>('#outside').click();
    fixture.detectChanges();
    expect(host.open()).toBe(false);
  });

  it('projects the label of an item that is created later inside a block', () => {
    @Component({
      imports: [HxStatusItem],
      template: `@if (on()) {<hx-status-item kind="button"><span id="late">Late</span></hx-status-item>}`,
    })
    class Late {
      readonly on = signal(false);
    }
    const fixture = TestBed.createComponent(Late);
    fixture.detectChanges();
    fixture.componentInstance.on.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button #late')).toBeTruthy();
  });

  it('places a conditional group of items in the end slot with ngProjectAs', () => {
    @Component({
      imports: [HxStatusBar, HxStatusItem],
      template: `
        <hx-status-bar>
          <hx-status-item slot="start">Ready</hx-status-item>
          @if (on()) {
            <ng-container ngProjectAs="[slot=end]">
              <hx-status-item id="a">A</hx-status-item>
              <hx-status-item id="b">B</hx-status-item>
            </ng-container>
          }
        </hx-status-bar>
      `,
    })
    class Group {
      readonly on = signal(false);
    }
    const fixture = TestBed.createComponent(Group);
    const root = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    expect(root.querySelector('.hx-status-end #a')).toBeNull();
    fixture.componentInstance.on.set(true);
    fixture.detectChanges();
    expect(root.querySelector('.hx-status-end #a')).toBeTruthy();
    expect(root.querySelector('.hx-status-end #b')).toBeTruthy();
    expect(root.querySelector('.hx-status-start #a')).toBeNull();
    fixture.componentInstance.on.set(false);
    fixture.detectChanges();
    expect(root.querySelector('.hx-status-end #a')).toBeNull();
  });
});
