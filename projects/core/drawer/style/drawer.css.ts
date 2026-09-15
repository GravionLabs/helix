export const style = /*css*/ `
    .h-drawer {
        display: flex;
        flex-direction: column;
        transform: translate3d(0px, 0px, 0px);
        position: relative;
        transition: transform 0.3s;
        background: dt('drawer.background');
        color: dt('drawer.color');
        border-style: solid;
        border-color: dt('drawer.border.color');
        box-shadow: dt('drawer.shadow');
    }

    .h-drawer-content {
        overflow-y: auto;
        flex-grow: 1;
        padding: dt('drawer.content.padding');
    }

    .h-drawer-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
        padding: dt('drawer.header.padding');
    }

    .h-drawer-footer {
        padding: dt('drawer.footer.padding');
    }

    .h-drawer-title {
        font-weight: dt('drawer.title.font.weight');
        font-size: dt('drawer.title.font.size');
    }

    .h-drawer-full .h-drawer {
        transition: none;
        transform: none;
        width: 100vw !important;
        height: 100vh !important;
        max-height: 100%;
        top: 0px !important;
        left: 0px !important;
        border-width: 1px;
    }

    .h-drawer-left .h-drawer-enter-active {
        animation: h-animate-drawer-enter-left 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .h-drawer-left .h-drawer-leave-active {
        animation: h-animate-drawer-leave-left 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }

    .h-drawer-right .h-drawer-enter-active {
        animation: h-animate-drawer-enter-right 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .h-drawer-right .h-drawer-leave-active {
        animation: h-animate-drawer-leave-right 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }

    .h-drawer-top .h-drawer-enter-active {
        animation: h-animate-drawer-enter-top 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .h-drawer-top .h-drawer-leave-active {
        animation: h-animate-drawer-leave-top 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }

    .h-drawer-bottom .h-drawer-enter-active {
        animation: h-animate-drawer-enter-bottom 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .h-drawer-bottom .h-drawer-leave-active {
        animation: h-animate-drawer-leave-bottom 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }

    .h-drawer-full .h-drawer-enter-active {
        animation: h-animate-drawer-enter-full 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .h-drawer-full .h-drawer-leave-active {
        animation: h-animate-drawer-leave-full 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    
    .h-drawer-left .h-drawer {
        width: 20rem;
        height: 100%;
        border-inline-end-width: 1px;
    }

    .h-drawer-right .h-drawer {
        width: 20rem;
        height: 100%;
        border-inline-start-width: 1px;
    }

    .h-drawer-top .h-drawer {
        height: 10rem;
        width: 100%;
        border-block-end-width: 1px;
    }

    .h-drawer-bottom .h-drawer {
        height: 10rem;
        width: 100%;
        border-block-start-width: 1px;
    }

    .h-drawer-left .h-drawer-content,
    .h-drawer-right .h-drawer-content,
    .h-drawer-top .h-drawer-content,
    .h-drawer-bottom .h-drawer-content {
        width: 100%;
        height: 100%;
    }

    .h-drawer-open {
        display: flex;
    }

    .h-drawer-mask:dir(rtl) {
        flex-direction: row-reverse;
    }

    @keyframes h-animate-drawer-enter-left {
        from {
            transform: translate3d(-100%, 0px, 0px);
        }
    }

    @keyframes h-animate-drawer-leave-left {
        to {
            transform: translate3d(-100%, 0px, 0px);
        }
    }

    @keyframes h-animate-drawer-enter-right {
        from {
            transform: translate3d(100%, 0px, 0px);
        }
    }

    @keyframes h-animate-drawer-leave-right {
        to {
            transform: translate3d(100%, 0px, 0px);
        }
    }

    @keyframes h-animate-drawer-enter-top {
        from {
            transform: translate3d(0px, -100%, 0px);
        }
    }

    @keyframes h-animate-drawer-leave-top {
        to {
            transform: translate3d(0px, -100%, 0px);
        }
    }

    @keyframes h-animate-drawer-enter-bottom {
        from {
            transform: translate3d(0px, 100%, 0px);
        }
    }

    @keyframes h-animate-drawer-leave-bottom {
        to {
            transform: translate3d(0px, 100%, 0px);
        }
    }

    @keyframes h-animate-drawer-enter-full {
        from {
            opacity: 0;
            transform: scale(0.93);
        }
    }

    @keyframes h-animate-drawer-leave-full {
        to {
            opacity: 0;
            transform: scale(0.93);
        }
    }
`;
