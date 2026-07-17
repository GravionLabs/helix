import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, inject, InjectionToken, NgModule, TemplateRef, ViewEncapsulation, input, contentChild, contentChildren } from '@angular/core';
import { BlockableUI, PrimeTemplate, SharedModule } from '@gravionlabs/helix/api';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind } from '@gravionlabs/helix/bind';
import { Nullable } from '@gravionlabs/helix/ts-helpers';
import { TimelineItemTemplateContext, TimelinePassThrough } from '@gravionlabs/helix/types/timeline';
import { TimelineStyle } from './style/timelinestyle';

const TIMELINE_INSTANCE = new InjectionToken<Timeline>('TIMELINE_INSTANCE');

/**
 * Timeline visualizes a series of chained events.
 * @group Components
 */
@Component({
    selector: 'h-timeline',
    standalone: true,
    imports: [CommonModule, SharedModule, Bind],
    templateUrl: './timeline.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [TimelineStyle, { provide: TIMELINE_INSTANCE, useExisting: Timeline }, { provide: PARENT_INSTANCE, useExisting: Timeline }],
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[attr.data-p]': 'dataP'
    },
    hostDirectives: [Bind]
})
export class Timeline extends BaseComponent<TimelinePassThrough> implements BlockableUI {
    componentName = 'Timeline';

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcTimeline: Timeline | undefined = inject(TIMELINE_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }
    /**
     * An array of events to display.
     * @group Props
     */
    readonly value = input<any[]>();
    /**
     * Style class of the component.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    readonly styleClass = input<string>();
    /**
     * Position of the timeline bar relative to the content. Valid values are "left", "right" for vertical layout and "top", "bottom" for horizontal layout.
     * @group Props
     */
    readonly align = input<string>('left');
    /**
     * Orientation of the timeline.
     * @group Props
     */
    readonly layout = input<'vertical' | 'horizontal'>('vertical');
    /**
     * Custom content template.
     * @param {TimelineItemTemplateContext} context - item context.
     * @see {@link TimelineItemTemplateContext}
     * @group Templates
     */
    readonly contentTemplate = contentChild<Nullable<TemplateRef<TimelineItemTemplateContext>>>('content', { descendants: false });

    /**
     * Custom opposite item template.
     * @param {TimelineItemTemplateContext} context - item context.
     * @see {@link TimelineItemTemplateContext}
     * @group Templates
     */
    readonly oppositeTemplate = contentChild<Nullable<TemplateRef<TimelineItemTemplateContext>>>('opposite', { descendants: false });

    /**
     * Custom marker template.
     * @param {TimelineItemTemplateContext} context - item context.
     * @see {@link TimelineItemTemplateContext}
     * @group Templates
     */
    @ContentChild('marker', { descendants: false }) markerTemplate: Nullable<TemplateRef<TimelineItemTemplateContext>>;

    readonly templates = contentChildren(PrimeTemplate);

    _contentTemplate: TemplateRef<TimelineItemTemplateContext> | undefined;

    _oppositeTemplate: TemplateRef<TimelineItemTemplateContext> | undefined;

    _markerTemplate: TemplateRef<TimelineItemTemplateContext> | undefined;

    _componentStyle = inject(TimelineStyle);

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }

    onAfterContentInit() {
        this.templates().forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this._contentTemplate = item.template;
                    break;

                case 'opposite':
                    this._oppositeTemplate = item.template;
                    break;

                case 'marker':
                    this._markerTemplate = item.template;
                    break;
            }
        });
    }

    get dataP() {
        return this.cn({
            [this.layout()]: this.layout(),
            [this.align()]: this.align()
        });
    }
}

@NgModule({
    imports: [Timeline, SharedModule],
    exports: [Timeline, SharedModule]
})
export class TimelineModule {}
