export const style = /*css*/ `
    .h-image-mask {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .h-image-preview {
        position: relative;
        display: inline-flex;
        line-height: 0;
    }

    .h-image-preview-mask {
        position: absolute;
        inset-inline-start: 0;
        inset-block-start: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        border: 0 none;
        padding: 0;
        cursor: pointer;
        background: transparent;
        color: dt('image.preview.mask.color');
        transition: background dt('image.transition.duration');
    }

    .h-image-preview:hover > .h-image-preview-mask,
    .h-image-preview-mask:focus-visible {
        opacity: 1;
        cursor: pointer;
        background: dt('image.preview.mask.background');
        outline: 0 none;
    }

    .h-image-preview-icon {
        font-size: dt('image.preview.icon.size');
        width: dt('image.preview.icon.size');
        height: dt('image.preview.icon.size');
    }

    .h-image-toolbar {
        position: absolute;
        inset-block-start: dt('image.toolbar.position.top');
        inset-inline-end: dt('image.toolbar.position.right');
        inset-inline-start: dt('image.toolbar.position.left');
        inset-block-end: dt('image.toolbar.position.bottom');
        display: flex;
        z-index: 1;
        padding: dt('image.toolbar.padding');
        background: dt('image.toolbar.background');
        backdrop-filter: blur(dt('image.toolbar.blur'));
        border-color: dt('image.toolbar.border.color');
        border-style: solid;
        border-width: dt('image.toolbar.border.width');
        border-radius: dt('image.toolbar.border.radius');
        gap: dt('image.toolbar.gap');
    }

    .h-image-action {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        color: dt('image.action.color');
        background: transparent;
        width: dt('image.action.size');
        height: dt('image.action.size');
        margin: 0;
        padding: 0;
        border: 0 none;
        cursor: pointer;
        user-select: none;
        border-radius: dt('image.action.border.radius');
        outline-color: transparent;
        transition:
            background dt('image.transition.duration'),
            color dt('image.transition.duration'),
            outline-color dt('image.transition.duration'),
            box-shadow dt('image.transition.duration');
    }

    .h-image-action:hover {
        color: dt('image.action.hover.color');
        background: dt('image.action.hover.background');
    }

    .h-image-action:focus-visible {
        box-shadow: dt('image.action.focus.ring.shadow');
        outline: dt('image.action.focus.ring.width') dt('image.action.focus.ring.style') dt('image.action.focus.ring.color');
        outline-offset: dt('image.action.focus.ring.offset');
    }

    .h-image-action .h-icon {
        font-size: dt('image.action.icon.size');
        width: dt('image.action.icon.size');
        height: dt('image.action.icon.size');
    }

    .h-image-action.h-disabled {
        pointer-events: auto;
    }

    .h-image-original {
        max-width: 100vw;
        max-height: 100vh;
        transition: transform 300ms;
    }

    .h-image-original-enter-active {
        animation: h-animate-image-original-enter 300ms cubic-bezier(.19,1,.22,1);
    }

    .h-image-original-leave-active {
        animation: h-animate-image-original-leave 300ms cubic-bezier(.19,1,.22,1);
    }

    @keyframes h-animate-image-original-enter {
        from {
            opacity: 0;
            transform: scale(0.93);
        }
    }

    @keyframes h-animate-image-original-leave {
        to {
            opacity: 0;
            transform: scale(0.93);
        }
    }
`;
