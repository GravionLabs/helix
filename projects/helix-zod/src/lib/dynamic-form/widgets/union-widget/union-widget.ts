import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { HelixFormField } from '@gravionlabs/helix';
import { HelixDynamicField } from '../../components/dynamic-field/dynamic-field';
import { buildDefaultValue } from '../../schema/zod-defaults';
import { HelixFieldWidgetBase } from '../widget-base';

/**
 * Built-in widget for `z.discriminatedUnion()` fields: a discriminator select
 * plus the active variant's fields.
 *
 * Switching the discriminator **resets** the union value to the new variant's
 * default (preserving the discriminator) — mandatory so the model always
 * matches the active variant's shape and all field paths exist.
 */
@Component({
  selector: 'helix-union-widget',
  standalone: true,
  imports: [HelixDynamicField, HelixFormField],
  templateUrl: './union-widget.html',
  styleUrl: './union-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelixUnionWidget extends HelixFieldWidgetBase<Record<string, unknown>> {
  protected readonly discriminator = computed(() => this.descriptor().union?.discriminator ?? '');

  protected readonly tags = computed(() => [...(this.descriptor().union?.variants.keys() ?? [])]);

  protected readonly activeTag = computed(
    () => (this.state().value() as Record<string, unknown> | undefined)?.[this.discriminator()],
  );

  protected readonly variantChildren = computed(() => {
    const variant = this.descriptor().union?.variants.get(this.activeTag() as string);
    return (variant?.children ?? []).filter((c) => c.key !== this.discriminator());
  });

  protected childField(key: string): any {
    return (this.field() as any)[key];
  }

  protected onTagChange(event: Event): void {
    const index = Number.parseInt((event.target as HTMLSelectElement).value, 10);
    const tag = this.tags()[index];
    const variant = this.descriptor().union?.variants.get(tag);
    if (variant === undefined || tag === this.activeTag()) return;

    const next = buildDefaultValue(variant.zodSource) as Record<string, unknown>;
    next[this.discriminator()] = tag;
    this.state().value.set(next);
  }
}
