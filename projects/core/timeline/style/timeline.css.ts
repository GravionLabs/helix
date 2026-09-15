export const style = /*css*/ `
    .h-timeline {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        direction: ltr;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .h-timeline-left .h-timeline-event-opposite {
        text-align: right;
    }

    .h-timeline-left .h-timeline-event-content {
        text-align: left;
    }

    .h-timeline-right .h-timeline-event {
        flex-direction: row-reverse;
    }

    .h-timeline-right .h-timeline-event-opposite {
        text-align: left;
    }

    .h-timeline-right .h-timeline-event-content {
        text-align: right;
    }

    .h-timeline-vertical.h-timeline-alternate .h-timeline-event:nth-child(even) {
        flex-direction: row-reverse;
    }

    .h-timeline-vertical.h-timeline-alternate .h-timeline-event:nth-child(odd) .h-timeline-event-opposite {
        text-align: right;
    }

    .h-timeline-vertical.h-timeline-alternate .h-timeline-event:nth-child(odd) .h-timeline-event-content {
        text-align: left;
    }

    .h-timeline-vertical.h-timeline-alternate .h-timeline-event:nth-child(even) .h-timeline-event-opposite {
        text-align: left;
    }

    .h-timeline-vertical.h-timeline-alternate .h-timeline-event:nth-child(even) .h-timeline-event-content {
        text-align: right;
    }

    .h-timeline-vertical .h-timeline-event-opposite,
    .h-timeline-vertical .h-timeline-event-content {
        padding: dt('timeline.vertical.event.content.padding');
    }

    .h-timeline-vertical .h-timeline-event-connector {
        width: dt('timeline.event.connector.size');
    }

    .h-timeline-event {
        display: flex;
        position: relative;
        min-height: dt('timeline.event.min.height');
    }

    .h-timeline-event:last-child {
        min-height: 0;
    }

    .h-timeline-event-opposite {
        flex: 1;
    }

    .h-timeline-event-content {
        flex: 1;
    }

    .h-timeline-event-separator {
        flex: 0;
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    .h-timeline-event-marker {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        align-self: baseline;
        border-width: dt('timeline.event.marker.border.width');
        border-style: solid;
        border-color: dt('timeline.event.marker.border.color');
        border-radius: dt('timeline.event.marker.border.radius');
        width: dt('timeline.event.marker.size');
        height: dt('timeline.event.marker.size');
        background: dt('timeline.event.marker.background');
    }

    .h-timeline-event-marker::before {
        content: ' ';
        border-radius: dt('timeline.event.marker.content.border.radius');
        width: dt('timeline.event.marker.content.size');
        height: dt('timeline.event.marker.content.size');
        background: dt('timeline.event.marker.content.background');
    }

    .h-timeline-event-marker::after {
        content: ' ';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: dt('timeline.event.marker.border.radius');
        box-shadow: dt('timeline.event.marker.content.inset.shadow');
    }

    .h-timeline-event-connector {
        flex-grow: 1;
        background: dt('timeline.event.connector.color');
    }

    .h-timeline-horizontal {
        flex-direction: row;
    }

    .h-timeline-horizontal .h-timeline-event {
        flex-direction: column;
        flex: 1;
    }

    .h-timeline-horizontal .h-timeline-event:last-child {
        flex: 0;
    }

    .h-timeline-horizontal .h-timeline-event-separator {
        flex-direction: row;
    }

    .h-timeline-horizontal .h-timeline-event-connector {
        width: 100%;
        height: dt('timeline.event.connector.size');
    }

    .h-timeline-horizontal .h-timeline-event-opposite,
    .h-timeline-horizontal .h-timeline-event-content {
        padding: dt('timeline.horizontal.event.content.padding');
    }

    .h-timeline-horizontal.h-timeline-alternate .h-timeline-event:nth-child(even) {
        flex-direction: column-reverse;
    }

    .h-timeline-bottom .h-timeline-event {
        flex-direction: column-reverse;
    }
`;
