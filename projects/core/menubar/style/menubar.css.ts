export const style = /*css*/ `
    .h-menubar {
        display: flex;
        align-items: center;
        background: dt('menubar.background');
        border: 1px solid dt('menubar.border.color');
        border-radius: dt('menubar.border.radius');
        color: dt('menubar.color');
        padding: dt('menubar.padding');
        gap: dt('menubar.gap');
    }

    .h-menubar-start,
    .h-megamenu-end {
        display: flex;
        align-items: center;
    }

    .h-menubar-root-list,
    .h-menubar-submenu {
        display: flex;
        margin: 0;
        padding: 0;
        list-style: none;
        outline: 0 none;
    }

    .h-menubar-root-list {
        align-items: center;
        flex-wrap: wrap;
        gap: dt('menubar.gap');
    }

    .h-menubar-root-list > .h-menubar-item > .h-menubar-item-content {
        border-radius: dt('menubar.base.item.border.radius');
    }

    .h-menubar-root-list > .h-menubar-item > .h-menubar-item-content > .h-menubar-item-link {
        padding: dt('menubar.base.item.padding');
    }

    .h-menubar-item-content {
        transition:
            background dt('menubar.transition.duration'),
            color dt('menubar.transition.duration');
        border-radius: dt('menubar.item.border.radius');
        color: dt('menubar.item.color');
    }

    .h-menubar-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('menubar.item.padding');
        gap: dt('menubar.item.gap');
        user-select: none;
        outline: 0 none;
    }

    .h-menubar-item-label {
        line-height: 1;
    }

    .h-menubar-item-icon {
        color: dt('menubar.item.icon.color');
    }

    .h-menubar-submenu-icon {
        color: dt('menubar.submenu.icon.color');
        margin-left: auto;
        font-size: dt('menubar.submenu.icon.size');
        width: dt('menubar.submenu.icon.size');
        height: dt('menubar.submenu.icon.size');
    }

    .h-menubar-submenu .h-menubar-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .h-menubar-item.h-focus > .h-menubar-item-content {
        color: dt('menubar.item.focus.color');
        background: dt('menubar.item.focus.background');
    }

    .h-menubar-item.h-focus > .h-menubar-item-content .h-menubar-item-icon {
        color: dt('menubar.item.icon.focus.color');
    }

    .h-menubar-item.h-focus > .h-menubar-item-content .h-menubar-submenu-icon {
        color: dt('menubar.submenu.icon.focus.color');
    }

    .h-menubar-item:not(.h-disabled) > .h-menubar-item-content:hover {
        color: dt('menubar.item.focus.color');
        background: dt('menubar.item.focus.background');
    }

    .h-menubar-item:not(.h-disabled) > .h-menubar-item-content:hover .h-menubar-item-icon {
        color: dt('menubar.item.icon.focus.color');
    }

    .h-menubar-item:not(.h-disabled) > .h-menubar-item-content:hover .h-menubar-submenu-icon {
        color: dt('menubar.submenu.icon.focus.color');
    }

    .h-menubar-item-active > .h-menubar-item-content {
        color: dt('menubar.item.active.color');
        background: dt('menubar.item.active.background');
    }

    .h-menubar-item-active > .h-menubar-item-content .h-menubar-item-icon {
        color: dt('menubar.item.icon.active.color');
    }

    .h-menubar-item-active > .h-menubar-item-content .h-menubar-submenu-icon {
        color: dt('menubar.submenu.icon.active.color');
    }

    .h-menubar-submenu {
        display: none;
        position: absolute;
        min-width: 12.5rem;
        z-index: 1;
        background: dt('menubar.submenu.background');
        border: 1px solid dt('menubar.submenu.border.color');
        border-radius: dt('menubar.submenu.border.radius');
        box-shadow: dt('menubar.submenu.shadow');
        color: dt('menubar.submenu.color');
        flex-direction: column;
        padding: dt('menubar.submenu.padding');
        gap: dt('menubar.submenu.gap');
    }

    .h-menubar-submenu .h-menubar-separator {
        border-block-start: 1px solid dt('menubar.separator.border.color');
    }

    .h-menubar-submenu .h-menubar-item {
        position: relative;
    }

    .h-menubar-submenu > .h-menubar-item-active > .h-menubar-submenu {
        display: block;
        left: 100%;
        top: 0;
    }

    .h-menubar-end {
        margin-left: auto;
        align-self: center;
    }

    .h-menubar-end:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .h-menubar-button {
        display: none;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        width: dt('menubar.mobile.button.size');
        height: dt('menubar.mobile.button.size');
        position: relative;
        color: dt('menubar.mobile.button.color');
        border: 0 none;
        background: transparent;
        border-radius: dt('menubar.mobile.button.border.radius');
        transition:
            background dt('menubar.transition.duration'),
            color dt('menubar.transition.duration'),
            outline-color dt('menubar.transition.duration');
        outline-color: transparent;
    }

    .h-menubar-button:hover {
        color: dt('menubar.mobile.button.hover.color');
        background: dt('menubar.mobile.button.hover.background');
    }

    .h-menubar-button:focus-visible {
        box-shadow: dt('menubar.mobile.button.focus.ring.shadow');
        outline: dt('menubar.mobile.button.focus.ring.width') dt('menubar.mobile.button.focus.ring.style') dt('menubar.mobile.button.focus.ring.color');
        outline-offset: dt('menubar.mobile.button.focus.ring.offset');
    }

    .h-menubar-mobile {
        position: relative;
    }

    .h-menubar-mobile .h-menubar-button {
        display: flex;
    }

    .h-menubar-mobile .h-menubar-root-list {
        position: absolute;
        display: none;
        width: 100%;
        flex-direction: column;
        top: 100%;
        left: 0;
        z-index: 1;
        padding: dt('menubar.submenu.padding');
        background: dt('menubar.submenu.background');
        border: 1px solid dt('menubar.submenu.border.color');
        box-shadow: dt('menubar.submenu.shadow');
        border-radius: dt('menubar.submenu.border.radius');
        gap: dt('menubar.submenu.gap');
    }

    .h-menubar-mobile .h-menubar-root-list:dir(rtl) {
        left: auto;
        right: 0;
    }

    .h-menubar-mobile .h-menubar-root-list > .h-menubar-item > .h-menubar-item-content > .h-menubar-item-link {
        padding: dt('menubar.item.padding');
    }

    .h-menubar-mobile-active .h-menubar-root-list {
        display: flex;
    }

    .h-menubar-mobile .h-menubar-root-list .h-menubar-item {
        width: 100%;
        position: static;
    }

    .h-menubar-mobile .h-menubar-root-list .h-menubar-separator {
        border-block-start: 1px solid dt('menubar.separator.border.color');
    }

    .h-menubar-mobile .h-menubar-root-list > .h-menubar-item > .h-menubar-item-content .h-menubar-submenu-icon {
        margin-left: auto;
        transition: transform 0.2s;
    }

    .h-menubar-mobile .h-menubar-root-list > .h-menubar-item > .h-menubar-item-content .h-menubar-submenu-icon:dir(rtl),
    .h-menubar-mobile .h-menubar-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .h-menubar-mobile .h-menubar-root-list > .h-menubar-item-active > .h-menubar-item-content .h-menubar-submenu-icon {
        transform: rotate(-180deg);
    }

    .h-menubar-mobile .h-menubar-submenu .h-menubar-submenu-icon {
        transition: transform 0.2s;
        transform: rotate(90deg);
    }

    .h-menubar-mobile .h-menubar-item-active > .h-menubar-item-content .h-menubar-submenu-icon {
        transform: rotate(-90deg);
    }

    .h-menubar-mobile .h-menubar-submenu {
        width: 100%;
        position: static;
        box-shadow: none;
        border: 0 none;
        padding-inline-start: dt('menubar.submenu.mobile.indent');
        padding-inline-end: 0;
    }
`;
