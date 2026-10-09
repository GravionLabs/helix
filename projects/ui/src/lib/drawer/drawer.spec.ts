import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxDrawer, type HxDrawerPosition } from './drawer';

@Component({
  imports: [HxDrawer],
  template: `
    <button id="opener" type="button">Open</button>
    <hx-drawer
      [(visible)]="open"
      header="Filters"
      [position]="position()"
      [modal]="modal()"
      [dismissable]="dismissable()"
      [fullScreen]="full()"
      [width]="width()"
      (shown)="log.push('shown')"
      (hidden)="log.push('hidden')"
    >
      <input id="q" />
      <div hxDialogFooter><button id="done" type="button">Done</button></div>
    </hx-drawer>
  `,
})
class Host {
  open = signal(false);
  position = signal<HxDrawerPosition>('left');
  modal = signal(true);
  dismissable = signal(true);
  full = signal(false);
  width = signal<string | undefined>(undefined);
  log: string[] = [];
}

describe('HxDrawer', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const container = () => document.querySelector('.cdk-dialog-container') as HTMLElement | null;
  const frame = () => document.querySelector('.hx-drawer') as HTMLElement | null;
  const pane = () => document.querySelector('.cdk-overlay-pane') as HTMLElement;
  const backdrop = () => document.querySelector('.hx-dialog-backdrop') as HTMLElement | null;
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
    vi.restoreAllMocks();
    document.querySelectorAll('.cdk-overlay-container').forEach((c) => {
      c.innerHTML = '';
    });
  });

  it('is closed until visible, then a labelled modal dialog with title, content and footer', async () => {
    expect(frame()).toBeNull();
    host.open.set(true);
    await settle();
    expect(container()?.getAttribute('role')).toBe('dialog');
    expect(container()?.getAttribute('aria-modal')).toBe('true');
    const title = frame()?.querySelector('h2') as HTMLElement;
    expect(title.textContent).toBe('Filters');
    expect(container()?.getAttribute('aria-labelledby')).toBe(title.id);
    expect(frame()?.querySelector('#q')).toBeTruthy();
    expect(frame()?.querySelector('.hx-dialog-footer #done')).toBeTruthy();
    expect(backdrop()).toBeTruthy();
    expect(host.log).toEqual(['shown']);
  });

  it('sits at an edge: full height at left and right, full width at top and bottom, 20rem by default', async () => {
    host.open.set(true);
    await settle();
    expect(pane().classList).toContain('hx-drawer-panel-left');
    expect(pane().style.width).toBe('20rem');
    expect(pane().style.height).toBe('100vh');
    host.open.set(false);
    host.position.set('bottom');
    await settle();
    host.open.set(true);
    await settle();
    expect(pane().classList).toContain('hx-drawer-panel-bottom');
    expect(pane().style.width).toBe('100vw');
    expect(pane().style.height).toBe('20rem');
  });

  it('takes a width, and fullScreen covers the screen', async () => {
    host.position.set('right');
    host.width.set('30rem');
    host.open.set(true);
    await settle();
    expect(pane().style.width).toBe('30rem');
    host.open.set(false);
    host.full.set(true);
    await settle();
    host.open.set(true);
    await settle();
    expect(pane().classList).toContain('hx-drawer-panel-full');
    expect(pane().style.width).toBe('100vw');
    expect(pane().style.height).toBe('100vh');
  });

  it('the close button, Escape and the mask close it and set visible to false', async () => {
    host.open.set(true);
    await settle();
    frame()?.querySelector<HTMLElement>('.hx-dialog-close')?.click();
    await settle();
    expect(host.open()).toBe(false);
    expect(frame()).toBeNull();

    host.open.set(true);
    await settle();
    document.activeElement?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await settle();
    expect(host.open()).toBe(false);

    host.open.set(true);
    await settle();
    backdrop()?.click();
    await settle();
    expect(host.open()).toBe(false);
    expect(host.log).toEqual(['shown', 'hidden', 'shown', 'hidden', 'shown', 'hidden']);
  });

  it('the mask does nothing when not dismissable; a non-modal drawer has no mask', async () => {
    host.dismissable.set(false);
    host.open.set(true);
    await settle();
    backdrop()?.click();
    await settle();
    expect(host.open()).toBe(true);
    host.open.set(false);
    host.modal.set(false);
    await settle();
    host.open.set(true);
    await settle();
    expect(backdrop()).toBeNull();
    expect(container()?.getAttribute('aria-modal')).toBe('false');
  });

  it('moves the focus in and returns it', async () => {
    vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([
      {},
    ] as unknown as DOMRectList);
    (document.getElementById('opener') as HTMLElement).focus();
    host.open.set(true);
    await settle();
    expect(document.activeElement?.id).toBe('q');
    host.open.set(false);
    await settle();
    expect(document.activeElement?.id).toBe('opener');
  });
});
