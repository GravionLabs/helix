import { Injectable, InjectionToken, inject, type Type } from '@angular/core';
import type { HelixErrorMessageResolver } from '../errors/helix-signal-errors';
import type { HelixWidgetKind } from '../model/helix-field-meta';

// Declared by Angular's build toolchain — true in development, false in production.
declare const ngDevMode: boolean | undefined;

/** Registers a widget component for a {@link HelixWidgetKind}. */
export interface HelixFieldWidgetRegistration {
  widget: HelixWidgetKind;
  /** Component with `field` and `descriptor` inputs (see `HelixFieldWidgetBase`). */
  component: Type<unknown>;
}

/**
 * Multi-provider token holding widget registrations. Later registrations win,
 * so consumer widgets registered after the built-ins override them.
 */
export const HELIX_DYNAMIC_FIELD_WIDGETS = new InjectionToken<
  readonly HelixFieldWidgetRegistration[][]
>('HELIX_DYNAMIC_FIELD_WIDGETS');

/** Optional app-level error message resolver used by all built-in widgets. */
export const HELIX_ERROR_MESSAGE_RESOLVER = new InjectionToken<HelixErrorMessageResolver>(
  'HELIX_ERROR_MESSAGE_RESOLVER',
);

/** Resolves the widget component registered for a widget kind. */
@Injectable({ providedIn: 'root' })
export class HelixFieldWidgetResolver {
  readonly #registrations = inject(HELIX_DYNAMIC_FIELD_WIDGETS, { optional: true }) ?? [];

  resolve(widget: HelixWidgetKind): Type<unknown> {
    const flat = this.#registrations.flat();
    for (let i = flat.length - 1; i >= 0; i--) {
      if (flat[i].widget === widget) return flat[i].component;
    }
    throw new Error(
      `[HelixFieldWidgetResolver] No widget registered for kind "${widget}". ` +
        (typeof ngDevMode !== 'undefined' && ngDevMode
          ? `Did you forget provideHelixDynamicForms() or a custom { widgets: [...] } registration?`
          : ''),
    );
  }
}
