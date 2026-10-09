import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  numberAttribute,
  output,
  signal,
  untracked,
} from '@angular/core';

export type HxMessageSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';
export type HxMessageVariant = 'filled' | 'outlined' | 'simple';
export type HxMessageSize = 'small' | 'medium' | 'large';

/**
 * An inline message next to the content it is about.
 *
 * ```html
 * <hx-message severity="error" closable (close)="onClose()">The card was declined.</hx-message>
 * <hx-message severity="info" variant="outlined" icon="pi pi-star" [life]="5000">Saved</hx-message>
 * ```
 *
 * The message is a live region: `role="status"`, and `role="alert"` for `error`. `closable` adds a close button
 * (`closeLabel` is its name); `life` hides the message after that many milliseconds. Both emit `(close)`.
 */
@Component({
  selector: 'hx-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-message',
    '[class.hx-message-success]': "severity() === 'success'",
    '[class.hx-message-info]': "severity() === 'info'",
    '[class.hx-message-warn]': "severity() === 'warn'",
    '[class.hx-message-error]': "severity() === 'error'",
    '[class.hx-message-secondary]': "severity() === 'secondary'",
    '[class.hx-message-contrast]': "severity() === 'contrast'",
    '[class.hx-message-outlined]': "variant() === 'outlined'",
    '[class.hx-message-simple]': "variant() === 'simple'",
    '[class.hx-message-sm]': "size() === 'small'",
    '[class.hx-message-lg]': "size() === 'large'",
    '[attr.role]': "severity() === 'error' ? 'alert' : 'status'",
    '[hidden]': '!visible()',
  },
  template: `
    <div class="hx-message-content">
      @if (icon()) {
        <i class="hx-message-icon-custom" [class]="icon()" aria-hidden="true"></i>
      } @else {
        <span class="hx-message-icon" aria-hidden="true"></span>
      }
      <span class="hx-message-text"><ng-content /></span>
      @if (closable()) {
        <button type="button" class="hx-message-close" [attr.aria-label]="closeLabel()" (click)="dismiss()">
          <span class="hx-message-close-icon" aria-hidden="true"></span>
        </button>
      }
    </div>
  `,
})
export class HxMessage {
  readonly severity = input<HxMessageSeverity>('info');
  readonly variant = input<HxMessageVariant>('filled');
  readonly size = input<HxMessageSize>('medium');
  /** Icon classes (for example `pi pi-star`) instead of the built-in icon of the severity. */
  readonly icon = input('');
  /** Shows a close button. */
  readonly closable = input(false, { transform: booleanAttribute });
  readonly closeLabel = input('Close');
  /** Milliseconds until the message hides itself; `0` keeps it. */
  readonly life = input(0, { transform: numberAttribute });

  /** The message was closed by the button or by `life`. */
  readonly close = output<void>();

  protected readonly visible = signal(true);

  constructor() {
    const destroyRef = inject(DestroyRef);
    effect((onCleanup) => {
      const life = this.life();
      if (life > 0) {
        const timer = setTimeout(() => untracked(() => this.dismiss()), life);
        onCleanup(() => clearTimeout(timer));
      }
    });
    destroyRef.onDestroy(() => this.visible.set(false));
  }

  protected dismiss(): void {
    if (!this.visible()) return;
    this.visible.set(false);
    this.close.emit();
  }
}
