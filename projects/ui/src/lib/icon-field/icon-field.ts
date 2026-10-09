import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';

export type HxIconPosition = 'left' | 'right';

/**
 * An icon inside a text field. Wrap an `hx-input` (or `hx-password`) and one `hx-input-icon` element; the
 * field gets room for the icon, which sits on the start (`left`, default) or end (`right`) edge.
 *
 * ```html
 * <hx-icon-field>
 *   <i class="pi pi-search" hx-input-icon></i>
 *   <input hx-input placeholder="Search" aria-label="Search" />
 * </hx-icon-field>
 * <hx-icon-field iconPosition="right">…</hx-icon-field>
 * ```
 *
 * `left` and `right` follow the writing direction (start and end). The icon is decorative and ignores clicks.
 */
@Component({
  selector: 'hx-icon-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-icon-field',
    '[class.hx-icon-field-left]': "iconPosition() === 'left'",
    '[class.hx-icon-field-right]': "iconPosition() === 'right'",
  },
  template: '<ng-content />',
})
export class HxIconField {
  readonly iconPosition = input<HxIconPosition>('left');
}

/**
 * The icon of an `hx-icon-field`: any element, for example `<i class="pi pi-search" hx-input-icon></i>` or an
 * inline `<svg>`. It is hidden from assistive technology unless it has an `aria-label`.
 */
@Directive({
  selector: '[hx-input-icon]',
  host: {
    class: 'hx-input-icon',
    '[attr.aria-hidden]': 'hidden()',
  },
})
export class HxInputIcon {
  readonly #element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected hidden(): 'true' | null {
    return this.#element.hasAttribute('aria-label') ? null : 'true';
  }
}
