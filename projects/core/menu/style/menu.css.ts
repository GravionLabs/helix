export const style = /*css*/ `
    .h-menu {
        background: dt('menu.background');
        color: dt('menu.color');
        border: 1px solid dt('menu.border.color');
        border-radius: dt('menu.border.radius');
        min-width: 12.5rem;
    }

    .h-menu-list {
        margin: 0;
        padding: dt('menu.list.padding');
        outline: 0 none;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: dt('menu.list.gap');
    }

    .h-menu-item-content {
        transition:
            background dt('menu.transition.duration'),
            color dt('menu.transition.duration');
        border-radius: dt('menu.item.border.radius');
        color: dt('menu.item.color');
        overflow: hidden;
    }

    .h-menu-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('menu.item.padding');
        gap: dt('menu.item.gap');
        user-select: none;
        outline: 0 none;
    }

    .h-menu-item-label {
        line-height: 1;
    }

    .h-menu-item-icon {
        color: dt('menu.item.icon.color');
    }

    .h-menu-item.h-focus .h-menu-item-content {
        color: dt('menu.item.focus.color');
        background: dt('menu.item.focus.background');
    }

    .h-menu-item.h-focus .h-menu-item-icon {
        color: dt('menu.item.icon.focus.color');
    }

    .h-menu-item:not(.h-disabled) .h-menu-item-content:hover {
        color: dt('menu.item.focus.color');
        background: dt('menu.item.focus.background');
    }

    .h-menu-item:not(.h-disabled) .h-menu-item-content:hover .h-menu-item-icon {
        color: dt('menu.item.icon.focus.color');
    }

    .h-menu-overlay {
        box-shadow: dt('menu.shadow');
    }

    .h-menu-submenu-label {
        background: dt('menu.submenu.label.background');
        padding: dt('menu.submenu.label.padding');
        color: dt('menu.submenu.label.color');
        font-weight: dt('menu.submenu.label.font.weight');
    }

    .h-menu-separator {
        border-block-start: 1px solid dt('menu.separator.border.color');
    }
`;
