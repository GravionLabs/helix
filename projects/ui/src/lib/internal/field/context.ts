import { InjectionToken, type Signal } from '@angular/core';

/**
 * What an `hx-field` hands to a composite control inside it: the control binds these to its own focusable
 * element. Native controls get the same as DOM attributes from the field and do not need it.
 */
export interface HxFieldContext {
  /** The host element of the control the field wires; another control inside the field ignores the context. */
  readonly control: Signal<Element | null>;
  /** The id for the focusable element, unless the control was given one. */
  readonly controlId: string;
  /** The ids of the hint and error texts that are shown. */
  readonly describedBy: Signal<string | null>;
  /** Whether the control shows as invalid; `null` when the field knows nothing about it. */
  readonly invalid: Signal<boolean | null>;
  readonly isRequired: Signal<boolean>;
}

export const HX_FIELD = new InjectionToken<HxFieldContext>('HX_FIELD');
