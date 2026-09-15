export const style = /*css*/ `
    .h-tieredmenu {
        background: dt('tieredmenu.background');
        color: dt('tieredmenu.color');
        border: 1px solid dt('tieredmenu.border.color');
        border-radius: dt('tieredmenu.border.radius');
        min-width: 12.5rem;
    }
    

    .h-tieredmenu-root-list,
    .h-tieredmenu-submenu {
        margin: 0;
        padding: dt('tieredmenu.list.padding');
        list-style: none;
        outline: 0 none;
        display: flex;
        flex-direction: column;
        gap: dt('tieredmenu.list.gap');
    }

    .h-tieredmenu-submenu {
        position: absolute;
        min-width: 100%;
        z-index: 1;
        background: dt('tieredmenu.background');
        color: dt('tieredmenu.color');
        border: 1px solid dt('tieredmenu.border.color');
        border-radius: dt('tieredmenu.border.radius');
        box-shadow: dt('tieredmenu.shadow');
    }

    .h-tieredmenu-item {
        position: relative;
    }

    .h-tieredmenu-item-content {
        transition:
            background dt('tieredmenu.transition.duration'),
            color dt('tieredmenu.transition.duration');
        border-radius: dt('tieredmenu.item.border.radius');
        color: dt('tieredmenu.item.color');
    }

    .h-tieredmenu-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('tieredmenu.item.padding');
        gap: dt('tieredmenu.item.gap');
        user-select: none;
        outline: 0 none;
    }

    .h-tieredmenu-item-label {
        line-height: 1;
    }

    .h-tieredmenu-item-icon {
        color: dt('tieredmenu.item.icon.color');
    }

    .h-tieredmenu-submenu-icon {
        color: dt('tieredmenu.submenu.icon.color');
        margin-left: auto;
        font-size: dt('tieredmenu.submenu.icon.size');
        width: dt('tieredmenu.submenu.icon.size');
        height: dt('tieredmenu.submenu.icon.size');
    }

    .h-tieredmenu-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .h-tieredmenu-item.h-focus > .h-tieredmenu-item-content {
        color: dt('tieredmenu.item.focus.color');
        background: dt('tieredmenu.item.focus.background');
    }

    .h-tieredmenu-item.h-focus > .h-tieredmenu-item-content .h-tieredmenu-item-icon {
        color: dt('tieredmenu.item.icon.focus.color');
    }

    .h-tieredmenu-item.h-focus > .h-tieredmenu-item-content .h-tieredmenu-submenu-icon {
        color: dt('tieredmenu.submenu.icon.focus.color');
    }

    .h-tieredmenu-item:not(.h-disabled) > .h-tieredmenu-item-content:hover {
        color: dt('tieredmenu.item.focus.color');
        background: dt('tieredmenu.item.focus.background');
    }

    .h-tieredmenu-item:not(.h-disabled) > .h-tieredmenu-item-content:hover .h-tieredmenu-item-icon {
        color: dt('tieredmenu.item.icon.focus.color');
    }

    .h-tieredmenu-item:not(.h-disabled) > .h-tieredmenu-item-content:hover .h-tieredmenu-submenu-icon {
        color: dt('tieredmenu.submenu.icon.focus.color');
    }

    .h-tieredmenu-item-active > .h-tieredmenu-item-content {
        color: dt('tieredmenu.item.active.color');
        background: dt('tieredmenu.item.active.background');
    }

    .h-tieredmenu-item-active > .h-tieredmenu-item-content .h-tieredmenu-item-icon {
        color: dt('tieredmenu.item.icon.active.color');
    }

    .h-tieredmenu-item-active > .h-tieredmenu-item-content .h-tieredmenu-submenu-icon {
        color: dt('tieredmenu.submenu.icon.active.color');
    }

    .h-tieredmenu-separator {
        border-block-start: 1px solid dt('tieredmenu.separator.border.color');
    }

    .h-tieredmenu-overlay {
        box-shadow: dt('tieredmenu.shadow');
        will-change: transform;
    }

    .h-tieredmenu-mobile .h-tieredmenu-submenu {
        position: static;
        box-shadow: none;
        border: 0 none;
        padding-inline-start: dt('tieredmenu.submenu.mobile.indent');
        padding-inline-end: 0;
    }

    .h-tieredmenu-mobile .h-tieredmenu-submenu:dir(rtl) {
        padding-inline-start: 0;
        padding-inline-end: dt('tieredmenu.submenu.mobile.indent');
    }

    .h-tieredmenu-mobile .h-tieredmenu-submenu-icon {
        transition: transform 0.2s;
        transform: rotate(90deg);
    }

    .h-tieredmenu-mobile .h-tieredmenu-item-active > .h-tieredmenu-item-content .h-tieredmenu-submenu-icon {
        transform: rotate(-90deg);
    }
`;
