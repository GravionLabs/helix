export const style = /*css*/ `
    .h-radiobutton {
        position: relative;
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        width: dt('radiobutton.width');
        height: dt('radiobutton.height');
    }

    .h-radiobutton-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border: 1px solid transparent;
        border-radius: 50%;
    }

    .h-radiobutton-box {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        border: 1px solid dt('radiobutton.border.color');
        background: dt('radiobutton.background');
        width: dt('radiobutton.width');
        height: dt('radiobutton.height');
        transition:
            background dt('radiobutton.transition.duration'),
            color dt('radiobutton.transition.duration'),
            border-color dt('radiobutton.transition.duration'),
            box-shadow dt('radiobutton.transition.duration'),
            outline-color dt('radiobutton.transition.duration');
        outline-color: transparent;
        box-shadow: dt('radiobutton.shadow');
    }

    .h-radiobutton-icon {
        transition-duration: dt('radiobutton.transition.duration');
        background: transparent;
        font-size: dt('radiobutton.icon.size');
        width: dt('radiobutton.icon.size');
        height: dt('radiobutton.icon.size');
        border-radius: 50%;
        backface-visibility: hidden;
        transform: translateZ(0) scale(0.1);
    }

    .h-radiobutton:not(.h-disabled):has(.h-radiobutton-input:hover) .h-radiobutton-box {
        border-color: dt('radiobutton.hover.border.color');
    }

    .h-radiobutton-checked .h-radiobutton-box {
        border-color: dt('radiobutton.checked.border.color');
        background: dt('radiobutton.checked.background');
    }

    .h-radiobutton-checked .h-radiobutton-box .h-radiobutton-icon {
        background: dt('radiobutton.icon.checked.color');
        transform: translateZ(0) scale(1, 1);
        visibility: visible;
    }

    .h-radiobutton-checked:not(.h-disabled):has(.h-radiobutton-input:hover) .h-radiobutton-box {
        border-color: dt('radiobutton.checked.hover.border.color');
        background: dt('radiobutton.checked.hover.background');
    }

    .h-radiobutton:not(.h-disabled):has(.h-radiobutton-input:hover).h-radiobutton-checked .h-radiobutton-box .h-radiobutton-icon {
        background: dt('radiobutton.icon.checked.hover.color');
    }

    .h-radiobutton:not(.h-disabled):has(.h-radiobutton-input:focus-visible) .h-radiobutton-box {
        border-color: dt('radiobutton.focus.border.color');
        box-shadow: dt('radiobutton.focus.ring.shadow');
        outline: dt('radiobutton.focus.ring.width') dt('radiobutton.focus.ring.style') dt('radiobutton.focus.ring.color');
        outline-offset: dt('radiobutton.focus.ring.offset');
    }

    .h-radiobutton-checked:not(.h-disabled):has(.h-radiobutton-input:focus-visible) .h-radiobutton-box {
        border-color: dt('radiobutton.checked.focus.border.color');
    }

    .h-radiobutton.h-invalid > .h-radiobutton-box {
        border-color: dt('radiobutton.invalid.border.color');
    }

    .h-radiobutton.h-variant-filled .h-radiobutton-box {
        background: dt('radiobutton.filled.background');
    }

    .h-radiobutton.h-variant-filled.h-radiobutton-checked .h-radiobutton-box {
        background: dt('radiobutton.checked.background');
    }

    .h-radiobutton.h-variant-filled:not(.h-disabled):has(.h-radiobutton-input:hover).h-radiobutton-checked .h-radiobutton-box {
        background: dt('radiobutton.checked.hover.background');
    }

    .h-radiobutton.h-disabled {
        opacity: 1;
    }

    .h-radiobutton.h-disabled .h-radiobutton-box {
        background: dt('radiobutton.disabled.background');
        border-color: dt('radiobutton.checked.disabled.border.color');
    }

    .h-radiobutton-checked.h-disabled .h-radiobutton-box .h-radiobutton-icon {
        background: dt('radiobutton.icon.disabled.color');
    }

    .h-radiobutton-sm,
    .h-radiobutton-sm .h-radiobutton-box {
        width: dt('radiobutton.sm.width');
        height: dt('radiobutton.sm.height');
    }

    .h-radiobutton-sm .h-radiobutton-icon {
        font-size: dt('radiobutton.icon.sm.size');
        width: dt('radiobutton.icon.sm.size');
        height: dt('radiobutton.icon.sm.size');
    }

    .h-radiobutton-lg,
    .h-radiobutton-lg .h-radiobutton-box {
        width: dt('radiobutton.lg.width');
        height: dt('radiobutton.lg.height');
    }

    .h-radiobutton-lg .h-radiobutton-icon {
        font-size: dt('radiobutton.icon.lg.size');
        width: dt('radiobutton.icon.lg.size');
        height: dt('radiobutton.icon.lg.size');
    }
`;
