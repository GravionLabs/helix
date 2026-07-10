import { computed, Directive, inject, input } from '@angular/core';
import type { Field, FieldState } from '@angular/forms/signals';
import { helixFirstErrorMessage } from '../errors/helix-signal-errors';
import type { HelixFieldDescriptor } from '../model/helix-field-descriptor';
import { HELIX_ERROR_MESSAGE_RESOLVER } from '../registry/field-registry';

/**
 * Base class for dynamic-form widgets. A widget is a standalone component with
 * the two inputs below; `HelixDynamicField` instantiates it via
 * `NgComponentOutlet` and feeds them in.
 */
@Directive()
export abstract class HelixFieldWidgetBase<T = any> {
  readonly field = input.required<Field<T>>();
  readonly descriptor = input.required<HelixFieldDescriptor>();

  readonly #errorResolver = inject(HELIX_ERROR_MESSAGE_RESOLVER, { optional: true });

  protected readonly state = computed<FieldState<T>>(() => this.field()());

  /** Touched-gated first error message — mirrors `HelixFormField.activeError`. */
  protected readonly firstError = computed<string | null>(() => {
    const state = this.state();
    if (!state.touched()) return null;
    return helixFirstErrorMessage(state.errors(), {
      value: state.value(),
      resolver: this.#errorResolver ?? undefined,
    });
  });

  protected readonly label = computed(
    () => this.descriptor().meta.label ?? humanize(this.descriptor().key),
  );
  protected readonly hint = computed(() => this.descriptor().meta.hint);
  protected readonly placeholder = computed(() => this.descriptor().meta.placeholder ?? '');
}

/** `firstName` → `First name` — fallback label when meta provides none. */
function humanize(key: string): string {
  if (!key) return '';
  const words = key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}
