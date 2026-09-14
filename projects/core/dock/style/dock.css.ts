export const style = /*css*/ `
    .h-dock {
        position: absolute;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
    }

    .h-dock-list-container {
        display: flex;
        pointer-events: auto;
        background: dt('dock.background');
        border: 1px solid dt('dock.border.color');
        padding: dt('dock.padding');
        border-radius: dt('dock.border.radius');
    }

    .h-dock-list {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: 0 none;
    }

    .h-dock-item {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform;
        padding: dt('dock.item.padding');
        border-radius: dt('dock.item.border.radius');
    }

    .h-dock-item.h-focus {
        box-shadow: dt('dock.item.focus.ring.shadow');
        outline: dt('dock.item.focus.ring.width') dt('dock.item.focus.ring.style') dt('dock.item.focus.ring.color');
        outline-offset: dt('dock.item.focus.ring.offset');
    }

    .h-dock-item-link {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        cursor: default;
        width: dt('dock.item.size');
        height: dt('dock.item.size');
    }

    .h-dock-top {
        left: 0;
        top: 0;
        width: 100%;
    }

    .h-dock-bottom {
        left: 0;
        bottom: 0;
        width: 100%;
    }

    .h-dock-right {
        right: 0;
        top: 0;
        height: 100%;
    }

    .h-dock-right .h-dock-list {
        flex-direction: column;
    }

    .h-dock-left {
        left: 0;
        top: 0;
        height: 100%;
    }

    .h-dock-left .h-dock-list {
        flex-direction: column;
    }

    .h-dock-mobile.h-dock-top .h-dock-list-container,
    .h-dock-mobile.h-dock-bottom .h-dock-list-container {
        overflow-x: auto;
        width: 100%;
    }

    .h-dock-mobile.h-dock-top .h-dock-list-container .h-dock-list,
    .h-dock-mobile.h-dock-bottom .h-dock-list-container .h-dock-list {
        margin: 0 auto;
    }

    .h-dock-mobile.h-dock-left .h-dock-list-container,
    .h-dock-mobile.h-dock-right .h-dock-list-container {
        overflow-y: auto;
        height: 100%;
    }

    .h-dock-mobile.h-dock-left .h-dock-list-container .h-dock-list,
    .h-dock-mobile.h-dock-right .h-dock-list-container .h-dock-list {
        margin: auto 0;
    }

    .h-dock-mobile .h-dock-list .h-dock-item {
        transform: none;
        margin: 0;
    }
`;
