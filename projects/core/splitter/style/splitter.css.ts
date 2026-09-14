export const style = /*css*/ `
    .h-splitter {
        display: flex;
        flex-wrap: nowrap;
        border: 1px solid dt('splitter.border.color');
        background: dt('splitter.background');
        border-radius: dt('border.radius.md');
        color: dt('splitter.color');
    }

    .h-splitter-vertical {
        flex-direction: column;
    }

    .h-splitter-gutter {
        flex-grow: 0;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        background: dt('splitter.gutter.background');
    }

    .h-splitter-gutter-handle {
        border-radius: dt('splitter.handle.border.radius');
        background: dt('splitter.handle.background');
        transition:
            outline-color dt('splitter.transition.duration'),
            box-shadow dt('splitter.transition.duration');
        outline-color: transparent;
    }

    .h-splitter-gutter-handle:focus-visible {
        box-shadow: dt('splitter.handle.focus.ring.shadow');
        outline: dt('splitter.handle.focus.ring.width') dt('splitter.handle.focus.ring.style') dt('splitter.handle.focus.ring.color');
        outline-offset: dt('splitter.handle.focus.ring.offset');
    }

    .h-splitter-horizontal.h-splitter-resizing {
        cursor: col-resize;
        user-select: none;
    }

    .h-splitter-vertical.h-splitter-resizing {
        cursor: row-resize;
        user-select: none;
    }

    .h-splitter-horizontal > .h-splitter-gutter > .h-splitter-gutter-handle {
        height: dt('splitter.handle.size');
        width: 100%;
    }

    .h-splitter-vertical > .h-splitter-gutter > .h-splitter-gutter-handle {
        width: dt('splitter.handle.size');
        height: 100%;
    }

    .h-splitter-horizontal > .h-splitter-gutter {
        cursor: col-resize;
    }

    .h-splitter-vertical > .h-splitter-gutter {
        cursor: row-resize;
    }

    .h-splitterpanel {
        flex-grow: 1;
        overflow: hidden;
    }

    .h-splitterpanel-nested {
        display: flex;
    }

    .h-splitterpanel .h-splitter {
        flex-grow: 1;
        min-width: 0;
        min-height: 0;
        border: 0 none;
    }
`;
