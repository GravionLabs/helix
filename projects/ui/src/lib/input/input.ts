import {
  afterEveryRender,
  afterNextRender,
  booleanAttribute,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { NgControl } from '@angular/forms';

export type HxInputSize = 'small' | 'medium' | 'large';
export type HxInputVariant = 'outlined' | 'filled';

/**
 * A native `<input>` or `<textarea>` styled as a Helix text field. It works with template-driven forms,
 * reactive forms and signal forms unchanged: the element stays a native control.
 *
 * ```html
 * <label for="name">Name</label>
 * <input hx-input id="name" [(ngModel)]="name" />
 * <textarea hx-input variant="filled" rows="4"></textarea>
 * <textarea hx-input autoResize rows="2"></textarea>
 * <input hx-input [attr.aria-invalid]="invalid() ? 'true' : null" aria-describedby="name-error" />
 * ```
 *
 * The invalid look comes from `aria-invalid="true"` (set it yourself or let the forms API do it) and from
 * Angular's `ng-invalid ng-touched` classes. `autoResize` (textarea only) makes the height follow the content,
 * with `rows` as the minimum; it also follows a value a form writes. Always give a field a visible `<label>`; a placeholder is a hint.
 */
@Directive({
  selector: 'input[hx-input], textarea[hx-input]',
  exportAs: 'hx-input',
  host: {
    class: 'hx-input',
    '[class.hx-input-filled]': "variant() === 'filled'",
    '[class.hx-input-sm]': "size() === 'small'",
    '[class.hx-input-lg]': "size() === 'large'",
    '[class.hx-input-fluid]': 'fluid()',
    '[class.hx-input-auto-resize]': 'autoResize()',
    '(input)': 'resize()',
  },
})
export class HxInput {
  /** `outlined` (default) or a tinted `filled` field. */
  readonly variant = input<HxInputVariant>('outlined');

  readonly size = input<HxInputSize>('medium');

  /** Takes the full width of the container. */
  readonly fluid = input(false, { transform: booleanAttribute });

  /** Textarea only: grows and shrinks with its content, `rows` is the minimum height. */
  readonly autoResize = input(false, { transform: booleanAttribute });

  readonly #el =
    inject<ElementRef<HTMLInputElement | HTMLTextAreaElement>>(ElementRef).nativeElement;
  #measured = { value: '', width: -1 };

  constructor() {
    // a form writes its value without an `input` event: signal forms render again (check after every render,
    // cheap when nothing changed); ngModel and reactive forms announce it on `valueChanges`, after the write
    afterEveryRender({ write: () => this.resize() });
    const control = inject(NgControl, { self: true, optional: true });
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const sub = control?.valueChanges?.subscribe(() => queueMicrotask(() => this.resize()));
      destroyRef.onDestroy(() => sub?.unsubscribe());
    });
  }

  protected resize(): void {
    const el = this.#el;
    if (!this.autoResize() || !(el instanceof HTMLTextAreaElement)) return;
    const width = el.offsetWidth;
    if (el.value === this.#measured.value && width === this.#measured.width) return;
    this.#measured = { value: el.value, width };
    const border = el.offsetHeight - el.clientHeight;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight + border}px`;
  }
}
