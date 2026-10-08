import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type HxDividerLayout = 'horizontal' | 'vertical';
export type HxDividerType = 'solid' | 'dashed' | 'dotted';
export type HxDividerAlign = 'start' | 'center' | 'end';

/**
 * A line between content; the projected content is a label sitting on the line.
 *
 * ```html
 * <hx-divider />
 * <hx-divider align="center">or</hx-divider>
 * <hx-divider layout="vertical" />
 * ```
 */
@Component({
  selector: 'hx-divider',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-divider',
    role: 'separator',
    '[attr.aria-orientation]': 'layout()',
    '[class.hx-divider-horizontal]': "layout() === 'horizontal'",
    '[class.hx-divider-vertical]': "layout() === 'vertical'",
    '[class.hx-divider-dashed]': "type() === 'dashed'",
    '[class.hx-divider-dotted]': "type() === 'dotted'",
    '[class.hx-divider-start]': "align() === 'start'",
    '[class.hx-divider-center]': "align() === 'center'",
    '[class.hx-divider-end]': "align() === 'end'",
  },
})
export class HxDivider {
  readonly layout = input<HxDividerLayout>('horizontal');
  readonly type = input<HxDividerType>('solid');
  /** Where the label sits on the line (start, center, end); without a label it has no effect. */
  readonly align = input<HxDividerAlign>();
}
