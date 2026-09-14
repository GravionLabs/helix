import { Injectable } from '@angular/core';
import { style } from './timeline.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => ['h-timeline h-component', 'h-timeline-' + instance.align, 'h-timeline-' + instance.layout],
    event: 'h-timeline-event',
    eventOpposite: 'h-timeline-event-opposite',
    eventSeparator: 'h-timeline-event-separator',
    eventMarker: 'h-timeline-event-marker',
    eventConnector: 'h-timeline-event-connector',
    eventContent: 'h-timeline-event-content'
};

@Injectable()
export class TimelineStyle extends BaseStyle {
    name = 'timeline';

    style = style;

    classes = classes;
}

/**
 *
 * Timeline visualizes a series of chained events.
 *
 * [Live Demo](https://primeng.org/timeline)
 *
 * @module timelinestyle
 *
 */
export enum TimelineClasses {
    /**
     * Class name of the root element
     */
    root = 'h-timeline',
    /**
     * Class name of the event element
     */
    event = 'h-timeline-event',
    /**
     * Class name of the event opposite element
     */
    eventOpposite = 'h-timeline-event-opposite',
    /**
     * Class name of the event separator element
     */
    eventSeparator = 'h-timeline-event-separator',
    /**
     * Class name of the event marker element
     */
    eventMarker = 'h-timeline-event-marker',
    /**
     * Class name of the event connector element
     */
    eventConnector = 'h-timeline-event-connector',
    /**
     * Class name of the event content element
     */
    eventContent = 'h-timeline-event-content'
}

export interface TimelineStyle extends BaseStyle {}
