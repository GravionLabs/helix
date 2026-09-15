export const style = /*css*/ `
    .h-panelmenu {
        display: flex;
        flex-direction: column;
        gap: dt('panelmenu.gap');
    }

    .h-panelmenu-panel {
        background: dt('panelmenu.panel.background');
        border-width: dt('panelmenu.panel.border.width');
        border-style: solid;
        border-color: dt('panelmenu.panel.border.color');
        color: dt('panelmenu.panel.color');
        border-radius: dt('panelmenu.panel.border.radius');
        padding: dt('panelmenu.panel.padding');
    }

    .h-panelmenu-panel:first-child {
        border-width: dt('panelmenu.panel.first.border.width');
        border-start-start-radius: dt('panelmenu.panel.first.top.border.radius');
        border-start-end-radius: dt('panelmenu.panel.first.top.border.radius');
    }

    .h-panelmenu-panel:last-child {
        border-width: dt('panelmenu.panel.last.border.width');
        border-end-start-radius: dt('panelmenu.panel.last.bottom.border.radius');
        border-end-end-radius: dt('panelmenu.panel.last.bottom.border.radius');
    }

    .h-panelmenu-header {
        outline: 0 none;
    }

    .h-panelmenu-header-content {
        border-radius: dt('panelmenu.item.border.radius');
        transition:
            background dt('panelmenu.transition.duration'),
            color dt('panelmenu.transition.duration'),
            outline-color dt('panelmenu.transition.duration'),
            box-shadow dt('panelmenu.transition.duration');
        outline-color: transparent;
        color: dt('panelmenu.item.color');
    }

    .h-panelmenu-header-link {
        display: flex;
        gap: dt('panelmenu.item.gap');
        padding: dt('panelmenu.item.padding');
        align-items: center;
        user-select: none;
        cursor: pointer;
        position: relative;
        text-decoration: none;
        color: inherit;
    }

    .h-panelmenu-header-icon,
    .h-panelmenu-item-icon {
        color: dt('panelmenu.item.icon.color');
    }

    .h-panelmenu-submenu-icon {
        color: dt('panelmenu.submenu.icon.color');
    }

    .h-panelmenu-submenu-icon:dir(rtl) {
        transform: rotate(180deg);
    }

    .h-panelmenu-header:not(.h-disabled):focus-visible .h-panelmenu-header-content {
        background: dt('panelmenu.item.focus.background');
        color: dt('panelmenu.item.focus.color');
    }

    .h-panelmenu-header:not(.h-disabled):focus-visible .h-panelmenu-header-content .h-panelmenu-header-icon {
        color: dt('panelmenu.item.icon.focus.color');
    }

    .h-panelmenu-header:not(.h-disabled):focus-visible .h-panelmenu-header-content .h-panelmenu-submenu-icon {
        color: dt('panelmenu.submenu.icon.focus.color');
    }

    .h-panelmenu-header:not(.h-disabled) .h-panelmenu-header-content:hover {
        background: dt('panelmenu.item.focus.background');
        color: dt('panelmenu.item.focus.color');
    }

    .h-panelmenu-header:not(.h-disabled) .h-panelmenu-header-content:hover .h-panelmenu-header-icon {
        color: dt('panelmenu.item.icon.focus.color');
    }

    .h-panelmenu-header:not(.h-disabled) .h-panelmenu-header-content:hover .h-panelmenu-submenu-icon {
        color: dt('panelmenu.submenu.icon.focus.color');
    }

    .h-panelmenu-submenu {
        margin: 0;
        padding: 0 0 0 dt('panelmenu.submenu.indent');
        outline: 0;
        list-style: none;
    }

    .h-panelmenu-submenu:dir(rtl) {
        padding: 0 dt('panelmenu.submenu.indent') 0 0;
    }

    .h-panelmenu-item-link {
        display: flex;
        gap: dt('panelmenu.item.gap');
        padding: dt('panelmenu.item.padding');
        align-items: center;
        user-select: none;
        cursor: pointer;
        text-decoration: none;
        color: inherit;
        position: relative;
        overflow: hidden;
    }

    .h-panelmenu-item-label {
        line-height: 1;
    }

    .h-panelmenu-item-content {
        border-radius: dt('panelmenu.item.border.radius');
        transition:
            background dt('panelmenu.transition.duration'),
            color dt('panelmenu.transition.duration'),
            outline-color dt('panelmenu.transition.duration'),
            box-shadow dt('panelmenu.transition.duration');
        color: dt('panelmenu.item.color');
        outline-color: transparent;
    }

    .h-panelmenu-item.h-focus > .h-panelmenu-item-content {
        background: dt('panelmenu.item.focus.background');
        color: dt('panelmenu.item.focus.color');
    }

    .h-panelmenu-item.h-focus > .h-panelmenu-item-content .h-panelmenu-item-icon {
        color: dt('panelmenu.item.focus.color');
    }

    .h-panelmenu-item.h-focus > .h-panelmenu-item-content .h-panelmenu-submenu-icon {
        color: dt('panelmenu.submenu.icon.focus.color');
    }

    .h-panelmenu-item:not(.h-disabled) > .h-panelmenu-item-content:hover {
        background: dt('panelmenu.item.focus.background');
        color: dt('panelmenu.item.focus.color');
    }

    .h-panelmenu-item:not(.h-disabled) > .h-panelmenu-item-content:hover .h-panelmenu-item-icon {
        color: dt('panelmenu.item.icon.focus.color');
    }

    .h-panelmenu-item:not(.h-disabled) > .h-panelmenu-item-content:hover .h-panelmenu-submenu-icon {
        color: dt('panelmenu.submenu.icon.focus.color');
    }

    .h-panelmenu-content-container {
        display: grid;
        grid-template-rows: 1fr;
    }

    .h-panelmenu-content-wrapper {
        min-height: 0;
    }
`;
