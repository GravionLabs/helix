import { Component, signal, type TemplateRef, viewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxCheckbox } from '../checkbox/checkbox';
import { HxConfirmationService, HxConfirmDialog, HxConfirmPopup } from './confirm';

@Component({
  imports: [HxConfirmDialog, HxConfirmPopup, HxCheckbox],
  template: `
    <button id="anchor" type="button">Delete</button>
    <button id="other" type="button">Other</button>
    <hx-confirm-dialog />
    <hx-confirm-popup />
    <ng-template #option>
      <label>
        <input
          id="force"
          type="checkbox"
          hx-checkbox
          [checked]="force()"
          (change)="force.set(!force())"
        />
        Force removal
      </label>
    </ng-template>
  `,
})
class Host {
  readonly force = signal(false);
  readonly option = viewChild.required<TemplateRef<unknown>>('option');
}

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
      expect(document.querySelector('.hx-dialog h2')?.textContent?.trim()).toBe('Delete');
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

  describe.each([
    { kind: 'dialog', root: () => container(), extra: () => ({}), prefix: 'hx-confirm' },
    {
      kind: 'popup',
      root: () => popup(),
      extra: () => ({ target: anchor() }),
      prefix: 'hx-confirm-popup',
    },
  ])('content in the $kind', ({ root, extra, prefix }) => {
    const checkbox = () => document.querySelector('#force') as HTMLInputElement;
    const host = () => fixture.componentInstance as Host;
    const askWithOption = (more = {}) => ask({ content: host().option(), ...extra(), ...more });
    const visible = () =>
      vi
        .spyOn(HTMLElement.prototype, 'getClientRects')
        .mockReturnValue([{}] as unknown as DOMRectList);

    it('renders it between the message and the buttons; the message stays the description', async () => {
      askWithOption();
      await settle();
      const message = root()?.querySelector(`.${prefix}-message`) as HTMLElement;
      const follows = (a: Node, b: Node) =>
        !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
      expect(root()?.contains(checkbox())).toBe(true);
      expect(follows(message, checkbox())).toBe(true);
      expect(follows(checkbox(), button('hx-confirm-reject') as HTMLElement)).toBe(true);
      expect(root()?.getAttribute('aria-describedby')).toBe(message.id);
    });

    it('a checkbox in it toggles and its value is readable in accept', async () => {
      let forced: boolean | undefined;
      askWithOption({ accept: () => (forced = host().force()) });
      await settle();
      checkbox().click();
      await settle();
      expect(checkbox().checked).toBe(true);
      button('hx-confirm-accept')?.click();
      await settle();
      expect(forced).toBe(true);
      expect(checkbox()).toBeNull();
    });

    it('starts the focus on the reject button and keeps Tab inside', async () => {
      visible();
      askWithOption();
      await settle();
      expect(document.activeElement).toBe(button('hx-confirm-reject'));
      // the tab stops of the focus trap, which wrap Tab around to the content
      const anchors = document.querySelectorAll('.cdk-focus-trap-anchor[tabindex="0"]');
      expect(anchors).toHaveLength(2);
      expect(checkbox().tabIndex).toBe(0);
    });

    it('Enter in it does not answer, Escape rejects', async () => {
      askWithOption();
      await settle();
      checkbox().focus();
      checkbox().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await settle();
      expect(log).toEqual([]);
      expect(root()).toBeTruthy();
      pressEscape();
      await settle();
      expect(log).toEqual(['reject']);
      expect(root()).toBeNull();
    });

    it('renders nothing extra without content', async () => {
      ask(extra());
      await settle();
      expect(root()?.querySelector('[class$="-extra"]')).toBeNull();
    });
  });

  describe('popup', () => {
    it('does not trap the focus without content', async () => {
      ask({ target: anchor() });
      await settle();
      expect(document.querySelectorAll('.cdk-focus-trap-anchor[tabindex="0"]')).toHaveLength(0);
    });

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
