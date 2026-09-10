import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Injector,
  inject,
  input,
  output,
  signal,
  untracked,
  type WritableSignal,
} from '@angular/core';
import { form, submit } from '@angular/forms/signals';
import type { z } from 'zod';
import type { HelixFieldDescriptor } from '../../model/helix-field-descriptor';
import { buildHelixSchema } from '../../schema/signal-schema-builder';
import { buildDefaultValue } from '../../schema/zod-defaults';
import { zodToFieldDescriptors } from '../../schema/zod-field-walker';
import { HelixDynamicField } from '../dynamic-field/dynamic-field';

/**
 * Renders a complete signal form from an annotated Zod object schema.
 *
 * - Validation: root-level `validateStandardSchema` — Zod issues are routed to
 *   the matching fields.
 * - Model: pass your own `WritableSignal` via `model`, or let the component
 *   derive an initial value from the schema (`buildDefaultValue`).
 * - Swapping the `schema` input recreates the form and resets its state.
 * - `submitted` emits the **parsed** (`schema.parse`) value on valid submit.
 *
 * Requires `provideHelixDynamicForms()` in the injector chain.
 */
@Component({
  selector: 'helix-dynamic-form',
  standalone: true,
  imports: [HelixDynamicField],
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelixDynamicForm<T extends Record<string, unknown> = Record<string, unknown>> {
  readonly schema = input.required<z.ZodObject>();
  /** Optional external model — omit to derive the initial value from the schema. */
  readonly model = input<WritableSignal<T>>();
  readonly submitLabel = input('Submit');
  readonly showSubmit = input(true);

  readonly submitted = output<T>();

  readonly #injector = inject(Injector);

  protected readonly descriptors = computed(() => zodToFieldDescriptors(this.schema()));

  readonly #model = computed<WritableSignal<T>>(
    () => this.model() ?? signal(buildDefaultValue(this.schema() as unknown as z.ZodType) as T),
  );

  /** The form's `FieldTree` — recreated (state reset) when the schema changes. */
  readonly formTree = computed(() => {
    const model = this.#model();
    const schema = this.schema();
    const root = this.descriptors();
    return untracked(() =>
      form(model, buildHelixSchema<T>(schema, root), { injector: this.#injector }),
    );
  });

  protected childField(descriptor: HelixFieldDescriptor): any {
    return (this.formTree() as any)[descriptor.key];
  }

  protected async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.formTree(), async (tree) => {
      this.submitted.emit(this.schema().parse(tree().value()) as T);
      return undefined;
    });
  }
}
