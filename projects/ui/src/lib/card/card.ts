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
  template: `
    <ng-template #titleText>{{ title() }}<ng-content select="[hxCardTitle]" /></ng-template>
    <div class="hx-card-header"><ng-content select="[hxCardHeader]" /></div>
    <div class="hx-card-body">
      <div class="hx-card-caption">
        @switch (level()) {
          @case (1) { <h1 class="hx-card-title"><ng-container [ngTemplateOutlet]="titleText" /></h1> }
          @case (2) { <h2 class="hx-card-title"><ng-container [ngTemplateOutlet]="titleText" /></h2> }
          @case (3) { <h3 class="hx-card-title"><ng-container [ngTemplateOutlet]="titleText" /></h3> }
          @case (4) { <h4 class="hx-card-title"><ng-container [ngTemplateOutlet]="titleText" /></h4> }
          @case (5) { <h5 class="hx-card-title"><ng-container [ngTemplateOutlet]="titleText" /></h5> }
          @default { <h6 class="hx-card-title"><ng-container [ngTemplateOutlet]="titleText" /></h6> }
        }
        <div class="hx-card-subtitle">{{ subtitle() }}<ng-content select="[hxCardSubtitle]" /></div>
      </div>
      <div class="hx-card-content"><ng-content /></div>
      <div class="hx-card-footer"><ng-content select="[hxCardFooter]" /></div>
    </div>
  `,
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
