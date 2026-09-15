export const style = /*css*/ `
    .h-checkbox {
        position: relative;
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        width: dt('checkbox.width');
        height: dt('checkbox.height');
    }

    .h-checkbox-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border: 1px solid transparent;
        border-radius: dt('checkbox.border.radius');
    }

    .h-checkbox-box {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: dt('checkbox.border.radius');
        border: 1px solid dt('checkbox.border.color');
        background: dt('checkbox.background');
        width: dt('checkbox.width');
        height: dt('checkbox.height');
        transition:
            background dt('checkbox.transition.duration'),
            color dt('checkbox.transition.duration'),
            border-color dt('checkbox.transition.duration'),
            box-shadow dt('checkbox.transition.duration'),
            outline-color dt('checkbox.transition.duration');
        outline-color: transparent;
        box-shadow: dt('checkbox.shadow');
    }

    .h-checkbox-icon {
        transition-duration: dt('checkbox.transition.duration');
        color: dt('checkbox.icon.color');
        font-size: dt('checkbox.icon.size');
        width: dt('checkbox.icon.size');
        height: dt('checkbox.icon.size');
    }

    .h-checkbox:not(.h-disabled):has(.h-checkbox-input:hover) .h-checkbox-box {
        border-color: dt('checkbox.hover.border.color');
    }

    .h-checkbox-checked .h-checkbox-box {
        border-color: dt('checkbox.checked.border.color');
        background: dt('checkbox.checked.background');
    }

    .h-checkbox-checked .h-checkbox-icon {
        color: dt('checkbox.icon.checked.color');
    }

    .h-checkbox-checked:not(.h-disabled):has(.h-checkbox-input:hover) .h-checkbox-box {
        background: dt('checkbox.checked.hover.background');
        border-color: dt('checkbox.checked.hover.border.color');
    }

    .h-checkbox-checked:not(.h-disabled):has(.h-checkbox-input:hover) .h-checkbox-icon {
        color: dt('checkbox.icon.checked.hover.color');
    }

    .h-checkbox:not(.h-disabled):has(.h-checkbox-input:focus-visible) .h-checkbox-box {
        border-color: dt('checkbox.focus.border.color');
        box-shadow: dt('checkbox.focus.ring.shadow');
        outline: dt('checkbox.focus.ring.width') dt('checkbox.focus.ring.style') dt('checkbox.focus.ring.color');
        outline-offset: dt('checkbox.focus.ring.offset');
    }

    .h-checkbox-checked:not(.h-disabled):has(.h-checkbox-input:focus-visible) .h-checkbox-box {
        border-color: dt('checkbox.checked.focus.border.color');
    }

    .h-checkbox.h-invalid > .h-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }

    .h-checkbox.h-variant-filled .h-checkbox-box {
        background: dt('checkbox.filled.background');
    }

    .h-checkbox-checked.h-variant-filled .h-checkbox-box {
        background: dt('checkbox.checked.background');
    }

    .h-checkbox-checked.h-variant-filled:not(.h-disabled):has(.h-checkbox-input:hover) .h-checkbox-box {
        background: dt('checkbox.checked.hover.background');
    }

    .h-checkbox.h-disabled {
        opacity: 1;
    }

    .h-checkbox.h-disabled .h-checkbox-box {
        background: dt('checkbox.disabled.background');
        border-color: dt('checkbox.checked.disabled.border.color');
    }

    .h-checkbox.h-disabled .h-checkbox-box .h-checkbox-icon {
        color: dt('checkbox.icon.disabled.color');
    }

    .h-checkbox-sm,
    .h-checkbox-sm .h-checkbox-box {
        width: dt('checkbox.sm.width');
        height: dt('checkbox.sm.height');
    }

    .h-checkbox-sm .h-checkbox-icon {
        font-size: dt('checkbox.icon.sm.size');
        width: dt('checkbox.icon.sm.size');
        height: dt('checkbox.icon.sm.size');
    }

    .h-checkbox-lg,
    .h-checkbox-lg .h-checkbox-box {
        width: dt('checkbox.lg.width');
        height: dt('checkbox.lg.height');
    }

    .h-checkbox-lg .h-checkbox-icon {
        font-size: dt('checkbox.icon.lg.size');
        width: dt('checkbox.icon.lg.size');
        height: dt('checkbox.icon.lg.size');
    }
`;
