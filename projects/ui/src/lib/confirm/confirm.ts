import { Dialog, type DialogRef } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  Injectable,
  inject,
  signal,
  type TemplateRef,
  untracked,
  viewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { HxButton, type HxButtonSeverity } from '../button/button';
import { HxDialogFrame } from '../dialog/dialog';
import { nextId } from '../internal/ids';
import { HxPopover } from '../popover/popover';

/** One question for the user. */
export interface HxConfirmation {
  message: string;
  /** Title of a confirm dialog. */
  header?: string;
  /** CSS classes of an icon font, e.g. `pi pi-exclamation-triangle`. */
  icon?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  acceptSeverity?: HxButtonSeverity;
  /**
   * An element (or the event that came from it): the question is asked in a popup anchored to it by
   * `<hx-confirm-popup />`. Without it the question is a centred dialog from `<hx-confirm-dialog />`.
   */
  target?: Element | Event | null;
  /** Called when the user accepts. */
  accept?: () => void;
  /** Called when the user rejects, presses Escape or clicks away. */
  reject?: () => void;
}

/**
 * Asks the user to confirm an action. Put `<hx-confirm-dialog />` and/or `<hx-confirm-popup />` once in the app
 * (e.g. in the root component), then:
 *
 * ```ts
 * confirmation.confirm({ message: 'Delete this item?', header: 'Delete', accept: () => this.delete() });
 * if (await confirmation.confirmAsync({ message: 'Discard changes?', target: event })) { … }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class HxConfirmationService {
  /** The questions, in order. The two components listen to it. */
  readonly requests = new Subject<HxConfirmation>();

  confirm(confirmation: HxConfirmation): void {
    this.requests.next(confirmation);
  }

  /** Resolves to `true` when accepted and to `false` when rejected or dismissed. */
  confirmAsync(confirmation: HxConfirmation): Promise<boolean> {
    return new Promise((resolve) =>
      this.confirm({
        ...confirmation,
        accept: () => {
          confirmation.accept?.();
          resolve(true);
        },
        reject: () => {
          confirmation.reject?.();
          resolve(false);
        },
      }),
    );
  }
}

const targetOf = (target: Element | Event | null | undefined): Element | null =>
  target instanceof Element
    ? target
    : target
      ? ((target.currentTarget ?? target.target) as Element | null)
      : null;

/**
 * Shows the questions of `HxConfirmationService.confirm` that have no `target` as a centred modal
 * `role="alertdialog"`: the message describes it, the focus starts on the reject button, Escape rejects. Questions that
 * arrive while one is open wait their turn. Clicking the mask does nothing: the user must answer.
 */
