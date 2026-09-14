export const style = /*css*/ `
    .h-contextmenu {
        background: dt('contextmenu.background');
        color: dt('contextmenu.color');
        border: 1px solid dt('contextmenu.border.color');
        border-radius: dt('contextmenu.border.radius');
        box-shadow: dt('contextmenu.shadow');
        min-width: 12.5rem;
    }

    .h-contextmenu-root-list,
    .h-contextmenu-submenu {
        margin: 0;
        padding: dt('contextmenu.list.padding');
        list-style: none;
        outline: 0 none;
        display: flex;
        flex-direction: column;
        gap: dt('contextmenu.list.gap');
    }

    .h-contextmenu-submenu {
        position: absolute;
        display: flex;
        flex-direction: column;
        min-width: 100%;
        z-index: 1;
        background: dt('contextmenu.background');
        color: dt('contextmenu.color');
        border: 1px solid dt('contextmenu.border.color');
        border-radius: dt('contextmenu.border.radius');
        box-shadow: dt('contextmenu.shadow');
    }

    .h-contextmenu-item {
        position: relative;
    }

    .h-contextmenu-item-content {
        transition:
            background dt('contextmenu.transition.duration'),
            color dt('contextmenu.transition.duration');
        border-radius: dt('contextmenu.item.border.radius');
        color: dt('contextmenu.item.color');
    }

    .h-contextmenu-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('contextmenu.item.padding');
        gap: dt('contextmenu.item.gap');
        user-select: none;
    }

    .h-contextmenu-item-label {
        line-height: 1;
    }

    .h-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.color');
    }

    .h-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.color');
        margin-left: auto;
        font-size: dt('contextmenu.submenu.icon.size');
        width: dt('contextmenu.submenu.icon.size');
        height: dt('contextmenu.submenu.icon.size');
    }

    .h-contextmenu-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .h-contextmenu-item.h-focus > .h-contextmenu-item-content {
        color: dt('contextmenu.item.focus.color');
        background: dt('contextmenu.item.focus.background');
    }

    .h-contextmenu-item.h-focus > .h-contextmenu-item-content .h-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.focus.color');
    }

    .h-contextmenu-item.h-focus > .h-contextmenu-item-content .h-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.focus.color');
    }

    .h-contextmenu-item:not(.h-disabled) > .h-contextmenu-item-content:hover {
        color: dt('contextmenu.item.focus.color');
        background: dt('contextmenu.item.focus.background');
    }

    .h-contextmenu-item:not(.h-disabled) > .h-contextmenu-item-content:hover .h-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.focus.color');
    }

    .h-contextmenu-item:not(.h-disabled) > .h-contextmenu-item-content:hover .h-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.focus.color');
    }

    .h-contextmenu-item-active > .h-contextmenu-item-content {
        color: dt('contextmenu.item.active.color');
        background: dt('contextmenu.item.active.background');
    }

    .h-contextmenu-item-active > .h-contextmenu-item-content .h-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.active.color');
    }

    .h-contextmenu-item-active > .h-contextmenu-item-content .h-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.active.color');
    }

    .h-contextmenu-separator {
        border-block-start: 1px solid dt('contextmenu.separator.border.color');
    }

    .h-contextmenu-mobile .h-contextmenu-submenu {
        position: static;
        box-shadow: none;
        border: 0 none;
        padding-inline-start: dt('tieredmenu.submenu.mobile.indent');
        padding-inline-end: 0;
    }

    .h-contextmenu-mobile .h-contextmenu-submenu-icon {
        transition: transform 0.2s;
        transform: rotate(90deg);
    }

    .h-contextmenu-mobile .h-contextmenu-item-active > .h-contextmenu-item-content .h-contextmenu-submenu-icon {
        transform: rotate(-90deg);
    }
`;
