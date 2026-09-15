export const style = /*css*/ `
    .h-treeselect {
        display: inline-flex;
        cursor: pointer;
        position: relative;
        user-select: none;
        background: dt('treeselect.background');
        border: 1px solid dt('treeselect.border.color');
        transition:
            background dt('treeselect.transition.duration'),
            color dt('treeselect.transition.duration'),
            border-color dt('treeselect.transition.duration'),
            outline-color dt('treeselect.transition.duration'),
            box-shadow dt('treeselect.transition.duration');
        border-radius: dt('treeselect.border.radius');
        outline-color: transparent;
        box-shadow: dt('treeselect.shadow');
    }

    .h-treeselect:not(.h-disabled):hover {
        border-color: dt('treeselect.hover.border.color');
    }

    .h-treeselect:not(.h-disabled).h-focus {
        border-color: dt('treeselect.focus.border.color');
        box-shadow: dt('treeselect.focus.ring.shadow');
        outline: dt('treeselect.focus.ring.width') dt('treeselect.focus.ring.style') dt('treeselect.focus.ring.color');
        outline-offset: dt('treeselect.focus.ring.offset');
    }

    .h-treeselect.h-variant-filled {
        background: dt('treeselect.filled.background');
    }

    .h-treeselect.h-variant-filled:not(.h-disabled):hover {
        background: dt('treeselect.filled.hover.background');
    }

    .h-treeselect.h-variant-filled.h-focus {
        background: dt('treeselect.filled.focus.background');
    }

    .h-treeselect.h-invalid {
        border-color: dt('treeselect.invalid.border.color');
    }

    .h-treeselect.h-disabled {
        opacity: 1;
        background: dt('treeselect.disabled.background');
    }

    .h-treeselect-clear-icon {
        align-self: center;
        color: dt('treeselect.clear.icon.color');
        inset-inline-end: dt('treeselect.dropdown.width');
    }

    .h-treeselect-dropdown {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: transparent;
        color: dt('treeselect.dropdown.color');
        width: dt('treeselect.dropdown.width');
        border-start-end-radius: dt('border.radius.md');
        border-end-end-radius: dt('border.radius.md');
    }

    .h-treeselect-label-container {
        overflow: hidden;
        flex: 1 1 auto;
        cursor: pointer;
    }

    .h-treeselect-label {
        display: flex;
        align-items: center;
        gap: calc(dt('treeselect.padding.y') / 2);
        white-space: nowrap;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: dt('treeselect.padding.y') dt('treeselect.padding.x');
        color: dt('treeselect.color');
    }

    .h-treeselect-label.h-placeholder {
        color: dt('treeselect.placeholder.color');
    }

    .h-treeselect.h-invalid .h-treeselect-label.h-placeholder {
        color: dt('treeselect.invalid.placeholder.color');
    }

    .h-treeselect:has(.h-select-clear-icon) .h-treeselect-label {
        padding-inline-end: dt('treeselect.padding.x');
    }

    .h-treeselect.h-disabled .h-treeselect-label {
        color: dt('treeselect.disabled.color');
    }

    .h-treeselect-label-empty {
        overflow: hidden;
        visibility: hidden;
    }

    .h-treeselect-overlay {
        position: absolute;
        top: 0;
        left: 0;
        background: dt('treeselect.overlay.background');
        color: dt('treeselect.overlay.color');
        border: 1px solid dt('treeselect.overlay.border.color');
        border-radius: dt('treeselect.overlay.border.radius');
        box-shadow: dt('treeselect.overlay.shadow');
        overflow: hidden;
        min-width: 100%;
        will-change: transform;
    }

    .h-treeselect-tree-container {
        overflow: auto;
    }

    .h-treeselect-empty-message {
        padding: dt('treeselect.empty.message.padding');
        background: transparent;
    }

    .h-treeselect-fluid {
        display: flex;
    }

    .h-treeselect-overlay .h-tree {
        padding: dt('treeselect.tree.padding');
    }

    .h-treeselect-overlay .h-tree-loading {
        min-height: 3rem;
    }

    .h-treeselect-label .h-chip {
        padding-block-start: calc(dt('treeselect.padding.y') / 2);
        padding-block-end: calc(dt('treeselect.padding.y') / 2);
        border-radius: dt('treeselect.chip.border.radius');
    }

    .h-treeselect-label:has(.h-chip) {
        padding: calc(dt('treeselect.padding.y') / 2) calc(dt('treeselect.padding.x') / 2);
    }

    .h-treeselect-sm .h-treeselect-label {
        font-size: dt('treeselect.sm.font.size');
        padding-block: dt('treeselect.sm.padding.y');
        padding-inline: dt('treeselect.sm.padding.x');
    }

    .h-treeselect-sm .h-treeselect-dropdown .h-icon {
        font-size: dt('treeselect.sm.font.size');
        width: dt('treeselect.sm.font.size');
        height: dt('treeselect.sm.font.size');
    }

    .h-treeselect-lg .h-treeselect-label {
        font-size: dt('treeselect.lg.font.size');
        padding-block: dt('treeselect.lg.padding.y');
        padding-inline: dt('treeselect.lg.padding.x');
    }

    .h-treeselect-lg .h-treeselect-dropdown .h-icon {
        font-size: dt('treeselect.lg.font.size');
        width: dt('treeselect.lg.font.size');
        height: dt('treeselect.lg.font.size');
    }
`;
