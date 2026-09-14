export const style = /*css*/ `
    .h-toast {
        width: dt('toast.width');
        white-space: pre-line;
        word-break: break-word;
    }

    .h-toast-message {
        margin: 0 0 1rem 0;
        display: grid;
        grid-template-rows: 1fr;
    }

    .h-toast-message-icon {
        flex-shrink: 0;
        font-size: dt('toast.icon.size');
        width: dt('toast.icon.size');
        height: dt('toast.icon.size');
    }

    .h-toast-message-content {
        display: flex;
        align-items: flex-start;
        padding: dt('toast.content.padding');
        gap: dt('toast.content.gap');
        min-height: 0;
        overflow: hidden;
        transition: padding 250ms ease-in;
    }

    .h-toast-message-text {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        gap: dt('toast.text.gap');
    }

    .h-toast-summary {
        font-weight: dt('toast.summary.font.weight');
        font-size: dt('toast.summary.font.size');
    }

    .h-toast-detail {
        font-weight: dt('toast.detail.font.weight');
        font-size: dt('toast.detail.font.size');
    }

    .h-toast-close-button {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        background: transparent;
        transition:
            background dt('toast.transition.duration'),
            color dt('toast.transition.duration'),
            outline-color dt('toast.transition.duration'),
            box-shadow dt('toast.transition.duration');
        outline-color: transparent;
        color: inherit;
        width: dt('toast.close.button.width');
        height: dt('toast.close.button.height');
        border-radius: dt('toast.close.button.border.radius');
        margin: -25% 0 0 0;
        right: -25%;
        padding: 0;
        border: none;
        user-select: none;
    }

    .h-toast-close-button:dir(rtl) {
        margin: -25% 0 0 auto;
        left: -25%;
        right: auto;
    }

    .h-toast-message-info,
    .h-toast-message-success,
    .h-toast-message-warn,
    .h-toast-message-error,
    .h-toast-message-secondary,
    .h-toast-message-contrast {
        border-width: dt('toast.border.width');
        border-style: solid;
        backdrop-filter: blur(dt('toast.blur'));
        border-radius: dt('toast.border.radius');
    }

    .h-toast-close-icon {
        font-size: dt('toast.close.icon.size');
        width: dt('toast.close.icon.size');
        height: dt('toast.close.icon.size');
    }

    .h-toast-close-button:focus-visible {
        outline-width: dt('focus.ring.width');
        outline-style: dt('focus.ring.style');
        outline-offset: dt('focus.ring.offset');
    }

    .h-toast-message-info {
        background: dt('toast.info.background');
        border-color: dt('toast.info.border.color');
        color: dt('toast.info.color');
        box-shadow: dt('toast.info.shadow');
    }

    .h-toast-message-info .h-toast-detail {
        color: dt('toast.info.detail.color');
    }

    .h-toast-message-info .h-toast-close-button:focus-visible {
        outline-color: dt('toast.info.close.button.focus.ring.color');
        box-shadow: dt('toast.info.close.button.focus.ring.shadow');
    }

    .h-toast-message-info .h-toast-close-button:hover {
        background: dt('toast.info.close.button.hover.background');
    }

    .h-toast-message-success {
        background: dt('toast.success.background');
        border-color: dt('toast.success.border.color');
        color: dt('toast.success.color');
        box-shadow: dt('toast.success.shadow');
    }

    .h-toast-message-success .h-toast-detail {
        color: dt('toast.success.detail.color');
    }

    .h-toast-message-success .h-toast-close-button:focus-visible {
        outline-color: dt('toast.success.close.button.focus.ring.color');
        box-shadow: dt('toast.success.close.button.focus.ring.shadow');
    }

    .h-toast-message-success .h-toast-close-button:hover {
        background: dt('toast.success.close.button.hover.background');
    }

    .h-toast-message-warn {
        background: dt('toast.warn.background');
        border-color: dt('toast.warn.border.color');
        color: dt('toast.warn.color');
        box-shadow: dt('toast.warn.shadow');
    }

    .h-toast-message-warn .h-toast-detail {
        color: dt('toast.warn.detail.color');
    }

    .h-toast-message-warn .h-toast-close-button:focus-visible {
        outline-color: dt('toast.warn.close.button.focus.ring.color');
        box-shadow: dt('toast.warn.close.button.focus.ring.shadow');
    }

    .h-toast-message-warn .h-toast-close-button:hover {
        background: dt('toast.warn.close.button.hover.background');
    }

    .h-toast-message-error {
        background: dt('toast.error.background');
        border-color: dt('toast.error.border.color');
        color: dt('toast.error.color');
        box-shadow: dt('toast.error.shadow');
    }

    .h-toast-message-error .h-toast-detail {
        color: dt('toast.error.detail.color');
    }

    .h-toast-message-error .h-toast-close-button:focus-visible {
        outline-color: dt('toast.error.close.button.focus.ring.color');
        box-shadow: dt('toast.error.close.button.focus.ring.shadow');
    }

    .h-toast-message-error .h-toast-close-button:hover {
        background: dt('toast.error.close.button.hover.background');
    }

    .h-toast-message-secondary {
        background: dt('toast.secondary.background');
        border-color: dt('toast.secondary.border.color');
        color: dt('toast.secondary.color');
        box-shadow: dt('toast.secondary.shadow');
    }

    .h-toast-message-secondary .h-toast-detail {
        color: dt('toast.secondary.detail.color');
    }

    .h-toast-message-secondary .h-toast-close-button:focus-visible {
        outline-color: dt('toast.secondary.close.button.focus.ring.color');
        box-shadow: dt('toast.secondary.close.button.focus.ring.shadow');
    }

    .h-toast-message-secondary .h-toast-close-button:hover {
        background: dt('toast.secondary.close.button.hover.background');
    }

    .h-toast-message-contrast {
        background: dt('toast.contrast.background');
        border-color: dt('toast.contrast.border.color');
        color: dt('toast.contrast.color');
        box-shadow: dt('toast.contrast.shadow');
    }
    
    .h-toast-message-contrast .h-toast-detail {
        color: dt('toast.contrast.detail.color');
    }

    .h-toast-message-contrast .h-toast-close-button:focus-visible {
        outline-color: dt('toast.contrast.close.button.focus.ring.color');
        box-shadow: dt('toast.contrast.close.button.focus.ring.shadow');
    }

    .h-toast-message-contrast .h-toast-close-button:hover {
        background: dt('toast.contrast.close.button.hover.background');
    }

    .h-toast-top-center {
        transform: translateX(-50%);
    }

    .h-toast-bottom-center {
        transform: translateX(-50%);
    }

    .h-toast-center {
        min-width: 20vw;
        transform: translate(-50%, -50%);
    }

    .h-toast-message-enter-active {
        animation: h-animate-toast-enter 300ms ease-out;
    }

    .h-toast-message-leave-active {
        animation: h-animate-toast-leave 250ms ease-in;
    }

    .h-toast-message-leave-to .h-toast-message-content {
        padding-top: 0;
        padding-bottom: 0;
    }

    @keyframes h-animate-toast-enter {
        from {
            opacity: 0;
            transform: scale(0.6);
        }
        to {
            opacity: 1;
            grid-template-rows: 1fr;
        }
    }

     @keyframes h-animate-toast-leave {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
            margin-bottom: 0;
            grid-template-rows: 0fr;
            transform: translateY(-100%) scale(0.6);
        }
    }
`;
