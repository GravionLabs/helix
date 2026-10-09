import { Injectable, signal } from '@angular/core';

export type HxToastSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';

/** What to show: the arguments of `HxMessageService.add`. */
export interface HxToastMessageInput {
  severity?: HxToastSeverity;
  summary?: string;
  detail?: string;
  /** Milliseconds until the toast goes away (default 3000). */
  life?: number;
  /** Stays until the user closes it. */
  sticky?: boolean;
  /** Shows a close button (default `true`). */
  closable?: boolean;
  /** Only a `<hx-toast key="…">` with the same key shows it. */
  key?: string;
}

export interface HxToastMessage extends HxToastMessageInput {
  readonly id: number;
}

/**
 * Sends short messages to the `<hx-toast>` components of the app.
 *
 * ```ts
 * readonly messages = inject(HxMessageService);
 * this.messages.add({ severity: 'success', summary: 'Saved', detail: 'The order was saved.' });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class HxMessageService {
  #nextId = 1;
  readonly #messages = signal<readonly HxToastMessage[]>([]);

  /** The messages that are showing. */
  readonly messages = this.#messages.asReadonly();

  /** Shows a message and returns its id. */
  add(message: HxToastMessageInput): number {
    const id = this.#nextId++;
    this.#messages.update((all) => [...all, { ...message, id }]);
    return id;
  }

  addAll(messages: readonly HxToastMessageInput[]): number[] {
    return messages.map((m) => this.add(m));
  }

  /** Removes one message. */
  remove(id: number): void {
    this.#messages.update((all) => all.filter((m) => m.id !== id));
  }

  /** Removes all messages, or only those sent with `key`. */
  clear(key?: string): void {
    this.#messages.update((all) => (key === undefined ? [] : all.filter((m) => m.key !== key)));
  }
}
