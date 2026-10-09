import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { HelixFormField } from '@gravionlabs/helix-shell';
import { HxRating } from '@gravionlabs/helix-ui';
import { HelixFieldWidgetBase } from '@gravionlabs/helix-zod';

/**
 * Custom dynamic-form widget registered under the kind `'rating'` via
 * `provideHelixDynamicForms({ widgets: [...] })`. Reads the `stars`
 * passthrough key from the field's `helixMeta`.
 */
@Component({
  selector: 'app-rating-widget',
  standalone: true,
  imports: [HxRating, HelixFormField],
  template: `
    <helix-form-field [label]="label()" [hint]="hint()" [error]="firstError()">
      <hx-rating
        [ariaLabel]="label()"
        [stars]="stars()"
        [disabled]="state().disabled()"
        [value]="state().value()"
        (valueChange)="onChange($event)"
      />
    </helix-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingWidget extends HelixFieldWidgetBase<number | null> {
  // biome-ignore lint/complexity/useLiteralKeys: `stars` is an index-signature key (TS4111)
  protected readonly stars = computed(() => (this.descriptor().meta['stars'] as number) ?? 5);

  protected onChange(value: number | null): void {
    this.state().value.set(value);
    this.state().markAsTouched();
  }
}
