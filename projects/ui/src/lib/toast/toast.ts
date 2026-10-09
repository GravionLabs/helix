import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  type OnInit,
} from '@angular/core';
import { HxMessageService, type HxToastMessage } from './message-service';

export type HxToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/** One message: pauses its timer while the pointer or the focus is on it. */
@Component({
  selector: 'hx-toast-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-toast-item',
    '[class.hx-toast-info]': "severity() === 'info'",
    '[class.hx-toast-success]': "severity() === 'success'",
    '[class.hx-toast-warn]': "severity() === 'warn'",
    '[class.hx-toast-error]': "severity() === 'error'",
    '[class.hx-toast-secondary]': "severity() === 'secondary'",
    '[class.hx-toast-contrast]': "severity() === 'contrast'",
    '[attr.role]': "severity() === 'warn' || severity() === 'error' ? 'alert' : 'status'",
    '[attr.aria-live]': "severity() === 'warn' || severity() === 'error' ? 'assertive' : 'polite'",
    'aria-atomic': 'true',
    '(mouseenter)': 'pause()',
    '(mouseleave)': 'resume()',
    '(focusin)': 'pause()',
    '(focusout)': 'resume()',
  },
  template: `
    <div class="hx-toast-content">
      <span class="hx-toast-icon" aria-hidden="true"></span>
      <div class="hx-toast-text">
        @if (message().summary) {
          <span class="hx-toast-summary">{{ message().summary }}</span>
        }
        @if (message().detail) {
          <div class="hx-toast-detail">{{ message().detail }}</div>
        }
      </div>
      @if (message().closable !== false) {
        <button type="button" class="hx-toast-close" aria-label="Close" (click)="close()">
          <span class="hx-toast-close-icon" aria-hidden="true"></span>
        </button>
      }
    </div>
  `,
})
export class HxToastItem implements OnInit {
  readonly message = input.required<HxToastMessage>();
  readonly #service = inject(HxMessageService);
  readonly #destroyRef = inject(DestroyRef);
  protected readonly severity = computed(() => this.message().severity ?? 'info');
  #timer: ReturnType<typeof setTimeout> | undefined;
  #remaining = 0;
  #started = 0;

  constructor() {
    this.#destroyRef.onDestroy(() => clearTimeout(this.#timer));
  }

  ngOnInit(): void {
    const { sticky, life } = this.message();
    if (sticky) return;
    this.#remaining = life ?? 3000;
    this.#start();
  }

  #start(): void {
    clearTimeout(this.#timer);
    if (this.message().sticky) return;
    this.#started = Date.now();
    this.#timer = setTimeout(() => this.close(), this.#remaining);
  }

  protected pause(): void {
    if (this.#timer === undefined) return;
    clearTimeout(this.#timer);
    this.#timer = undefined;
    this.#remaining = Math.max(500, this.#remaining - (Date.now() - this.#started));
  }

  protected resume(): void {
    if (this.message().sticky || this.#timer !== undefined) return;
    this.#start();
  }

  protected close(): void {
    clearTimeout(this.#timer);
    this.#service.remove(this.message().id);
  }
}

/**
 * Shows the messages sent through `HxMessageService`. Put one `<hx-toast>` in the root component.
 *
 * ```html
 * <hx-toast position="top-right" />
 * <hx-toast key="form" position="bottom-center" />
 * ```
 *
 * A toast with a `key` shows only messages sent with that key; one without shows those sent without. Each message is
 * a live region (`polite` for info and success, `assertive` for warn and error). The timer of a message pauses
 * while the pointer or the focus is on it, so it is not removed while someone reads it or reaches for its close button.
 */
@Component({
  selector: 'hx-toast',
  imports: [HxToastItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-toast',
    '[class.hx-toast-top-left]': "position() === 'top-left'",
    '[class.hx-toast-top-center]': "position() === 'top-center'",
    '[class.hx-toast-top-right]': "position() === 'top-right'",
    '[class.hx-toast-center]': "position() === 'center'",
    '[class.hx-toast-bottom-left]': "position() === 'bottom-left'",
    '[class.hx-toast-bottom-center]': "position() === 'bottom-center'",
    '[class.hx-toast-bottom-right]': "position() === 'bottom-right'",
  },
  template: `
    @for (message of shown(); track message.id) {
      <hx-toast-item [message]="message" />
    }
  `,
})
export class HxToast {
  readonly #service = inject(HxMessageService);
  /** Only messages sent with this key are shown here. */
  readonly key = input<string>();
  readonly position = input<HxToastPosition>('top-right');
  protected readonly shown = computed(() =>
    this.#service.messages().filter((m) => m.key === this.key()),
  );
}
