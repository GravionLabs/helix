export const style = /*css*/ `
    .h-carousel {
        display: flex;
        flex-direction: column;
    }

    .h-carousel-content-container {
        display: flex;
        flex-direction: column;
        overflow: auto;
    }

    .h-carousel-content {
        display: flex;
        flex-direction: row;
        gap: dt('carousel.content.gap');
    }

    .h-carousel-content:dir(rtl) {
        flex-direction: row-reverse;
    }

    .h-carousel-viewport {
        overflow: hidden;
        width: 100%;
    }

    .h-carousel-item-list {
        display: flex;
        flex-direction: row;
    }

    .h-carousel-item-list:dir(rtl) {
        flex-direction: row-reverse;
    }

    .h-carousel-prev-button,
    .h-carousel-next-button {
        align-self: center;
        flex-shrink: 0;
    }

    .h-carousel-indicator-list {
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
        padding: dt('carousel.indicator.list.padding');
        gap: dt('carousel.indicator.list.gap');
        margin: 0;
        list-style: none;
    }

    .h-carousel-indicator-button {
        display: flex;
        align-items: center;
        justify-content: center;
        background: dt('carousel.indicator.background');
        width: dt('carousel.indicator.width');
        height: dt('carousel.indicator.height');
        border: 0 none;
        transition:
            background dt('carousel.transition.duration'),
            color dt('carousel.transition.duration'),
            outline-color dt('carousel.transition.duration'),
            box-shadow dt('carousel.transition.duration');
        outline-color: transparent;
        border-radius: dt('carousel.indicator.border.radius');
        padding: 0;
        margin: 0;
        user-select: none;
        cursor: pointer;
    }

    .h-carousel-indicator-button:focus-visible {
        box-shadow: dt('carousel.indicator.focus.ring.shadow');
        outline: dt('carousel.indicator.focus.ring.width') dt('carousel.indicator.focus.ring.style') dt('carousel.indicator.focus.ring.color');
        outline-offset: dt('carousel.indicator.focus.ring.offset');
    }

    .h-carousel-indicator-button:hover {
        background: dt('carousel.indicator.hover.background');
    }

    .h-carousel-indicator-active .h-carousel-indicator-button {
        background: dt('carousel.indicator.active.background');
    }

    .h-carousel-vertical .h-carousel-content {
        flex-direction: column;
    }

    .h-carousel-vertical .h-carousel-item-list {
        flex-direction: column;
        height: 100%;
    }

    .h-items-hidden .h-carousel-item {
        visibility: hidden;
    }

    .h-items-hidden .h-carousel-item.h-carousel-item-active {
        visibility: visible;
    }
`;
