import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { UIKIT_MENU_ITEMS } from '../uikit-menu-items';
import routes from '../uikit.routes';
import { CLONE_DURATION_MS, FormPatternsDemo, PICKED_FOLDER } from './form-patterns-demo';

describe('FormPatternsDemo', () => {
  let fixture: ComponentFixture<FormPatternsDemo>;
  let demo: FormPatternsDemo;

  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 20));
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const dialog = () => document.querySelector<HTMLElement>('.cdk-dialog-container');
  const inDialog = <T extends Element = HTMLElement>(selector: string) =>
    dialog()!.querySelector<T>(selector)!;
  const button = (text: string, root: ParentNode = document) =>
    [...root.querySelectorAll('button')].find((b) => b.textContent?.trim() === text)!;
  const url = () => inDialog<HTMLInputElement>('input[formcontrolname="url"]');
  const folder = () => inDialog<HTMLInputElement>('input[formcontrolname="folder"]');
  const submit = () => inDialog<HTMLButtonElement>('button[type="submit"]');
  const described = (el: Element) =>
    (el.getAttribute('aria-describedby') ?? '')
      .split(' ')
      .filter(Boolean)
      .map((id) => document.getElementById(id)?.textContent?.trim());
  const type = (input: HTMLInputElement, value: string) => {
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };
  const pressEscape = () =>
    document.activeElement!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
  const open = async () => {
    const trigger = button('Clone vault…', fixture.nativeElement);
    trigger.focus();
    trigger.click();
    await settle();
  };

  beforeEach(async () => {
    // jsdom has no layout: without client rects nothing counts as tabbable for the focus trap
    vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([
      {},
    ] as unknown as DOMRectList);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideHighlightOptions({
          coreLibraryLoader: () => import('highlight.js/lib/core'),
          languages: { xml: () => import('highlight.js/lib/languages/xml') },
        }),
      ],
    });
    fixture = TestBed.createComponent(FormPatternsDemo);
    demo = fixture.componentInstance;
    document.body.appendChild(fixture.nativeElement);
    await settle();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    fixture.destroy();
    fixture.nativeElement.remove();
    document.querySelectorAll('.cdk-overlay-container').forEach((c) => c.remove());
  });

  it('is a page of the uikit menu with a route of its own', () => {
    expect(UIKIT_MENU_ITEMS).toContainEqual(
      expect.objectContaining({ label: 'Form patterns', path: 'form-patterns' }),
    );
    expect(routes.find((r) => r.path === 'form-patterns')?.component).toBe(FormPatternsDemo);
  });

  it('opens an md dialog with one primary submit button and Cancel in the footer', async () => {
    await open();
    expect(document.querySelector('.hx-dialog-panel')?.classList).toContain('hx-dialog-size-md');
    const footer = [...inDialog('.hx-dialog-footer').querySelectorAll('button')];
    expect(footer.map((b) => [b.textContent?.trim(), b.type])).toEqual([
      ['Cancel', 'button'],
      ['Clone', 'submit'],
    ]);
    expect(footer[0].classList).toContain('hx-button-text');
    expect(footer[0].classList).toContain('hx-button-secondary');
  });

  it('labels each field, with the hint on the URL and a read-only path with a browse button', async () => {
    await open();
    for (const [input, label] of [
      [url(), 'Repository URL'],
      [folder(), 'Target folder'],
    ] as const) {
      expect(input.labels).toHaveLength(1);
      expect(input.labels![0].textContent).toContain(label);
      expect(input.getAttribute('aria-required')).toBe('true');
      expect(input.hasAttribute('aria-invalid')).toBe(false);
    }
    expect(described(url())).toEqual(['HTTPS or SSH']);
    expect(folder().readOnly).toBe(true);
    button('Browse…', dialog()!).click();
    await settle();
    expect(folder().value).toBe(PICKED_FOLDER);
  });

  it('shows each error on submit, wired with aria-invalid and aria-describedby', async () => {
    await open();
    expect(submit().disabled).toBe(false);
    submit().click();
    await settle();
    expect(url().getAttribute('aria-invalid')).toBe('true');
    expect(described(url())).toEqual(['HTTPS or SSH', 'Enter a repository URL']);
    expect(folder().getAttribute('aria-invalid')).toBe('true');
    expect(described(folder())).toEqual(['Choose a target folder']);
    expect(demo.saving()).toBe(false);
    expect(dialog()).not.toBeNull();
  });

  it('starts on the first field and gives the focus back when it closes', async () => {
    await open();
    expect(document.activeElement).toBe(url());
    pressEscape();
    await settle();
    expect(document.activeElement).toBe(button('Clone vault…', fixture.nativeElement));
  });

  it('submits on Enter: the primary button is the default button of the form', async () => {
    await open();
    const form = inDialog<HTMLFormElement>('form');
    // Implicit submission presses the first submit button of the form, wherever it is; jsdom does not
    // do that for a key press, so the test presses the button the browser would press.
    const defaultButton = [...document.querySelectorAll('button')].find(
      (b) => b.type === 'submit' && b.form === form,
    );
    expect(defaultButton).toBe(submit());
    type(url(), 'git@example.com:ada/notes.git');
    button('Browse…', dialog()!).click();
    await settle();
    vi.useFakeTimers();
    defaultButton!.click();
    expect(demo.saving()).toBe(true);
    fixture.detectChanges();
    expect(submit().getAttribute('aria-busy')).toBe('true');
    expect(button('Cancel', dialog()!).disabled).toBe(true);
    // a second Enter while it runs starts nothing
    const add = vi.spyOn(demo.form, 'getRawValue');
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(add).not.toHaveBeenCalled();

    vi.advanceTimersByTime(CLONE_DURATION_MS);
    vi.useRealTimers();
    await settle();
    expect(demo.saving()).toBe(false);
    expect(dialog()).toBeNull();
    expect(document.body.textContent).toContain('Vault cloned');
  });

  it('closes on Escape while nothing would be lost', async () => {
    await open();
    pressEscape();
    await settle();
    expect(demo.open()).toBe(false);
    expect(dialog()).toBeNull();
  });

  it('keeps unsaved changes on Escape and asks before Cancel discards them', async () => {
    await open();
    type(url(), 'https://example.com/notes.git');
    await settle();
    pressEscape();
    await settle();
    expect(demo.open()).toBe(true);
    expect(inDialog('.hx-dialog').querySelector('.hx-dialog-close')).toBeNull();

    button('Cancel', dialog()!).click();
    await settle();
    button('Keep editing').click();
    await settle();
    expect(demo.open()).toBe(true);
    expect(url().value).toBe('https://example.com/notes.git');

    button('Cancel', dialog()!).click();
    await settle();
    button('Discard').click();
    await settle();
    expect(demo.open()).toBe(false);

    await open();
    expect(url().value).toBe('');
    expect(url().hasAttribute('aria-invalid')).toBe(false);
  });
});