@Component({
  selector: 'hx-confirm-dialog',
  imports: [HxDialogFrame, HxButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-confirm-anchor' },
  template: `
    <ng-template #panel>
      @if (current(); as c) {
        <hx-dialog-frame [header]="c.header" [titleId]="titleId" [closable]="false">
          <div class="hx-confirm-content">
            @if (c.icon) {
              <span class="hx-confirm-icon" [class]="c.icon" aria-hidden="true"></span>
            }
            <p class="hx-confirm-message" [id]="messageId">{{ c.message }}</p>
          </div>
          <ng-container ngProjectAs="[hxDialogFooter]">
            <button hx-button type="button" variant="text" severity="secondary" class="hx-confirm-reject" (click)="answer(false)">{{ c.rejectLabel ?? 'No' }}</button>
            <button hx-button type="button" class="hx-confirm-accept" [severity]="c.acceptSeverity ?? 'primary'" (click)="answer(true)">{{ c.acceptLabel ?? 'Yes' }}</button>
          </ng-container>
        </hx-dialog-frame>
      }
    </ng-template>
  `,
})
export class HxConfirmDialog {
  readonly #dialog = inject(Dialog);
  readonly #overlay = inject(Overlay);
  private readonly panel = viewChild<TemplateRef<unknown>>('panel');

  protected readonly current = signal<HxConfirmation | null>(null);
  protected readonly titleId = nextId('hx-confirm-title');
  protected readonly messageId = nextId('hx-confirm-message');
  readonly #queue: HxConfirmation[] = [];
  #ref: DialogRef<boolean, unknown> | undefined;

  constructor() {
    const subscription = inject(HxConfirmationService).requests.subscribe((request) => {
      if (targetOf(request.target)) return; // the popup's
      this.#queue.push(request);
      this.#next();
    });
    effect(() => {
      // a question that arrived before the template existed
      this.panel();
      untracked(() => this.#next());
    });
    inject(DestroyRef).onDestroy(() => {
      subscription.unsubscribe();
      this.#ref?.close();
    });
  }

  #next(): void {
    const panel = this.panel();
    if (this.#ref || !panel) return;
    const request = this.#queue.shift();
    if (!request) return;
    this.current.set(request);
    const ref = this.#dialog.open<boolean>(panel, {
      role: 'alertdialog',
      hasBackdrop: true,
      backdropClass: 'hx-dialog-backdrop',
      panelClass: 'hx-confirm-panel',
      width: '28rem',
      maxWidth: 'calc(100vw - 2rem)',
      positionStrategy: this.#overlay.position().global().centerHorizontally().centerVertically(),
      ariaModal: true,
      ariaDescribedBy: this.messageId,
      ariaLabelledBy: request.header ? this.titleId : null,
      ariaLabel: request.header ? null : 'Confirmation',
      disableClose: true,
      autoFocus: '.hx-confirm-reject',
      restoreFocus: true,
    });
    this.#ref = ref;
    ref.keydownEvents.subscribe((event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        ref.close(false);
      }
    });
    ref.closed.subscribe((accepted) => {
      this.#ref = undefined;
      this.current.set(null);
      if (accepted) request.accept?.();
      else request.reject?.();
      this.#next();
    });
  }

  protected answer(accepted: boolean): void {
    this.#ref?.close(accepted);
  }
}

/**
 * Shows the questions of `HxConfirmationService.confirm` that have a `target` in a popup anchored to it, as a
 * `role="alertdialog"` with the message as its description. The focus starts on the reject button; Escape and a click
 * outside reject.
 */
@Component({
  selector: 'hx-confirm-popup',
  imports: [HxPopover, HxButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-confirm-anchor' },
  template: `
    <hx-popover #popover role="alertdialog" panelClass="hx-confirm-popup" ariaLabel="Confirmation" [ariaDescribedBy]="messageId" (hidden)="onHidden()">
      @if (current(); as c) {
        <div class="hx-confirm-popup-content">
          @if (c.icon) {
            <span class="hx-confirm-popup-icon" [class]="c.icon" aria-hidden="true"></span>
          }
          <span class="hx-confirm-popup-message" [id]="messageId">{{ c.message }}</span>
        </div>
        <div class="hx-confirm-popup-footer">
          <button hx-button type="button" variant="text" severity="secondary" size="small" class="hx-confirm-reject" (click)="answer(false)">{{ c.rejectLabel ?? 'No' }}</button>
          <button hx-button type="button" size="small" class="hx-confirm-accept" [severity]="c.acceptSeverity ?? 'primary'" (click)="answer(true)">{{ c.acceptLabel ?? 'Yes' }}</button>
        </div>
      }
    </hx-popover>
  `,
})
export class HxConfirmPopup {
  private readonly popover = viewChild.required<HxPopover>('popover');
  protected readonly current = signal<HxConfirmation | null>(null);
  protected readonly messageId = nextId('hx-confirm-popup-message');
  #answered = false;

  constructor() {
    const subscription = inject(HxConfirmationService).requests.subscribe((request) => {
      const target = targetOf(request.target);
      if (!target) return; // the dialog's
      const popover = this.popover();
      if (popover.open()) popover.hide(false); // the open question counts as rejected
      this.#answered = false;
      this.current.set(request);
      popover.show(target);
    });
    inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
  }

  protected answer(accepted: boolean): void {
    const request = this.current();
    if (!request) return;
    this.#answered = true;
    this.popover().hide();
    if (accepted) request.accept?.();
    else request.reject?.();
  }

  /** Closed by Escape, a click outside or a new question: no answer means no. */
  protected onHidden(): void {
    const request = this.current();
    if (request && !this.#answered) request.reject?.();
    this.#answered = true;
  }
}
