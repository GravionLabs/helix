export const style = /*css*/ `
    .h-cascadeselect {
        display: inline-flex;
        cursor: pointer;
        position: relative;
        user-select: none;
        background: dt('cascadeselect.background');
        border: 1px solid dt('cascadeselect.border.color');
        transition:
            background dt('cascadeselect.transition.duration'),
            color dt('cascadeselect.transition.duration'),
            border-color dt('cascadeselect.transition.duration'),
            outline-color dt('cascadeselect.transition.duration'),
            box-shadow dt('cascadeselect.transition.duration');
        border-radius: dt('cascadeselect.border.radius');
        outline-color: transparent;
        box-shadow: dt('cascadeselect.shadow');
    }

    .h-cascadeselect:not(.h-disabled):hover {
        border-color: dt('cascadeselect.hover.border.color');
    }

    .h-cascadeselect:not(.h-disabled).h-focus {
        border-color: dt('cascadeselect.focus.border.color');
        box-shadow: dt('cascadeselect.focus.ring.shadow');
        outline: dt('cascadeselect.focus.ring.width') dt('cascadeselect.focus.ring.style') dt('cascadeselect.focus.ring.color');
        outline-offset: dt('cascadeselect.focus.ring.offset');
    }

    .h-cascadeselect.h-variant-filled {
        background: dt('cascadeselect.filled.background');
    }

    .h-cascadeselect.h-variant-filled:not(.h-disabled):hover {
        background: dt('cascadeselect.filled.hover.background');
    }

    .h-cascadeselect.h-variant-filled.h-focus {
        background: dt('cascadeselect.filled.focus.background');
    }

    .h-cascadeselect.h-invalid {
        border-color: dt('cascadeselect.invalid.border.color');
    }

    .h-cascadeselect.h-disabled {
        opacity: 1;
        background: dt('cascadeselect.disabled.background');
    }

    .h-cascadeselect-dropdown {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: transparent;
        color: dt('cascadeselect.dropdown.color');
        width: dt('cascadeselect.dropdown.width');
        border-start-end-radius: dt('border.radius.md');
        border-end-end-radius: dt('border.radius.md');
    }

    .h-cascadeselect-clear-icon {
        align-self: center;
        color: dt('cascadeselect.clear.icon.color');
        inset-inline-end: dt('cascadeselect.dropdown.width');
    }

    .h-cascadeselect-label {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        flex: 1 1 auto;
        width: 1%;
        text-overflow: ellipsis;
        cursor: pointer;
        padding: dt('cascadeselect.padding.y') dt('cascadeselect.padding.x');
        background: transparent;
        border: 0 none;
        outline: 0 none;
    }

    .h-cascadeselect-label.h-placeholder {
        color: dt('cascadeselect.placeholder.color');
    }

    .h-cascadeselect.h-invalid .h-cascadeselect-label.h-placeholder {
        color: dt('cascadeselect.invalid.placeholder.color');
    }

    .h-cascadeselect.h-disabled .h-cascadeselect-label {
        color: dt('cascadeselect.disabled.color');
    }

    .h-cascadeselect-label-empty {
        overflow: hidden;
        visibility: hidden;
    }

    .h-cascadeselect-overlay {
        background: dt('cascadeselect.overlay.background');
        color: dt('cascadeselect.overlay.color');
        border: 1px solid dt('cascadeselect.overlay.border.color');
        border-radius: dt('cascadeselect.overlay.border.radius');
        box-shadow: dt('cascadeselect.overlay.shadow');
    }

    .h-cascadeselect .h-cascadeselect-overlay {
        min-width: 100%;
    }

    .h-cascadeselect-option-list {
        display: none;
        min-width: 100%;
        position: absolute;
        z-index: 1;
    }

    .h-cascadeselect-list {
        min-width: 100%;
        margin: 0;
        padding: 0;
        list-style-type: none;
        padding: dt('cascadeselect.list.padding');
        display: flex;
        flex-direction: column;
        gap: dt('cascadeselect.list.gap');
    }

    .h-cascadeselect-option {
        cursor: pointer;
        font-weight: normal;
        white-space: nowrap;
        border: 0 none;
        color: dt('cascadeselect.option.color');
        background: transparent;
        border-radius: dt('cascadeselect.option.border.radius');
    }

    .h-cascadeselect-option-active {
        overflow: visible;
    }

    .h-cascadeselect-option-active > .h-cascadeselect-option-content {
        background: dt('cascadeselect.option.focus.background');
        color: dt('cascadeselect.option.focus.color');
    }

    .h-cascadeselect-option:not(.h-cascadeselect-option-selected):not(.h-disabled).h-focus > .h-cascadeselect-option-content {
        background: dt('cascadeselect.option.focus.background');
        color: dt('cascadeselect.option.focus.color');
    }

    .h-cascadeselect-option:not(.h-cascadeselect-option-selected):not(.h-disabled):hover > .h-cascadeselect-option-content {
        background: dt('cascadeselect.option.focus.background');
        color: dt('cascadeselect.option.focus.color');
    }

    .h-cascadeselect-option:not(.h-cascadeselect-option-selected):not(.h-disabled).h-focus > .h-cascadeselect-option-content > .h-cascadeselect-group-icon-container > .h-cascadeselect-group-icon {
        color: dt('cascadeselect.option.icon.focus.color');
    }

    .h-cascadeselect-option:not(.h-cascadeselect-option-selected):not(.h-disabled):hover > .h-cascadeselect-option-content > .h-cascadeselect-group-icon-container > .h-cascadeselect-group-icon {
        color: dt('cascadeselect.option.icon.focus.color');
    }

    .h-cascadeselect-option-selected > .h-cascadeselect-option-content {
        background: dt('cascadeselect.option.selected.background');
        color: dt('cascadeselect.option.selected.color');
    }

    .h-cascadeselect-option-selected.h-focus > .h-cascadeselect-option-content {
        background: dt('cascadeselect.option.selected.focus.background');
        color: dt('cascadeselect.option.selected.focus.color');
    }

    .h-cascadeselect-option-active > .h-cascadeselect-option-list {
        inset-inline-start: 100%;
        inset-block-start: 0;
    }

    .h-cascadeselect-option-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
        position: relative;
        padding: dt('cascadeselect.option.padding');
        border-radius: dt('cascadeselect.option.border.radius');
        transition:
            background dt('cascadeselect.transition.duration'),
            color dt('cascadeselect.transition.duration'),
            border-color dt('cascadeselect.transition.duration'),
            box-shadow dt('cascadeselect.transition.duration'),
            outline-color dt('cascadeselect.transition.duration');
    }

    .h-cascadeselect-group-icon {
        font-size: dt('cascadeselect.option.icon.size');
        width: dt('cascadeselect.option.icon.size');
        height: dt('cascadeselect.option.icon.size');
        color: dt('cascadeselect.option.icon.color');
    }

    .h-cascadeselect-group-icon:dir(rtl) {
        transform: rotate(180deg);
    }

    .h-cascadeselect-mobile-active .h-cascadeselect-option-list {
        position: static;
        box-shadow: none;
        border: 0 none;
        padding-inline-start: dt('tieredmenu.submenu.mobile.indent');
        padding-inline-end: 0;
    }

    .h-cascadeselect-mobile-active .h-cascadeselect-group-icon {
        transition: transform 0.2s;
        transform: rotate(90deg);
    }

    .h-cascadeselect-mobile-active .h-cascadeselect-option-active > .h-cascadeselect-option-content .h-cascadeselect-group-icon {
        transform: rotate(-90deg);
    }

    .h-cascadeselect-sm .h-cascadeselect-label {
        font-size: dt('cascadeselect.sm.font.size');
        padding-block: dt('cascadeselect.sm.padding.y');
        padding-inline: dt('cascadeselect.sm.padding.x');
    }

    .h-cascadeselect-sm .h-cascadeselect-dropdown .h-icon {
        font-size: dt('cascadeselect.sm.font.size');
        width: dt('cascadeselect.sm.font.size');
        height: dt('cascadeselect.sm.font.size');
    }

    .h-cascadeselect-lg .h-cascadeselect-label {
        font-size: dt('cascadeselect.lg.font.size');
        padding-block: dt('cascadeselect.lg.padding.y');
        padding-inline: dt('cascadeselect.lg.padding.x');
    }

    .h-cascadeselect-lg .h-cascadeselect-dropdown .h-icon {
        font-size: dt('cascadeselect.lg.font.size');
        width: dt('cascadeselect.lg.font.size');
        height: dt('cascadeselect.lg.font.size');
    }

    .h-cascadeselect-fluid {
        display: flex;
    }

    .h-cascadeselect-fluid .h-cascadeselect-label {
        width: 1%;
    }

    .h-cascadeselect-fluid .h-cascadeselect-overlay .h-cascadeselect-overlay {
         min-width: 12.5rem;
    }
`;
