export const style = /*css*/ `
    .h-inputtext {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('inputtext.color');
        background: dt('inputtext.background');
        padding-block: dt('inputtext.padding.y');
        padding-inline: dt('inputtext.padding.x');
        border: 1px solid dt('inputtext.border.color');
        transition:
            background dt('inputtext.transition.duration'),
            color dt('inputtext.transition.duration'),
            border-color dt('inputtext.transition.duration'),
            outline-color dt('inputtext.transition.duration'),
            box-shadow dt('inputtext.transition.duration');
        appearance: none;
        border-radius: dt('inputtext.border.radius');
        outline-color: transparent;
        box-shadow: dt('inputtext.shadow');
    }

    .h-inputtext:enabled:hover {
        border-color: dt('inputtext.hover.border.color');
    }

    .h-inputtext:enabled:focus {
        border-color: dt('inputtext.focus.border.color');
        box-shadow: dt('inputtext.focus.ring.shadow');
        outline: dt('inputtext.focus.ring.width') dt('inputtext.focus.ring.style') dt('inputtext.focus.ring.color');
        outline-offset: dt('inputtext.focus.ring.offset');
    }

    .h-inputtext.h-invalid {
        border-color: dt('inputtext.invalid.border.color');
    }

    .h-inputtext.h-variant-filled {
        background: dt('inputtext.filled.background');
    }

    .h-inputtext.h-variant-filled:enabled:hover {
        background: dt('inputtext.filled.hover.background');
    }

    .h-inputtext.h-variant-filled:enabled:focus {
        background: dt('inputtext.filled.focus.background');
    }

    .h-inputtext:disabled {
        opacity: 1;
        background: dt('inputtext.disabled.background');
        color: dt('inputtext.disabled.color');
    }

    .h-inputtext::placeholder {
        color: dt('inputtext.placeholder.color');
    }

    .h-inputtext.h-invalid::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }

    .h-inputtext-sm {
        font-size: dt('inputtext.sm.font.size');
        padding-block: dt('inputtext.sm.padding.y');
        padding-inline: dt('inputtext.sm.padding.x');
    }

    .h-inputtext-lg {
        font-size: dt('inputtext.lg.font.size');
        padding-block: dt('inputtext.lg.padding.y');
        padding-inline: dt('inputtext.lg.padding.x');
    }

    .h-inputtext-fluid {
        width: 100%;
    }
`;
