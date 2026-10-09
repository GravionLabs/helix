import { Component, inject, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HX_DIALOG_DATA,
  HxDialog,
  type HxDialogPosition,
  HxDialogRef,
  HxDialogService,
} from './dialog';

@Component({
  imports: [HxDialog],
  template: `
    <button id="opener" type="button" (click)="open.set(true)">Open</button>
    <hx-dialog
      [(visible)]="open"
      header="Edit profile"
      width="20rem"
      [modal]="modal()"
      [closeOnEscape]="closeOnEscape()"
      [dismissableMask]="mask()"
      [closable]="closable()"
      [position]="position()"
      (shown)="log.push('shown')"
      (hidden)="log.push('hidden')"
    >
      <input id="name" />
      <div hxDialogFooter><button id="save" type="button">Save</button></div>
    </hx-dialog>
    <hx-dialog id="unnamed" [visible]="unnamed()" ariaLabel="Notice">Hello</hx-dialog>
  `,
})
class Host {
  open = signal(false);
  modal = signal(true);
  closeOnEscape = signal(true);
  mask = signal(false);
  closable = signal(true);
  position = signal<HxDialogPosition>('center');
  unnamed = signal(false);
  log: string[] = [];
}

@Component({
  template: `<p class="dyn">{{ data.who }}</p><button id="done" (click)="ref.close('ok')">Done</button>`,
})
class Dyn {
  data = inject(HX_DIALOG_DATA) as { who: string };
  ref = inject(HxDialogRef);
}

