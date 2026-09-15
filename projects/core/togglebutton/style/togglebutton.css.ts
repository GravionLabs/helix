export const style = /*css*/ `
    .h-togglebutton {
        display: inline-flex;
        cursor: pointer;
        user-select: none;
        overflow: hidden;
        position: relative;
        color: dt('togglebutton.color');
        background: dt('togglebutton.background');
        border: 1px solid dt('togglebutton.border.color');
        padding: dt('togglebutton.padding');
        font-size: 1rem;
        font-family: inherit;
        font-feature-settings: inherit;
        transition:
            background dt('togglebutton.transition.duration'),
            color dt('togglebutton.transition.duration'),
            border-color dt('togglebutton.transition.duration'),
            outline-color dt('togglebutton.transition.duration'),
            box-shadow dt('togglebutton.transition.duration');
        border-radius: dt('togglebutton.border.radius');
        outline-color: transparent;
        font-weight: dt('togglebutton.font.weight');
    }

    .h-togglebutton-content {
        display: inline-flex;
        flex: 1 1 auto;
        align-items: center;
        justify-content: center;
        gap: dt('togglebutton.gap');
        padding: dt('togglebutton.content.padding');
        background: transparent;
        border-radius: dt('togglebutton.content.border.radius');
        transition:
            background dt('togglebutton.transition.duration'),
            color dt('togglebutton.transition.duration'),
            border-color dt('togglebutton.transition.duration'),
            outline-color dt('togglebutton.transition.duration'),
            box-shadow dt('togglebutton.transition.duration');
    }

    .h-togglebutton:not(:disabled):not(.h-togglebutton-checked):hover {
        background: dt('togglebutton.hover.background');
        color: dt('togglebutton.hover.color');
    }

    .h-togglebutton.h-togglebutton-checked {
        background: dt('togglebutton.checked.background');
        border-color: dt('togglebutton.checked.border.color');
        color: dt('togglebutton.checked.color');
    }

    .h-togglebutton-checked .h-togglebutton-content {
        background: dt('togglebutton.content.checked.background');
        box-shadow: dt('togglebutton.content.checked.shadow');
    }

    .h-togglebutton:focus-visible {
        box-shadow: dt('togglebutton.focus.ring.shadow');
        outline: dt('togglebutton.focus.ring.width') dt('togglebutton.focus.ring.style') dt('togglebutton.focus.ring.color');
        outline-offset: dt('togglebutton.focus.ring.offset');
    }

    .h-togglebutton.h-invalid {
        border-color: dt('togglebutton.invalid.border.color');
    }

    .h-togglebutton:disabled {
        opacity: 1;
        cursor: default;
        background: dt('togglebutton.disabled.background');
        border-color: dt('togglebutton.disabled.border.color');
        color: dt('togglebutton.disabled.color');
    }

    .h-togglebutton-label,
    .h-togglebutton-icon {
        position: relative;
        transition: none;
    }

    .h-togglebutton-icon {
        color: dt('togglebutton.icon.color');
    }

    .h-togglebutton:not(:disabled):not(.h-togglebutton-checked):hover .h-togglebutton-icon {
        color: dt('togglebutton.icon.hover.color');
    }

    .h-togglebutton.h-togglebutton-checked .h-togglebutton-icon {
        color: dt('togglebutton.icon.checked.color');
    }

    .h-togglebutton:disabled .h-togglebutton-icon {
        color: dt('togglebutton.icon.disabled.color');
    }

    .h-togglebutton-sm {
        padding: dt('togglebutton.sm.padding');
        font-size: dt('togglebutton.sm.font.size');
    }

    .h-togglebutton-sm .h-togglebutton-content {
        padding: dt('togglebutton.content.sm.padding');
    }

    .h-togglebutton-lg {
        padding: dt('togglebutton.lg.padding');
        font-size: dt('togglebutton.lg.font.size');
    }

    .h-togglebutton-lg .h-togglebutton-content {
        padding: dt('togglebutton.content.lg.padding');
    }

    .h-togglebutton-fluid {
        width: 100%;
    }
`;
