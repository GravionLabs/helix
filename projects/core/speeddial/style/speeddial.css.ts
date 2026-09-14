export const style = /*css*/ `
    .h-speeddial {
        position: static;
        display: flex;
        gap: dt('speeddial.gap');
    }

    .h-speeddial-button {
        z-index: 1;
    }

    .h-speeddial-button.h-speeddial-rotate {
        transition:
            transform 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
            background dt('speeddial.transition.duration'),
            color dt('speeddial.transition.duration'),
            border-color dt('speeddial.transition.duration'),
            box-shadow dt('speeddial.transition.duration'),
            outline-color dt('speeddial.transition.duration');
        will-change: transform;
    }

    .h-speeddial-list {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: inset-block-start 0s linear dt('speeddial.transition.duration');
        pointer-events: none;
        outline: 0 none;
        z-index: 2;
        gap: dt('speeddial.gap');
    }

    .h-speeddial-item {
        transform: scale(0);
        opacity: 0;
        transition:
            transform 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
            opacity 0.8s;
        will-change: transform;
    }

    .h-speeddial-circle .h-speeddial-item,
    .h-speeddial-semi-circle .h-speeddial-item,
    .h-speeddial-quarter-circle .h-speeddial-item {
        position: absolute;
    }

    .h-speeddial-mask {
        position: absolute;
        border-radius: dt('content.border.radius');
    }

    .h-speeddial-open .h-speeddial-list {
        pointer-events: auto;
    }

    .h-speeddial-open .h-speeddial-item {
        transform: scale(1);
        opacity: 1;
    }

    .h-speeddial-open .h-speeddial-rotate {
        transform: rotate(45deg);
    }
`;
