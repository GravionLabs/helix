export const style = /*css*/ `
    .h-message {
        display: grid;
        grid-template-rows: 1fr;
        border-radius: dt('message.border.radius');
        outline-width: dt('message.border.width');
        outline-style: solid;
    }

    .h-message-content-wrapper {
        min-height: 0;
    }

    .h-message-content {
        display: flex;
        align-items: center;
        padding: dt('message.content.padding');
        gap: dt('message.content.gap');
    }

    .h-message-icon {
        flex-shrink: 0;
    }

    .h-message-close-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-inline-start: auto;
        overflow: hidden;
        position: relative;
        width: dt('message.close.button.width');
        height: dt('message.close.button.height');
        border-radius: dt('message.close.button.border.radius');
        background: transparent;
        transition:
            background dt('message.transition.duration'),
            color dt('message.transition.duration'),
            outline-color dt('message.transition.duration'),
            box-shadow dt('message.transition.duration'),
            opacity 0.3s;
        outline-color: transparent;
        color: inherit;
        padding: 0;
        border: none;
        cursor: pointer;
        user-select: none;
    }

    .h-message-close-icon {
        font-size: dt('message.close.icon.size');
        width: dt('message.close.icon.size');
        height: dt('message.close.icon.size');
    }

    .h-message-close-button:focus-visible {
        outline-width: dt('message.close.button.focus.ring.width');
        outline-style: dt('message.close.button.focus.ring.style');
        outline-offset: dt('message.close.button.focus.ring.offset');
    }

    .h-message-info {
        background: dt('message.info.background');
        outline-color: dt('message.info.border.color');
        color: dt('message.info.color');
        box-shadow: dt('message.info.shadow');
    }

    .h-message-info .h-message-close-button:focus-visible {
        outline-color: dt('message.info.close.button.focus.ring.color');
        box-shadow: dt('message.info.close.button.focus.ring.shadow');
    }

    .h-message-info .h-message-close-button:hover {
        background: dt('message.info.close.button.hover.background');
    }

    .h-message-info.h-message-outlined {
        color: dt('message.info.outlined.color');
        outline-color: dt('message.info.outlined.border.color');
    }

    .h-message-info.h-message-simple {
        color: dt('message.info.simple.color');
    }

    .h-message-success {
        background: dt('message.success.background');
        outline-color: dt('message.success.border.color');
        color: dt('message.success.color');
        box-shadow: dt('message.success.shadow');
    }

    .h-message-success .h-message-close-button:focus-visible {
        outline-color: dt('message.success.close.button.focus.ring.color');
        box-shadow: dt('message.success.close.button.focus.ring.shadow');
    }

    .h-message-success .h-message-close-button:hover {
        background: dt('message.success.close.button.hover.background');
    }

    .h-message-success.h-message-outlined {
        color: dt('message.success.outlined.color');
        outline-color: dt('message.success.outlined.border.color');
    }

    .h-message-success.h-message-simple {
        color: dt('message.success.simple.color');
    }

    .h-message-warn {
        background: dt('message.warn.background');
        outline-color: dt('message.warn.border.color');
        color: dt('message.warn.color');
        box-shadow: dt('message.warn.shadow');
    }

    .h-message-warn .h-message-close-button:focus-visible {
        outline-color: dt('message.warn.close.button.focus.ring.color');
        box-shadow: dt('message.warn.close.button.focus.ring.shadow');
    }

    .h-message-warn .h-message-close-button:hover {
        background: dt('message.warn.close.button.hover.background');
    }

    .h-message-warn.h-message-outlined {
        color: dt('message.warn.outlined.color');
        outline-color: dt('message.warn.outlined.border.color');
    }

    .h-message-warn.h-message-simple {
        color: dt('message.warn.simple.color');
    }

    .h-message-error {
        background: dt('message.error.background');
        outline-color: dt('message.error.border.color');
        color: dt('message.error.color');
        box-shadow: dt('message.error.shadow');
    }

    .h-message-error .h-message-close-button:focus-visible {
        outline-color: dt('message.error.close.button.focus.ring.color');
        box-shadow: dt('message.error.close.button.focus.ring.shadow');
    }

    .h-message-error .h-message-close-button:hover {
        background: dt('message.error.close.button.hover.background');
    }

    .h-message-error.h-message-outlined {
        color: dt('message.error.outlined.color');
        outline-color: dt('message.error.outlined.border.color');
    }

    .h-message-error.h-message-simple {
        color: dt('message.error.simple.color');
    }

    .h-message-secondary {
        background: dt('message.secondary.background');
        outline-color: dt('message.secondary.border.color');
        color: dt('message.secondary.color');
        box-shadow: dt('message.secondary.shadow');
    }

    .h-message-secondary .h-message-close-button:focus-visible {
        outline-color: dt('message.secondary.close.button.focus.ring.color');
        box-shadow: dt('message.secondary.close.button.focus.ring.shadow');
    }

    .h-message-secondary .h-message-close-button:hover {
        background: dt('message.secondary.close.button.hover.background');
    }

    .h-message-secondary.h-message-outlined {
        color: dt('message.secondary.outlined.color');
        outline-color: dt('message.secondary.outlined.border.color');
    }

    .h-message-secondary.h-message-simple {
        color: dt('message.secondary.simple.color');
    }

    .h-message-contrast {
        background: dt('message.contrast.background');
        outline-color: dt('message.contrast.border.color');
        color: dt('message.contrast.color');
        box-shadow: dt('message.contrast.shadow');
    }

    .h-message-contrast .h-message-close-button:focus-visible {
        outline-color: dt('message.contrast.close.button.focus.ring.color');
        box-shadow: dt('message.contrast.close.button.focus.ring.shadow');
    }

    .h-message-contrast .h-message-close-button:hover {
        background: dt('message.contrast.close.button.hover.background');
    }

    .h-message-contrast.h-message-outlined {
        color: dt('message.contrast.outlined.color');
        outline-color: dt('message.contrast.outlined.border.color');
    }

    .h-message-contrast.h-message-simple {
        color: dt('message.contrast.simple.color');
    }

    .h-message-text {
        font-size: dt('message.text.font.size');
        font-weight: dt('message.text.font.weight');
    }

    .h-message-icon {
        font-size: dt('message.icon.size');
        width: dt('message.icon.size');
        height: dt('message.icon.size');
    }

    .h-message-sm .h-message-content {
        padding: dt('message.content.sm.padding');
    }

    .h-message-sm .h-message-text {
        font-size: dt('message.text.sm.font.size');
    }

    .h-message-sm .h-message-icon {
        font-size: dt('message.icon.sm.size');
        width: dt('message.icon.sm.size');
        height: dt('message.icon.sm.size');
    }

    .h-message-sm .h-message-close-icon {
        font-size: dt('message.close.icon.sm.size');
        width: dt('message.close.icon.sm.size');
        height: dt('message.close.icon.sm.size');
    }

    .h-message-lg .h-message-content {
        padding: dt('message.content.lg.padding');
    }

    .h-message-lg .h-message-text {
        font-size: dt('message.text.lg.font.size');
    }

    .h-message-lg .h-message-icon {
        font-size: dt('message.icon.lg.size');
        width: dt('message.icon.lg.size');
        height: dt('message.icon.lg.size');
    }

    .h-message-lg .h-message-close-icon {
        font-size: dt('message.close.icon.lg.size');
        width: dt('message.close.icon.lg.size');
        height: dt('message.close.icon.lg.size');
    }

    .h-message-outlined {
        background: transparent;
        outline-width: dt('message.outlined.border.width');
    }

    .h-message-simple {
        background: transparent;
        outline-color: transparent;
        box-shadow: none;
    }

    .h-message-simple .h-message-content {
        padding: dt('message.simple.content.padding');
    }

    .h-message-outlined .h-message-close-button:hover,
    .h-message-simple .h-message-close-button:hover {
        background: transparent;
    }

    .h-message-enter-active {
        animation: h-animate-message-enter 0.3s ease-out forwards;
        overflow: hidden;
    }

    .h-message-leave-active {
        animation: h-animate-message-leave 0.15s ease-in forwards;
        overflow: hidden;
    }

    @keyframes h-animate-message-enter {
        from {
            opacity: 0;
            grid-template-rows: 0fr;
        }
        to {
            opacity: 1;
            grid-template-rows: 1fr;
        }
    }

    @keyframes h-animate-message-leave {
        from {
            opacity: 1;
            grid-template-rows: 1fr;
        }
        to {
            opacity: 0;
            margin: 0;
            grid-template-rows: 0fr;
        }
    }
`;