describe('HxDialog', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const container = () => document.querySelector('.cdk-dialog-container') as HTMLElement | null;
  const frame = () => document.querySelector('.hx-dialog') as HTMLElement | null;
  const backdrop = () => document.querySelector('.hx-dialog-backdrop') as HTMLElement | null;
  const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await wait(20);
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const press = (key: string) =>
    (document.activeElement ?? document.body).dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true }),
    );

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

  it('shows nothing while closed and creates the content when opened', async () => {
    expect(frame()).toBeNull();
    host.open.set(true);
    await settle();
    expect(frame()).toBeTruthy();
    expect(frame()?.querySelector('#name')).toBeTruthy();
    expect(host.log).toEqual(['shown']);
  });

  it('is a labelled modal dialog with a mask, a title heading, content and a footer', async () => {
    host.open.set(true);
    await settle();
    expect(container()?.getAttribute('role')).toBe('dialog');
    expect(container()?.getAttribute('aria-modal')).toBe('true');
    const title = frame()?.querySelector('h2.hx-dialog-title') as HTMLElement;
    expect(title.textContent).toBe('Edit profile');
    expect(container()?.getAttribute('aria-labelledby')).toBe(title.id);
    expect(backdrop()).toBeTruthy();
    expect(frame()?.querySelector('.hx-dialog-footer #save')).toBeTruthy();
    expect((document.querySelector('.cdk-overlay-pane') as HTMLElement).style.width).toBe('20rem');
  });

  it('uses ariaLabel when there is no header', async () => {
    host.unnamed.set(true);
    await settle();
    expect(container()?.getAttribute('aria-label')).toBe('Notice');
    expect(container()?.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('moves the focus to the first control of the content, and gives it back when closed', async () => {
    // jsdom has no layout, so the CDK would find nothing visible to focus
    vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([
      {},
    ] as unknown as DOMRectList);
    (document.getElementById('opener') as HTMLElement).focus();
    host.open.set(true);
    await settle();
    expect(document.activeElement?.id).toBe('name');
    host.open.set(false);
    await settle();
    expect(frame()).toBeNull();
    expect(document.activeElement?.id).toBe('opener');
    expect(host.log).toEqual(['shown', 'hidden']); // closing by setting visible is reported too
  });

  it('the close button closes it and sets visible to false', async () => {
    host.open.set(true);
    await settle();
    const close = frame()?.querySelector('.hx-dialog-close') as HTMLButtonElement;
    expect(close.getAttribute('aria-label')).toBe('Close');
    close.click();
    await settle();
    expect(host.open()).toBe(false);
    expect(frame()).toBeNull();
    expect(host.log).toEqual(['shown', 'hidden']);
  });

  it('has no close button when not closable', async () => {
    host.closable.set(false);
    host.open.set(true);
    await settle();
    expect(frame()?.querySelector('.hx-dialog-close')).toBeNull();
  });

  it('Escape closes it, unless closeOnEscape is off', async () => {
    host.closeOnEscape.set(false);
    host.open.set(true);
    await settle();
    press('Escape');
    await settle();
    expect(host.open()).toBe(true);
    host.closeOnEscape.set(true);
    await settle();
    press('Escape');
    await settle();
    expect(host.open()).toBe(false);
  });

  it('clicking the mask closes it only with dismissableMask', async () => {
    host.open.set(true);
    await settle();
    backdrop()?.click();
    await settle();
    expect(host.open()).toBe(true);
    host.open.set(false);
    host.mask.set(true);
    await settle();
    host.open.set(true);
    await settle();
    backdrop()?.click();
    await settle();
    expect(host.open()).toBe(false);
  });

  it('a non-modal dialog has no mask and is not aria-modal', async () => {
    host.modal.set(false);
    host.open.set(true);
    await settle();
    expect(backdrop()).toBeNull();
    expect(container()?.getAttribute('aria-modal')).toBe('false');
  });

  it('positions the dialog', async () => {
    host.position.set('top-right');
    host.open.set(true);
    await settle();
    const wrapper = document.querySelector('.cdk-global-overlay-wrapper') as HTMLElement;
    expect(wrapper.style.alignItems).toBe('flex-start');
    expect(wrapper.style.justifyContent).toBe('flex-end');
  });
});

describe('HxDialogService', () => {
  let service: HxDialogService;
  const frame = () => document.querySelector('.hx-dialog') as HTMLElement | null;
  const wait = (ms = 20) => new Promise((resolve) => setTimeout(resolve, ms));

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HxDialogService);
  });

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach((c) => {
      c.innerHTML = '';
    });
  });

  it('opens a component with the data, a header and a labelled dialog', async () => {
    const ref = service.open(Dyn, { data: { who: 'Amy' }, header: 'Hello', width: '15rem' });
    await wait();
    expect(frame()?.querySelector('.dyn')?.textContent).toBe('Amy');
    const container = document.querySelector('.cdk-dialog-container') as HTMLElement;
    expect(container.getAttribute('role')).toBe('dialog');
    expect(container.getAttribute('aria-labelledby')).toBe(frame()?.querySelector('h2')?.id);
    expect(ref.componentInstance).toBeInstanceOf(Dyn);
    ref.close();
  });

  it('the component closes it with a result', async () => {
    const ref = service.open<Dyn, string>(Dyn, { data: { who: 'x' } });
    const results: (string | undefined)[] = [];
    ref.closed.subscribe((r) => results.push(r));
    await wait();
    (document.getElementById('done') as HTMLElement).click();
    await wait();
    expect(results).toEqual(['ok']);
    expect(frame()).toBeNull();
  });

  it('Escape and the close button close it without a result; the mask only with dismissableMask', async () => {
    const ref = service.open<Dyn, string>(Dyn, { data: { who: 'x' }, header: 'T' });
    const results: (string | undefined)[] = [];
    ref.closed.subscribe((r) => results.push(r));
    await wait();
    (document.querySelector('.hx-dialog-backdrop') as HTMLElement).click();
    await wait();
    expect(frame()).toBeTruthy();
    (document.querySelector('.hx-dialog-close') as HTMLElement).click();
    await wait();
    expect(results).toEqual([undefined]);

    const second = service.open(Dyn, { data: { who: 'y' }, dismissableMask: true });
    await wait();
    (document.querySelector('.hx-dialog-backdrop') as HTMLElement).click();
    await wait();
    expect(frame()).toBeNull();
    second.close();

    service.open(Dyn, { data: { who: 'z' } });
    await wait();
    document.activeElement?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await wait();
    expect(frame()).toBeNull();
  });
});
