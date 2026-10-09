import {
  CdkConnectedOverlay,
  type ConnectedOverlayPositionChange,
  type ConnectedPosition,
} from '@angular/cdk/overlay';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  type ElementRef,
  Injector,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

/**
 * A small panel anchored to an element, with arbitrary content and an arrow pointing at the element.
 *
 * ```html
 * <button hx-button aria-haspopup="dialog" (click)="op.toggle($event)">Share</button>
 * <hx-popover #op ariaLabel="Share this page">
 *   <input hx-input aria-label="Link" value="https://…" />
 * </hx-popover>
 * ```
 *
 * `toggle(event, target?)`, `show(event, target?)` and `hide()` open it below the element of the event (or `target`),
 * or above when there is no room. An outside click and Escape close it. It is a non-modal `role="dialog"`: the focus
 * moves to its first control when it has one and returns to the element that opened it when it closes, and the page
 * behind stays reachable. Name it with `ariaLabel` or `ariaLabelledBy`, and put `aria-haspopup="dialog"` on the
 * trigger. Projected content is created with the popover, only shown while it is open.
 */
@Component({
  selector: 'hx-popover',
  imports: [CdkConnectedOverlay],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-popover-anchor' },
  template: `
    <ng-template
      cdkConnectedOverlay
      cdkConnectedOverlayPanelClass="hx-popover-overlay"
      [cdkConnectedOverlayOrigin]="origin() ?? fallbackOrigin"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayPositions]="positions"
      (overlayOutsideClick)="onOutsideClick($event)"
      (overlayKeydown)="onKeydown($event)"
      (positionChange)="onPosition($event)"
      (attach)="onAttach()"
      (detach)="onDetach()"
    >
      <div
        #panel
        class="hx-popover"
        [class]="panelClass() ?? ''"
        [attr.role]="role()"
        [class.hx-popover-above]="above()"
        [class.hx-popover-end]="end()"
        [attr.aria-label]="ariaLabel() || null"
        [attr.aria-labelledby]="ariaLabelledBy() || null"
        [attr.aria-describedby]="ariaDescribedBy() || null"
      >
        <div class="hx-popover-content"><ng-content /></div>
      </div>
    </ng-template>
  `,
})
export class HxPopover {
  readonly #injector = inject(Injector);
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  /** Accessible name of the popover. */
  readonly ariaLabel = input<string>();
  readonly ariaLabelledBy = input<string>();
  readonly ariaDescribedBy = input<string>();
  /** `alertdialog` for a question that needs an answer (the confirm popup). */
  readonly role = input<'dialog' | 'alertdialog'>('dialog');
  /** Extra CSS classes on the panel. */
  readonly panelClass = input<string>();
  /** A click outside closes it. */
  readonly dismissable = input(true, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });

  readonly shown = output<void>();
  readonly hidden = output<void>();

  readonly open = signal(false);
  protected readonly origin = signal<Element | null>(null);
  protected readonly fallbackOrigin = document.body;
  /** The popover is above the element (no room below). */
  protected readonly above = signal(false);
  /** The popover is aligned to the end edge of the element (no room to extend to the right). */
  protected readonly end = signal(false);
  protected readonly positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
  ];

  /** Opens it at the element of the event (or `target`), or closes it when it is open. */
  toggle(event: Event | Element, target?: Element | null): void {
    if (this.open()) this.hide();
    else this.show(event, target);
  }

  /** Opens it at `target`, else at the element of the event; an element can be passed instead of an event. */
  show(event: Event | Element, target?: Element | null): void {
    if (this.open()) return;
    const fromEvent =
      event instanceof Element ? event : ((event.currentTarget ?? event.target) as Element | null);
    this.origin.set(target ?? fromEvent);
    this.open.set(true);
    this.shown.emit();
  }

  hide(refocus = true): void {
    if (!this.open()) return;
    this.open.set(false);
    this.hidden.emit();
    if (refocus) (this.origin() as HTMLElement | null)?.focus?.();
  }

  protected onPosition(change: ConnectedOverlayPositionChange): void {
    this.above.set(change.connectionPair.overlayY === 'bottom');
    this.end.set(change.connectionPair.overlayX === 'end');
  }

  protected onAttach(): void {
    afterNextRender(
      () => {
        const first = this.panel()?.nativeElement.querySelector<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        first?.focus();
      },
      { injector: this.#injector },
    );
  }

  protected onDetach(): void {
    if (this.open()) {
      this.open.set(false);
      this.hidden.emit();
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.closeOnEscape()) {
      event.preventDefault();
      this.hide();
    }
  }

  protected onOutsideClick(event: MouseEvent): void {
    if (!this.dismissable()) return;
    if (!this.origin()?.contains(event.target as Node)) this.hide(false);
  }
}
