import { booleanAttribute, ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { nextId } from '../internal/ids';

/**
 * A native `<fieldset>` with a `<legend>` that groups related controls and can collapse.
 *
 * ```html
 * <hx-fieldset legend="Shipping address" toggleable [(collapsed)]="closed">
 *   <label for="street">Street</label> <input hx-input id="street" />
 * </hx-fieldset>
 * ```
 *
 * When `toggleable`, the legend holds a `<button>` with `aria-expanded` and `aria-controls`; the content is `inert`
 * while collapsed so its controls leave the tab order. Expanding and collapsing is animated unless the user
 * prefers reduced motion. Legend and fieldset keep their native meaning for assistive technology.
 */
@Component({
  selector: 'hx-fieldset',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-fieldset',
    '[class.hx-fieldset-toggleable]': 'toggleable()',
    '[class.hx-fieldset-collapsed]': 'isCollapsed()',
  },
  template: `
    <fieldset class="hx-fieldset-box">
      <legend class="hx-fieldset-legend">
        @if (toggleable()) {
          <button
            type="button"
            class="hx-fieldset-toggle"
            [attr.aria-expanded]="!isCollapsed()"
            [attr.aria-controls]="contentId"
            (click)="toggle()"
          >
            <span class="hx-fieldset-toggle-icon" aria-hidden="true"></span>
            <span>{{ legend() }}</span>
          </button>
        } @else {
          <span class="hx-fieldset-legend-text">{{ legend() }}</span>
        }
      </legend>
      <div class="hx-fieldset-collapse" [attr.inert]="isCollapsed() ? '' : null">
        <div class="hx-fieldset-collapse-inner">
          <div class="hx-fieldset-content" [id]="contentId"><ng-content /></div>
        </div>
      </div>
    </fieldset>
  `,
})
export class HxFieldset {
  /** The legend text. */
  readonly legend = input('');
  /** The legend gets a button that collapses and expands the content. */
  readonly toggleable = input(false, { transform: booleanAttribute });
  /** Whether the content is collapsed (only a `toggleable` fieldset collapses). */
  readonly collapsed = model(false);

  protected readonly contentId = nextId('hx-fieldset-content');
  protected isCollapsed(): boolean {
    return this.toggleable() && this.collapsed();
  }

  protected toggle(): void {
    this.collapsed.set(!this.collapsed());
  }
}
