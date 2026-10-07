import { booleanAttribute, DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';

export type HxButtonVariant = 'filled' | 'outlined' | 'text' | 'link';
export type HxButtonSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warn'
  | 'help'
  | 'danger'
  | 'contrast';
export type HxButtonSize = 'small' | 'medium' | 'large';

/**
 * A native `<button>` or `<a>` dressed as a Helix button. The label is the element's content; an icon is
 * an inline `<svg>` or an element with `hxButtonIcon` next to it. Styled by `@gravionlabs/helix-ui/styles.css`
 * on the `--h-button-*` design tokens.
 *
 * ```html
 * <button hxButton severity="success" (click)="save()">Save</button>
 * <button hxButton variant="outlined" [loading]="saving()">Save</button>
 * <button hxButton iconOnly aria-label="Add"><svg …/></button>
 * ```
 *
 * A loading button stays focusable (`aria-busy`) but swallows clicks; a disabled one is the native `disabled`
 * attribute (or `aria-disabled="true"` on an anchor). An icon-only button needs an accessible name.
 */
@Directive({
  selector: 'button[hxButton], a[hxButton]',
  exportAs: 'hxButton',
  host: {
    class: 'hx-button',
    '[class.hx-button-outlined]': "variant() === 'outlined'",
    '[class.hx-button-text]': "variant() === 'text'",
    '[class.hx-button-link]': "variant() === 'link'",
    '[class.hx-button-secondary]': "severity() === 'secondary'",
    '[class.hx-button-success]': "severity() === 'success'",
    '[class.hx-button-info]': "severity() === 'info'",
    '[class.hx-button-warn]': "severity() === 'warn'",
    '[class.hx-button-help]': "severity() === 'help'",
    '[class.hx-button-danger]': "severity() === 'danger'",
    '[class.hx-button-contrast]': "severity() === 'contrast'",
    '[class.hx-button-sm]': "size() === 'small'",
    '[class.hx-button-lg]': "size() === 'large'",
    '[class.hx-button-rounded]': 'rounded()',
    '[class.hx-button-raised]': 'raised()',
    '[class.hx-button-fluid]': 'fluid()',
    '[class.hx-button-icon-only]': 'iconOnly()',
    '[class.hx-button-loading]': 'loading()',
    '[attr.aria-busy]': "loading() ? 'true' : null",
  },
})
export class HxButton {
  /** How loud the button is: filled (default), outlined, text or link. */
  readonly variant = input<HxButtonVariant>('filled');

  /** What the button means: `primary` (default), `secondary` and the status colours. */
  readonly severity = input<HxButtonSeverity>('primary');

  readonly size = input<HxButtonSize>('medium');

  /** A pill instead of the 6 px radius; a circle for an icon-only button. */
  readonly rounded = input(false, { transform: booleanAttribute });

  /** Adds the elevation shadow. */
  readonly raised = input(false, { transform: booleanAttribute });

  /** Takes the full width of the container. */
  readonly fluid = input(false, { transform: booleanAttribute });

  /** Square button for a single icon; give it `aria-label`. */
  readonly iconOnly = input(false, { transform: booleanAttribute });

  /** Shows a spinner and ignores clicks while an operation runs. */
  readonly loading = input(false, { transform: booleanAttribute });

  constructor() {
    // A capture listener on the host itself fires before the click listeners of the consuming template
    // (a host `(click)` binding would not: its order against the template's is not guaranteed).
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const guard = (event: Event) => {
      if (this.loading() || host.getAttribute('aria-disabled') === 'true') {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    host.addEventListener('click', guard, true);
    inject(DestroyRef).onDestroy(() => host.removeEventListener('click', guard, true));
  }
}
