import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import type { Field } from '@angular/forms/signals';
import type { HelixFieldDescriptor } from '../../model/helix-field-descriptor';
import { HelixFieldWidgetResolver } from '../../registry/field-registry';

/**
 * Dispatches one field descriptor to its registered widget component.
 *
 * Handles `hidden()` centrally: a hidden field renders nothing, per the
 * signal-forms guidance to `@if` on the hidden state.
 *
 * Imports no widget statically — composite widgets (object/array/union) import
 * this component, and built-in registrations live in
 * `provideHelixDynamicForms()`, which breaks the import cycle.
 */
@Component({
  selector: 'helix-dynamic-field',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './dynamic-field.html',
  styleUrl: './dynamic-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelixDynamicField {
  readonly field = input.required<Field<any>>();
  readonly descriptor = input.required<HelixFieldDescriptor>();

  readonly #resolver = inject(HelixFieldWidgetResolver);

  protected readonly component = computed(() => this.#resolver.resolve(this.descriptor().widget));

  protected readonly outletInputs = computed(() => ({
    field: this.field(),
    descriptor: this.descriptor(),
  }));

  protected readonly hiddenState = computed(() => this.field()().hidden());
}
