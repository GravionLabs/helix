export const style = /*css*/ `
    *,
    ::before,
    ::after {
        box-sizing: border-box;
    }

    .h-collapsible-enter-active {
        animation: h-animate-collapsible-expand 0.2s ease-out;
        overflow: hidden;
    }

    .h-collapsible-leave-active {
        animation: h-animate-collapsible-collapse 0.2s ease-out;
        overflow: hidden;
    }

    @keyframes h-animate-collapsible-expand {
        from {
            grid-template-rows: 0fr;
        }
        to {
            grid-template-rows: 1fr;
        }
    }

    @keyframes h-animate-collapsible-collapse {
        from {
            grid-template-rows: 1fr;
        }
        to {
            grid-template-rows: 0fr;
        }
    }

    .h-disabled,
    .h-disabled * {
        cursor: default;
        pointer-events: none;
        user-select: none;
    }

    .h-disabled,
    .h-component:disabled {
        opacity: dt('disabled.opacity');
    }

    .pi {
        font-size: dt('icon.size');
    }

    .h-icon {
        width: dt('icon.size');
        height: dt('icon.size');
    }

    .h-overlay-mask {
        background: var(--px-mask-background, dt('mask.background'));
        color: dt('mask.color');
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .h-overlay-mask-enter-active {
        animation: h-animate-overlay-mask-enter dt('mask.transition.duration') forwards;
    }

    .h-overlay-mask-leave-active {
        animation: h-animate-overlay-mask-leave dt('mask.transition.duration') forwards;
    }

    @keyframes h-animate-overlay-mask-enter {
        from {
            background: transparent;
        }
        to {
            background: var(--px-mask-background, dt('mask.background'));
        }
    }
    @keyframes h-animate-overlay-mask-leave {
        from {
            background: var(--px-mask-background, dt('mask.background'));
        }
        to {
            background: transparent;
        }
    }

    .h-anchored-overlay-enter-active {
        animation: h-animate-anchored-overlay-enter 300ms cubic-bezier(.19,1,.22,1);
    }

    .h-anchored-overlay-leave-active {
        animation: h-animate-anchored-overlay-leave 300ms cubic-bezier(.19,1,.22,1);
    }

    @keyframes h-animate-anchored-overlay-enter {
        from {
            opacity: 0;
            transform: scale(0.93);
        }
    }

    @keyframes h-animate-anchored-overlay-leave {
        to {
            opacity: 0;
            transform: scale(0.93);
        }
    }
`;
