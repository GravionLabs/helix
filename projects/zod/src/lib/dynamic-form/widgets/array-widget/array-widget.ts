import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { HelixDynamicField } from '../../components/dynamic-field/dynamic-field';
import { buildDefaultValue } from '../../schema/zod-defaults';
import { HelixFieldWidgetBase } from '../widget-base';

/** Built-in widget for `z.array()` fields — item list with add/remove. */
@Component({
  selector: 'helix-array-widget',
  standalone: true,
  imports: [HelixDynamicField],
  templateUrl: './array-widget.html',
  styleUrl: './array-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelixArrayWidget extends HelixFieldWidgetBase<unknown[]> {
  protected readonly itemFields = computed(() => {
    const length = (this.state().value() ?? []).length;
    return Array.from({ length }, (_, index) => (this.field() as any)[index]);
  });

  protected readonly addLabel = computed(() => this.descriptor().meta.addLabel ?? 'Add');
  protected readonly removeLabel = computed(() => this.descriptor().meta.removeLabel ?? 'Remove');

  protected add(): void {
    const item = this.descriptor().itemDescriptor;
    if (!item) return;
    const value = buildDefaultValue(item.zodSource);
    this.state().value.update((current) => [...(current ?? []), value]);
  }

  protected removeAt(index: number): void {
    this.state().value.update((current) => (current ?? []).filter((_, i) => i !== index));
  }
}
