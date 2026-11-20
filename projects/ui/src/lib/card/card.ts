import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
} from '@angular/core';

/**
 * A surface for grouped content. Project a header (an image, say), a title, a subtitle, the content and a footer,
 * or use the `title` and `subtitle` inputs as a shortcut.
 *
 * ```html
 * <hx-card title="Billing" subtitle="October" [headingLevel]="3">
 *   <img hxCardHeader src="chart.png" alt="" />
 *   Total due: 120 EUR
 *   <div hxCardFooter><button hx-button>Pay</button></div>
 * </hx-card>
 * <hx-card>
 *   <span hxCardTitle>Custom title</span>
 *   <span hxCardSubtitle>Custom subtitle</span>
 *   Content
 * </hx-card>
 * ```
 *
 * The title is a heading; `headingLevel` (default 2) is the level that fits the page's outline.
 */
@Component({
  selector: 'hx-card',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-card' },
  templateUrl: './card.html',
})
export class HxCard {
  /** A shortcut for the title slot. */
  readonly title = input('');
  /** A shortcut for the subtitle slot. */
  readonly subtitle = input('');
  /** The level of the title heading, 1 to 6. */
  readonly headingLevel = input(2, { transform: numberAttribute });

  protected readonly level = computed(() =>
    Math.min(6, Math.max(1, Math.round(this.headingLevel()))),
  );
}
