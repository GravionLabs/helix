import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';

let nextId = 0;
const HIDDEN = 'hidden';

/**
 * A trigger that shows and hides the element right after it (a popup panel or a collapsed menu) by toggling
 * the `hidden` class, the way the shell's Tailwind layout expects it. It sets `aria-expanded` and
 * `aria-controls`, closes on Escape (focus returns to the trigger) and on a click outside the trigger and the
 * panel. `helixDisclosureAnimate` fades the panel in and out with the `animate-scalein` / `animate-fadeout`
 * classes, unless the user prefers reduced motion.
 *
 * ```html
 * <button type="button" helixDisclosure helixDisclosureAnimate aria-label="Settings">…</button>
 * <div class="hidden">the panel</div>
 * ```
 */
@Directive({
  selector: '[helixDisclosure]',
  host: {
    '[attr.aria-expanded]': 'expanded()',
    '(click)': 'toggle()',
    '(keydown.escape)': 'close(true)',
  },
})
export class HelixDisclosure {
  readonly animate = input(false, { alias: 'helixDisclosureAnimate', transform: booleanAttribute });

  readonly #trigger = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly #doc = inject(DOCUMENT);
  readonly expanded = signal(false);
  #stopOutside: (() => void) | null = null;
  #fallback: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    afterNextRender(() => this.expanded.set(this.#isOpen()));
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.#fallback);
      this.#stopOutside?.();
    });
  }

  get #panel(): HTMLElement | null {
    return this.#trigger.nextElementSibling as HTMLElement | null;
  }

  #isOpen(): boolean {
    const panel = this.#panel;
    return !!panel && !panel.classList.contains(HIDDEN);
  }

  #motion(): boolean {
    return (
      this.animate() &&
      !this.#doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    );
  }

  toggle(): void {
    if (this.#isOpen()) this.close();
    else this.open();
  }

  open(): void {
    const panel = this.#panel;
    if (!panel || this.#isOpen()) return;
    clearTimeout(this.#fallback);
    if (!panel.id) panel.id = `helix-disclosure-${nextId++}`;
    this.#trigger.setAttribute('aria-controls', panel.id);
    panel.classList.remove('animate-fadeout');
    panel.classList.remove(HIDDEN);
    if (this.#motion()) {
      panel.classList.add('animate-scalein');
      panel.addEventListener('animationend', () => panel.classList.remove('animate-scalein'), {
        once: true,
      });
    }
    this.expanded.set(true);
    const onClick = (event: Event) => {
      const target = event.target as Node;
      if (!this.#trigger.contains(target) && !panel.contains(target)) this.close();
    };
    // the click that opened the panel is still bubbling: start listening afterwards
    setTimeout(() => this.#doc.addEventListener('click', onClick));
    this.#stopOutside = () => this.#doc.removeEventListener('click', onClick);
  }

  close(refocus = false): void {
    const panel = this.#panel;
    this.#stopOutside?.();
    this.#stopOutside = null;
    if (!panel || !this.#isOpen()) return;
    const hide = () => {
      clearTimeout(this.#fallback);
      panel.classList.remove('animate-scalein', 'animate-fadeout');
      panel.classList.add(HIDDEN);
    };
    if (this.#motion()) {
      panel.classList.remove('animate-scalein');
      panel.classList.add('animate-fadeout');
      panel.addEventListener('animationend', hide, { once: true });
      this.#fallback = setTimeout(hide, 400);
    } else {
      hide();
    }
    this.expanded.set(false);
    if (refocus) this.#trigger.focus();
  }
}
