export const style = /*css*/ `
    .h-dialog {
        max-height: 90%;
        transform: scale(1);
        border-radius: dt('dialog.border.radius');
        box-shadow: dt('dialog.shadow');
        background: dt('dialog.background');
        border: 1px solid dt('dialog.border.color');
        color: dt('dialog.color');
        will-change: transform;
    }

    .h-dialog-content {
        overflow-y: auto;
        padding: dt('dialog.content.padding');
        flex-grow: 1;
    }

    .h-dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
        padding: dt('dialog.header.padding');
    }

    .h-dialog-title {
        font-weight: dt('dialog.title.font.weight');
        font-size: dt('dialog.title.font.size');
    }

    .h-dialog-footer {
        flex-shrink: 0;
        padding: dt('dialog.footer.padding');
        display: flex;
        justify-content: flex-end;
        gap: dt('dialog.footer.gap');
    }

    .h-dialog-header-actions {
        display: flex;
        align-items: center;
        gap: dt('dialog.header.gap');
    }

    .h-dialog-top .h-dialog,
    .h-dialog-bottom .h-dialog,
    .h-dialog-left .h-dialog,
    .h-dialog-right .h-dialog,
    .h-dialog-topleft .h-dialog,
    .h-dialog-topright .h-dialog,
    .h-dialog-bottomleft .h-dialog,
    .h-dialog-bottomright .h-dialog {
        margin: 1rem;
    }

    .h-dialog-maximized {
        width: 100vw !important;
        height: 100vh !important;
        top: 0px !important;
        left: 0px !important;
        max-height: 100%;
        height: 100%;
        border-radius: 0;
    }

    .h-dialog .h-resizable-handle {
        position: absolute;
        font-size: 0.1px;
        display: block;
        cursor: se-resize;
        width: 12px;
        height: 12px;
        right: 1px;
        bottom: 1px;
    }

    .h-dialog-enter-active {
        animation: h-animate-dialog-enter 300ms cubic-bezier(.19,1,.22,1);
    }

    .h-dialog-leave-active {
        animation: h-animate-dialog-leave 300ms cubic-bezier(.19,1,.22,1);
    }

    @keyframes h-animate-dialog-enter {
        from {
            opacity: 0;
            transform: scale(0.93);
        }
    }

    @keyframes h-animate-dialog-leave {
        to {
            opacity: 0;
            transform: scale(0.93);
        }
    }
`;
