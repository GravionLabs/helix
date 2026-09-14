export const style = /*css*/ `
    .h-textarea {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('textarea.color');
        background: dt('textarea.background');
        padding-block: dt('textarea.padding.y');
        padding-inline: dt('textarea.padding.x');
        border: 1px solid dt('textarea.border.color');
        transition:
            background dt('textarea.transition.duration'),
            color dt('textarea.transition.duration'),
            border-color dt('textarea.transition.duration'),
            outline-color dt('textarea.transition.duration'),
            box-shadow dt('textarea.transition.duration');
        appearance: none;
        border-radius: dt('textarea.border.radius');
        outline-color: transparent;
        box-shadow: dt('textarea.shadow');
    }

    .h-textarea:enabled:hover {
        border-color: dt('textarea.hover.border.color');
    }

    .h-textarea:enabled:focus {
        border-color: dt('textarea.focus.border.color');
        box-shadow: dt('textarea.focus.ring.shadow');
        outline: dt('textarea.focus.ring.width') dt('textarea.focus.ring.style') dt('textarea.focus.ring.color');
        outline-offset: dt('textarea.focus.ring.offset');
    }

    .h-textarea.h-invalid {
        border-color: dt('textarea.invalid.border.color');
    }

    .h-textarea.h-variant-filled {
        background: dt('textarea.filled.background');
    }

    .h-textarea.h-variant-filled:enabled:hover {
        background: dt('textarea.filled.hover.background');
    }

    .h-textarea.h-variant-filled:enabled:focus {
        background: dt('textarea.filled.focus.background');
    }

    .h-textarea:disabled {
        opacity: 1;
        background: dt('textarea.disabled.background');
        color: dt('textarea.disabled.color');
    }

    .h-textarea::placeholder {
        color: dt('textarea.placeholder.color');
    }

    .h-textarea.h-invalid::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }

    .h-textarea-fluid {
        width: 100%;
    }

    .h-textarea-resizable {
        overflow: hidden;
        resize: none;
    }

    .h-textarea-sm {
        font-size: dt('textarea.sm.font.size');
        padding-block: dt('textarea.sm.padding.y');
        padding-inline: dt('textarea.sm.padding.x');
    }

    .h-textarea-lg {
        font-size: dt('textarea.lg.font.size');
        padding-block: dt('textarea.lg.padding.y');
        padding-inline: dt('textarea.lg.padding.x');
    }
`;
