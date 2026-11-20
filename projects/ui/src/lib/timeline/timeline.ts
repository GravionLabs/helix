import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  Directive,
  inject,
  input,
  TemplateRef,
} from '@angular/core';

export type HxTimelineAlign = 'left' | 'right' | 'alternate';
export type HxTimelineLayout = 'vertical' | 'horizontal';

/** What the templates of a timeline receive: the event (`let-event`) and its index (`let-index="index"`). */
export interface HxTimelineContext<T = unknown> {
  $implicit: T;
  index: number;
}

/** The content of an event: `<ng-template hxTimelineContent let-event>…</ng-template>`. */
@Directive({ selector: 'ng-template[hxTimelineContent]' })
export class HxTimelineContent {
  readonly template = inject<TemplateRef<HxTimelineContext>>(TemplateRef);
}

/** The text on the other side of the line: `<ng-template hxTimelineOpposite let-event>…</ng-template>`. */
@Directive({ selector: 'ng-template[hxTimelineOpposite]' })
export class HxTimelineOpposite {
  readonly template = inject<TemplateRef<HxTimelineContext>>(TemplateRef);
}

/** Replaces the dot on the line: `<ng-template hxTimelineMarker let-event>…</ng-template>`. */
@Directive({ selector: 'ng-template[hxTimelineMarker]' })
export class HxTimelineMarker {
  readonly template = inject<TemplateRef<HxTimelineContext>>(TemplateRef);
}

/**
 * Events along a line.
 *
 * ```html
 * <hx-timeline [value]="events" align="alternate">
 *   <ng-template hxTimelineContent let-event>{{ event.status }}</ng-template>
 *   <ng-template hxTimelineOpposite let-event>{{ event.date }}</ng-template>
 * </hx-timeline>
 * ```
 *
 * `align` (vertical): `left` puts the content right of the line and the opposite text left of it, `right` the other
 * way round, `alternate` switches with every event. Horizontal: `left` puts the content below the line, `right`
 * above it, `alternate` switches. It is an ordered list; markers are decorative (`aria-hidden`), so put whatever
 * must be read (a date, a status) in the content or opposite templates.
 */
@Component({
  selector: 'hx-timeline',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-timeline',
    '[class.hx-timeline-vertical]': "layout() === 'vertical'",
    '[class.hx-timeline-horizontal]': "layout() === 'horizontal'",
  },
  templateUrl: './timeline.html',
})
export class HxTimeline {
  /** The events; any objects, handed to the templates. */
  readonly value = input<readonly unknown[]>([]);
  readonly align = input<HxTimelineAlign>('left');
  readonly layout = input<HxTimelineLayout>('vertical');

  protected readonly content = contentChild(HxTimelineContent);
  protected readonly opposite = contentChild(HxTimelineOpposite);
  protected readonly marker = contentChild(HxTimelineMarker);

  protected reversed(index: number): boolean {
    const align = this.align();
    return align === 'right' || (align === 'alternate' && index % 2 === 1);
  }
}
