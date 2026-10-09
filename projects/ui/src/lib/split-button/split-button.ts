import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  viewChild,
} from '@angular/core';
import {
  HxButton,
  type HxButtonSeverity,
  type HxButtonSize,
  type HxButtonVariant,
} from '../button/button';
import { HxMenu } from '../menu/menu';
import type { HxMenuItem } from '../menu-item';

/**
 * A default action with a menu of related actions: a button and, joined to it, a button that opens an `hx-menu`.
 *
 * ```html
 * <hx-split-button label="Save" icon="pi pi-save" [model]="items" (click)="save()" />
 * ```
 *
 * `(click)` is the native click of the main button (clicks on the menu button do not reach it); `(triggered)` fires for
 * an item chosen in the menu, after its `command`. The look comes from `severity`, `variant` and `size` as on
 * `hx-button`. The menu button needs a name: `menuButtonLabel` (default "More actions").
 */
@Component({
  selector: 'hx-split-button',
  imports: [HxButton, HxMenu],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-split-button',
    role: 'group',
    '[attr.aria-label]': 'label() || null',
    '[class.hx-split-button-rounded]': 'rounded()',
    '[class.hx-split-button-raised]': 'raised()',
    '[class.hx-split-button-outlined]': "variant() === 'outlined'",
  },
  template: `
    <button
      hx-button
      type="button"
      class="hx-split-button-main"
      [variant]="variant()"
      [severity]="severity()"
      [size]="size()"
      [disabled]="disabled()"
    >
      @if (icon()) {
        <span class="hx-button-icon" [class]="icon()" aria-hidden="true"></span>
      }
      {{ label() }}
    </button>
    <button
      hx-button
      iconOnly
      type="button"
      class="hx-split-button-menu"
      aria-haspopup="menu"
      [variant]="variant()"
      [severity]="severity()"
      [size]="size()"
      [disabled]="disabled()"
      [attr.aria-expanded]="menu.open()"
      [attr.aria-label]="menuButtonLabel()"
      (click)="$event.stopPropagation(); menu.toggle($event)"
    >
      <span class="hx-split-button-chevron" aria-hidden="true"></span>
    </button>
    <hx-menu #menu popup [model]="model()" [ariaLabel]="menuButtonLabel()" (triggered)="triggered.emit($event)" />
  `,
})
export class HxSplitButton {
  /** Text of the main button. */
  readonly label = input<string>();
  /** CSS classes of an icon font for the main button, e.g. `pi pi-save`. */
  readonly icon = input<string>();
  /** The related actions in the menu. */
  readonly model = input<readonly HxMenuItem[]>([]);
  readonly variant = input<HxButtonVariant>('filled');
  readonly severity = input<HxButtonSeverity>('primary');
  readonly size = input<HxButtonSize>('medium');
  readonly rounded = input(false, { transform: booleanAttribute });
  readonly raised = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Accessible name of the button that opens the menu. */
  readonly menuButtonLabel = input('More actions');

  /** An item of the menu was activated. */
  readonly triggered = output<HxMenuItem>();

  private readonly menu = viewChild.required(HxMenu);
}
