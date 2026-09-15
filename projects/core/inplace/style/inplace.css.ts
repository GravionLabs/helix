export const style = /*css*/ `
    .h-inplace-display {
        display: inline-block;
        cursor: pointer;
        border: 1px solid transparent;
        padding: dt('inplace.padding');
        border-radius: dt('inplace.border.radius');
        transition:
            background dt('inplace.transition.duration'),
            color dt('inplace.transition.duration'),
            outline-color dt('inplace.transition.duration'),
            box-shadow dt('inplace.transition.duration');
        outline-color: transparent;
    }

    .h-inplace-display:not(.h-disabled):hover {
        background: dt('inplace.display.hover.background');
        color: dt('inplace.display.hover.color');
    }

    .h-inplace-display:focus-visible {
        box-shadow: dt('inplace.focus.ring.shadow');
        outline: dt('inplace.focus.ring.width') dt('inplace.focus.ring.style') dt('inplace.focus.ring.color');
        outline-offset: dt('inplace.focus.ring.offset');
    }

    .h-inplace-content {
        display: block;
    }
`;
