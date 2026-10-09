import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxConfirmationService, HxConfirmDialog, HxConfirmPopup } from './confirm';

@Component({
  imports: [HxConfirmDialog, HxConfirmPopup],
  template: `
    <button id="anchor" type="button">Delete</button>
    <button id="other" type="button">Other</button>
    <hx-confirm-dialog />
    <hx-confirm-popup />
  `,
})
class Host {}

describe('HxConfirmationService with the dialog and the popup', () => {
  let fixture: ComponentFixture<Host>;
  let service: HxConfirmationService;
  const log: string[] = [];
  const container = () => document.querySelector('.cdk-dialog-container') as HTMLElement | null;
  const popup = () => document.querySelector('.hx-confirm-popup') as HTMLElement | null;
  const button = (cls: string) => document.querySelector<HTMLElement>(`.${cls}`);
  const anchor = () => fixture.nativeElement.querySelector('#anchor') as HTMLElement;
  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 20));
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const ask = (extra = {}) =>
    service.confirm({
      message: 'Delete this item?',
      accept: () => log.push('accept'),
      reject: () => log.push('reject'),
      ...extra,
    });
  const pressEscape = () =>
    document.activeElement?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );

  beforeEach(async () => {
    log.length = 0;
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    service = TestBed.inject(HxConfirmationService);
    await settle();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.querySelectorAll('.cdk-overlay-container').forEach((c) => {
      c.innerHTML = '';
    });
  });

  describe('dialog', () => {
    it('asks in an alertdialog described by the message, with a header and default labels', async () => {
      ask({ header: 'Delete', icon: 'pi pi-trash' });
      await settle();
      expect(container()?.getAttribute('role')).toBe('alertdialog');
      expect(container()?.getAttribute('aria-modal')).toBe('true');
      const message = document.querySelector('.hx-confirm-message') as HTMLElement;
      expect(message.textContent).toBe('Delete this item?');
      expect(container()?.getAttribute('aria-describedby')).toBe(message.id);
      expect(document.querySelector('.hx-dialog h2')?.textContent).toBe('Delete');
      expect(container()?.getAttribute('aria-labelledby')).toBe(
        document.querySelector('.hx-dialog h2')?.id,
      );
      expect(document.querySelector('.hx-confirm-icon')?.getAttribute('aria-hidden')).toBe('true');
      expect(button('hx-confirm-reject')?.textContent?.trim()).toBe('No');
      expect(button('hx-confirm-accept')?.textContent?.trim()).toBe('Yes');
    });

    it('has a fallback name without a header and custom labels and severity', async () => {
      ask({ acceptLabel: 'Delete', rejectLabel: 'Keep', acceptSeverity: 'danger' });
      await settle();
      expect(container()?.getAttribute('aria-label')).toBe('Confirmation');
      expect(button('hx-confirm-accept')?.textContent?.trim()).toBe('Delete');
      expect(button('hx-confirm-accept')?.classList).toContain('hx-button-danger');
      expect(button('hx-confirm-reject')?.textContent?.trim()).toBe('Keep');
    });

    it('starts the focus on the reject button', async () => {
      vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([
        {},
      ] as unknown as DOMRectList);
      ask();
      await settle();
      expect(document.activeElement).toBe(button('hx-confirm-reject'));
    });

    it('accept runs accept; reject and Escape run reject; the mask does nothing', async () => {
      ask();
      await settle();
      button('hx-confirm-accept')?.click();
      await settle();
      expect(log).toEqual(['accept']);
      expect(container()).toBeNull();

      ask();
      await settle();
      button('hx-confirm-reject')?.click();
      await settle();
      expect(log).toEqual(['accept', 'reject']);

      ask();
      await settle();
      (document.querySelector('.hx-dialog-backdrop') as HTMLElement).click();
      await settle();
      expect(container()).toBeTruthy();
      pressEscape();
      await settle();
      expect(log).toEqual(['accept', 'reject', 'reject']);
      expect(container()).toBeNull();
    });

    it('asks queued questions one after the other', async () => {
      service.confirm({ message: 'One?', accept: () => log.push('one') });
      service.confirm({ message: 'Two?', accept: () => log.push('two') });
      await settle();
      expect(document.querySelector('.hx-confirm-message')?.textContent).toBe('One?');
      button('hx-confirm-accept')?.click();
      await settle();
      expect(document.querySelector('.hx-confirm-message')?.textContent).toBe('Two?');
      button('hx-confirm-accept')?.click();
      await settle();
      expect(log).toEqual(['one', 'two']);
    });

    it('confirmAsync resolves true or false', async () => {
      const yes = service.confirmAsync({ message: 'Sure?', accept: () => log.push('accept') });
      await settle();
      button('hx-confirm-accept')?.click();
      expect(await yes).toBe(true);
      const no = service.confirmAsync({ message: 'Sure?' });
      await settle();
      pressEscape();
      expect(await no).toBe(false);
      expect(log).toEqual(['accept']);
    });
  });

  describe('popup', () => {
    it('asks next to the target in an alertdialog described by the message', async () => {
      ask({ target: anchor(), icon: 'pi pi-question' });
      await settle();
      expect(container()).toBeNull(); // not the dialog
      expect(popup()?.getAttribute('role')).toBe('alertdialog');
      const message = popup()?.querySelector('.hx-confirm-popup-message') as HTMLElement;
      expect(message.textContent).toBe('Delete this item?');
      expect(popup()?.getAttribute('aria-describedby')).toBe(message.id);
      expect(popup()?.getAttribute('aria-label')).toBe('Confirmation');
      expect(popup()?.querySelector('.hx-confirm-popup-icon')?.getAttribute('aria-hidden')).toBe(
        'true',
      );
    });

    it('takes the target from an event', async () => {
      anchor().addEventListener('click', (e) => ask({ target: e }), { once: true });
      anchor().click();
      await settle();
      expect(popup()).toBeTruthy();
    });

    it('accept and reject run their callbacks once and close it', async () => {
      ask({ target: anchor() });
      await settle();
      button('hx-confirm-accept')?.click();
      await settle();
      expect(log).toEqual(['accept']);
      expect(popup()).toBeNull();
      ask({ target: anchor() });
      await settle();
      button('hx-confirm-reject')?.click();
      await settle();
      expect(log).toEqual(['accept', 'reject']);
    });

    it('Escape and a click outside reject', async () => {
      ask({ target: anchor() });
      await settle();
      pressEscape();
      await settle();
      expect(log).toEqual(['reject']);
      ask({ target: anchor() });
      await settle();
      (fixture.nativeElement.querySelector('#other') as HTMLElement).click();
      await settle();
      expect(log).toEqual(['reject', 'reject']);
      expect(popup()).toBeNull();
    });

    it('a new question rejects the one that is open', async () => {
      ask({ target: anchor(), message: 'First?' });
      await settle();
      service.confirm({ message: 'Second?', target: anchor(), accept: () => log.push('second') });
      await settle();
      expect(log).toEqual(['reject']);
      expect(popup()?.querySelector('.hx-confirm-popup-message')?.textContent).toBe('Second?');
      button('hx-confirm-accept')?.click();
      await settle();
      expect(log).toEqual(['reject', 'second']);
    });
  });
});
