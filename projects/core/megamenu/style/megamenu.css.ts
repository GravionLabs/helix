export const style = /*css*/ `
    .h-megamenu {
        position: relative;
        display: flex;
        align-items: center;
        background: dt('megamenu.background');
        border: 1px solid dt('megamenu.border.color');
        border-radius: dt('megamenu.border.radius');
        color: dt('megamenu.color');
        gap: dt('megamenu.gap');
    }

    .h-megamenu-start,
    .h-megamenu-end {
        display: flex;
        align-items: center;
    }

    .h-megamenu-root-list {
        margin: 0;
        padding: 0;
        list-style: none;
        outline: 0 none;
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: dt('megamenu.gap');
    }

    .h-megamenu-root-list > .h-megamenu-item > .h-megamenu-item-content {
        border-radius: dt('megamenu.base.item.border.radius');
    }

    .h-megamenu-root-list > .h-megamenu-item > .h-megamenu-item-content > .h-megamenu-item-link {
        padding: dt('megamenu.base.item.padding');
    }

    .h-megamenu-item-content {
        transition:
            background dt('megamenu.transition.duration'),
            color dt('megamenu.transition.duration');
        border-radius: dt('megamenu.item.border.radius');
        color: dt('megamenu.item.color');
    }

    .h-megamenu-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('megamenu.item.padding');
        gap: dt('megamenu.item.gap');
        user-select: none;
        outline: 0 none;
    }

    .h-megamenu-item-label {
        line-height: 1;
    }

    .h-megamenu-item-icon {
        color: dt('megamenu.item.icon.color');
    }

    .h-megamenu-submenu-icon {
        color: dt('megamenu.submenu.icon.color');
        font-size: dt('megamenu.submenu.icon.size');
        width: dt('megamenu.submenu.icon.size');
        height: dt('megamenu.submenu.icon.size');
    }

    .h-megamenu-item.h-focus > .h-megamenu-item-content {
        color: dt('megamenu.item.focus.color');
        background: dt('megamenu.item.focus.background');
    }

    .h-megamenu-item.h-focus > .h-megamenu-item-content .h-megamenu-item-icon {
        color: dt('megamenu.item.icon.focus.color');
    }

    .h-megamenu-item.h-focus > .h-megamenu-item-content .h-megamenu-submenu-icon {
        color: dt('megamenu.submenu.icon.focus.color');
    }

    .h-megamenu-item:not(.h-disabled) > .h-megamenu-item-content:hover {
        color: dt('megamenu.item.focus.color');
        background: dt('megamenu.item.focus.background');
    }

    .h-megamenu-item:not(.h-disabled) > .h-megamenu-item-content:hover .h-megamenu-item-icon {
        color: dt('megamenu.item.icon.focus.color');
    }

    .h-megamenu-item:not(.h-disabled) > .h-megamenu-item-content:hover .h-megamenu-submenu-icon {
        color: dt('megamenu.submenu.icon.focus.color');
    }

    .h-megamenu-item-active > .h-megamenu-item-content {
        color: dt('megamenu.item.active.color');
        background: dt('megamenu.item.active.background');
    }

    .h-megamenu-item-active > .h-megamenu-item-content .h-megamenu-item-icon {
        color: dt('megamenu.item.icon.active.color');
    }

    .h-megamenu-item-active > .h-megamenu-item-content .h-megamenu-submenu-icon {
        color: dt('megamenu.submenu.icon.active.color');
    }

    .h-megamenu-overlay {
        display: none;
        position: absolute;
        width: auto;
        z-index: 1;
        left: 0;
        min-width: 100%;
        padding: dt('megamenu.overlay.padding');
        background: dt('megamenu.overlay.background');
        color: dt('megamenu.overlay.color');
        border: 1px solid dt('megamenu.overlay.border.color');
        border-radius: dt('megamenu.overlay.border.radius');
        box-shadow: dt('megamenu.overlay.shadow');
    }

    .h-megamenu-overlay:dir(rtl) {
        left: auto;
        right: 0;
    }

    .h-megamenu-root-list > .h-megamenu-item-active > .h-megamenu-overlay {
        display: block;
    }

    .h-megamenu-submenu {
        margin: 0;
        list-style: none;
        padding: dt('megamenu.submenu.padding');
        min-width: 12.5rem;
        display: flex;
        flex-direction: column;
        gap: dt('megamenu.submenu.gap');
    }

    .h-megamenu-submenu-label {
        padding: dt('megamenu.submenu.label.padding');
        color: dt('megamenu.submenu.label.color');
        font-weight: dt('megamenu.submenu.label.font.weight');
        background: dt('megamenu.submenu.label.background');
    }

    .h-megamenu-separator {
        border-block-start: 1px solid dt('megamenu.separator.border.color');
    }

    .h-megamenu-horizontal {
        align-items: center;
        padding: dt('megamenu.horizontal.orientation.padding');
    }

    .h-megamenu-horizontal .h-megamenu-root-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: dt('megamenu.horizontal.orientation.gap');
    }

    .h-megamenu-horizontal .h-megamenu-end {
        margin-left: auto;
        align-self: center;
    }

    .h-megamenu-horizontal .h-megamenu-end:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .h-megamenu-vertical {
        display: inline-flex;
        min-width: 12.5rem;
        flex-direction: column;
        align-items: stretch;
        padding: dt('megamenu.vertical.orientation.padding');
    }

    .h-megamenu-vertical .h-megamenu-root-list {
        align-items: stretch;
        flex-direction: column;
        gap: dt('megamenu.vertical.orientation.gap');
    }

    .h-megamenu-vertical .h-megamenu-root-list > .h-megamenu-item-active > .h-megamenu-overlay {
        left: 100%;
        top: 0;
    }

    .h-megamenu-vertical .h-megamenu-root-list > .h-megamenu-item-active > .h-megamenu-overlay:dir(rtl) {
        left: auto;
        right: 100%;
    }

    .h-megamenu-vertical .h-megamenu-root-list > .h-megamenu-item > .h-megamenu-item-content .h-megamenu-submenu-icon {
        margin-left: auto;
    }

    .h-megamenu-vertical .h-megamenu-root-list > .h-megamenu-item > .h-megamenu-item-content .h-megamenu-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
        transform: rotate(180deg);
    }

    .h-megamenu-grid {
        display: flex;
    }

    .h-megamenu-col-2,
    .h-megamenu-col-3,
    .h-megamenu-col-4,
    .h-megamenu-col-6,
    .h-megamenu-col-12 {
        flex: 0 0 auto;
        padding: dt('megamenu.overlay.gap');
    }

    .h-megamenu-col-2 {
        width: 16.6667%;
    }

    .h-megamenu-col-3 {
        width: 25%;
    }

    .h-megamenu-col-4 {
        width: 33.3333%;
    }

    .h-megamenu-col-6 {
        width: 50%;
    }

    .h-megamenu-col-12 {
        width: 100%;
    }

    .h-megamenu-button {
        display: none;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        width: dt('megamenu.mobile.button.size');
        height: dt('megamenu.mobile.button.size');
        position: relative;
        color: dt('megamenu.mobile.button.color');
        border: 0 none;
        background: transparent;
        border-radius: dt('megamenu.mobile.button.border.radius');
        transition:
            background dt('megamenu.transition.duration'),
            color dt('megamenu.transition.duration'),
            outline-color dt('megamenu.transition.duration'),
            box-shadow dt('megamenu.transition.duration');
        outline-color: transparent;
    }

    .h-megamenu-button:hover {
        color: dt('megamenu.mobile.button.hover.color');
        background: dt('megamenu.mobile.button.hover.background');
    }

    .h-megamenu-button:focus-visible {
        box-shadow: dt('megamenu.mobile.button.focus.ring.shadow');
        outline: dt('megamenu.mobile.button.focus.ring.width') dt('megamenu.mobile.button.focus.ring.style') dt('megamenu.mobile.button.focus.ring.color');
        outline-offset: dt('megamenu.mobile.button.focus.ring.offset');
    }

    .h-megamenu-mobile {
        display: flex;
    }

    .h-megamenu-mobile .h-megamenu-button {
        display: flex;
    }

    .h-megamenu-mobile .h-megamenu-root-list {
        position: absolute;
        display: none;
        flex-direction: column;
        top: 100%;
        left: 0;
        z-index: 1;
        width: 100%;
        padding: dt('megamenu.submenu.padding');
        gap: dt('megamenu.submenu.gap');
        background: dt('megamenu.overlay.background');
        border: 1px solid dt('megamenu.overlay.border.color');
        box-shadow: dt('megamenu.overlay.shadow');
    }

    .h-megamenu-mobile .h-megamenu-root-list:dir(rtl) {
        left: auto;
        right: 0;
    }

    .h-megamenu-mobile-active .h-megamenu-root-list {
        display: block;
    }

    .h-megamenu-mobile .h-megamenu-root-list .h-megamenu-item {
        width: 100%;
        position: static;
    }

    .h-megamenu-mobile .h-megamenu-overlay {
        position: static;
        border: 0 none;
        border-radius: 0;
        box-shadow: none;
    }

    .h-megamenu-mobile .h-megamenu-grid {
        flex-wrap: wrap;
        overflow: auto;
        max-height: 90%;
    }

    .h-megamenu-mobile .h-megamenu-root-list > .h-megamenu-item > .h-megamenu-item-content .h-megamenu-submenu-icon {
        margin-left: auto;
        transition: transform 0.2s;
    }

    .h-megamenu-mobile .h-megamenu-root-list > .h-megamenu-item > .h-megamenu-item-content .h-megamenu-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .h-megamenu-mobile .h-megamenu-root-list > .h-megamenu-item-active > .h-megamenu-item-content .h-megamenu-submenu-icon {
        transform: rotate(-180deg);
    }
`;
