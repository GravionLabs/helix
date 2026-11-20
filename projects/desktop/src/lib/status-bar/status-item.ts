import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  Directive,
  ElementRef,
  inject,
  input,
  model,
  output,
} from '@angular/core';

/** Marks the content of a status item that opens as a popover above the bar. */
@Directive({ selector: '[hxStatusPopover]' })
export class HxStatusPopover {}

/** The tone of a status item. */
export type HxStatusTone = 'neutral' | 'warn' | 'error' | 'accent';

/**
 * One item of the status bar, as text or as a button.
 *
 * ```html
 * <hx-status-item kind="button" title="Update available" ariaLabel="Update details" tone="accent"
 *   [(popoverOpen)]="open">
 *   Update 1.5.0
 *   <div hxStatusPopover>Release notes ...</div>
 * </hx-status-item>
 * ```
 *
 * - `kind`: `'text'` (default) or `'button'`.
 * - `pressed`: emits when a button item is activated (click, Enter or Space). Not for a disabled item, a text
 *   item or a click inside the popover.
 * - `announce`: sets `role="status"` on the item, for a value that changes while the user works (a sync
 *   state). The bar itself is not a live region.
 * - An element with `hxStatusPopover` inside the item is a popover above the bar, shown while
 *   `popoverOpen` is true. Escape and a click outside close it. Give a popover item `kind="button"`.
 */
@Component({
  selector: 'hx-status-item',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-status-item',
    '[class.hx-status-warn]': "tone() === 'warn'",
    '[class.hx-status-error]': "tone() === 'error'",
    '[class.hx-status-accent]': "tone() === 'accent'",
    '[attr.title]': 'null',
    '[attr.role]': "announce() ? 'status' : null",
    '(document:keydown.escape)': 'close()',
    '(document:click)': 'onDocumentClick($event)',
  },
  templateUrl: './status-item.html',
})
export class HxStatusItem {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Text or button. */
  readonly kind = input<'text' | 'button'>('text');
  /** The tooltip. */
  readonly title = input<string | null>(null);
  /** The accessible name, when the visible text is not enough. */
  readonly ariaLabel = input<string | null>(null);
  readonly disabled = input(false);
  readonly tone = input<HxStatusTone>('neutral');
  /** Marks the item as a live region (`role="status"`). */
  readonly announce = input(false);
  /** Whether the popover is open. */
  readonly popoverOpen = model(false);
  /** Emits when a button item is activated by click, Enter or Space. */
  readonly pressed = output<void>();

  private readonly popover = contentChild(HxStatusPopover);

  protected get hasPopover(): boolean {
    return this.popover() !== undefined;
  }

  protected onButtonClick(): void {
    if (this.hasPopover) this.popoverOpen.update((open) => !open);
    this.pressed.emit();
  }

  protected close(): void {
    if (this.popoverOpen()) this.popoverOpen.set(false);
  }

  protected onDocumentClick(event: Event): void {
    if (this.popoverOpen() && !this.host.nativeElement.contains(event.target as Node)) {
      this.popoverOpen.set(false);
    }
  }
}
