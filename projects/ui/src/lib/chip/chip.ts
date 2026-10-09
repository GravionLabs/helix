import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * A compact element for an entity (a person, a filter, a tag the user added), optionally removable.
 *
 * ```html
 * <hx-chip label="Amy Elsner" image="/amy.png" />
 * <hx-chip label="Angular" icon="pi pi-code" removable (remove)="drop('Angular')" />
 * ```
 *
 * A removable chip is focusable: Backspace or Delete removes it, as does its remove button (named by
 * `removeLabel`). The chip only reports the removal through `(remove)`; the app drops it from its data.
 */
@Component({
  selector: 'hx-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-chip',
    '[class.hx-chip-removable]': 'removable()',
    '[attr.role]': "removable() ? 'group' : null",
    '[attr.aria-label]': 'removable() ? label() : null',
    '[attr.tabindex]': 'removable() ? 0 : null',
    '(keydown.backspace)': 'onKey($event)',
    '(keydown.delete)': 'onKey($event)',
  },
  template: `
    @if (image()) {
      <img class="hx-chip-image" [src]="image()" [alt]="imageAlt()" />
    } @else if (icon()) {
      <span class="hx-chip-icon" [class]="icon()" aria-hidden="true"></span>
    }
    <span class="hx-chip-label">{{ label() }}<ng-content /></span>
    @if (removable()) {
      <button type="button" class="hx-chip-remove" [attr.aria-label]="removeLabel()" (click)="remove.emit()">
        <span class="hx-chip-remove-icon" aria-hidden="true"></span>
      </button>
    }
  `,
})
export class HxChip {
  /** The text; content can be projected as well. */
  readonly label = input<string>();
  /** CSS classes of an icon font, e.g. `pi pi-user`. Not shown when there is an `image`. */
  readonly icon = input<string>();
  /** Address of a picture shown before the label. */
  readonly image = input<string>();
  /** Alternative text of the picture; empty (decorative) by default because the label names the chip. */
  readonly imageAlt = input('');
  /** Shows a remove button and makes the chip focusable. */
  readonly removable = input(false, { transform: booleanAttribute });
  /** Accessible name of the remove button. */
  readonly removeLabel = input('Remove');

  /** The chip should be removed: the remove button was pressed, or Backspace/Delete on the chip. */
  readonly remove = output<void>();

  protected onKey(event: Event): void {
    if (!this.removable() || event.target !== event.currentTarget) return;
    event.preventDefault();
    this.remove.emit();
  }
}
