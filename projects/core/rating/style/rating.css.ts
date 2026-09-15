export const style = /*css*/ `
    .h-rating {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: dt('rating.gap');
    }

    .h-rating-option {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        outline-color: transparent;
        border-radius: 50%;
        transition:
            background dt('rating.transition.duration'),
            color dt('rating.transition.duration'),
            border-color dt('rating.transition.duration'),
            outline-color dt('rating.transition.duration'),
            box-shadow dt('rating.transition.duration');
    }

    .h-rating-option.h-focus-visible {
        box-shadow: dt('rating.focus.ring.shadow');
        outline: dt('rating.focus.ring.width') dt('rating.focus.ring.style') dt('rating.focus.ring.color');
        outline-offset: dt('rating.focus.ring.offset');
    }

    .h-rating-icon {
        color: dt('rating.icon.color');
        transition:
            background dt('rating.transition.duration'),
            color dt('rating.transition.duration'),
            border-color dt('rating.transition.duration'),
            outline-color dt('rating.transition.duration'),
            box-shadow dt('rating.transition.duration');
        font-size: dt('rating.icon.size');
        width: dt('rating.icon.size');
        height: dt('rating.icon.size');
    }

    .h-rating:not(.h-disabled):not(.h-readonly) .h-rating-option:hover .h-rating-icon {
        color: dt('rating.icon.hover.color');
    }

    .h-rating-option-active .h-rating-icon {
        color: dt('rating.icon.active.color');
    }

    .h-rating-icon.h-invalid {
        /* @todo */
        stroke: dt('rating.invalid.icon.color');
    }

    .h-rating.h-readonly .h-rating-option {
        cursor: not-allowed;
    }
`;
