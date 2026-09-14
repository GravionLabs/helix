export const style = /*css*/ `
    .h-galleria {
        overflow: hidden;
        border-style: solid;
        border-width: dt('galleria.border.width');
        border-color: dt('galleria.border.color');
        border-radius: dt('galleria.border.radius');
    }

    .h-galleria-content {
        display: flex;
        flex-direction: column;
    }

    .h-galleria-items-container {
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .h-galleria-items {
        position: relative;
        display: flex;
        height: 100%;
    }

    .h-galleria-nav-button {
        position: absolute !important;
        top: 50%;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        background: dt('galleria.nav.button.background');
        color: dt('galleria.nav.button.color');
        width: dt('galleria.nav.button.size');
        height: dt('galleria.nav.button.size');
        transition:
            background dt('galleria.transition.duration'),
            color dt('galleria.transition.duration'),
            outline-color dt('galleria.transition.duration'),
            box-shadow dt('galleria.transition.duration');
        margin: calc(-1 * calc(dt('galleria.nav.button.size')) / 2) dt('galleria.nav.button.gutter') 0 dt('galleria.nav.button.gutter');
        padding: 0;
        user-select: none;
        border: 0 none;
        cursor: pointer;
        outline-color: transparent;
    }

    .h-galleria-nav-button:not(.h-disabled):hover {
        background: dt('galleria.nav.button.hover.background');
        color: dt('galleria.nav.button.hover.color');
    }

    .h-galleria-nav-button:not(.h-disabled):focus-visible {
        box-shadow: dt('galleria.nav.button.focus.ring.shadow');
        outline: dt('galleria.nav.button.focus.ring.width') dt('galleria.nav.button.focus.ring.style') dt('galleria.nav.button.focus.ring.color');
        outline-offset: dt('galleria.nav.button.focus.ring.offset');
    }

    .h-galleria-next-icon,
    .h-galleria-prev-icon {
        font-size: dt('galleria.nav.icon.size');
        width: dt('galleria.nav.icon.size');
        height: dt('galleria.nav.icon.size');
    }

    .h-galleria-prev-button {
        border-radius: dt('galleria.nav.button.prev.border.radius');
        left: 0;
    }

    .h-galleria-next-button {
        border-radius: dt('galleria.nav.button.next.border.radius');
        right: 0;
    }

    .h-galleria-prev-button:dir(rtl) {
        left: auto;
        right: 0;
        transform: rotate(180deg);
    }

    .h-galleria-next-button:dir(rtl) {
        right: auto;
        left: 0;
        transform: rotate(180deg);
    }

    .h-galleria-item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
    }

    .h-galleria-hover-navigators .h-galleria-nav-button {
        pointer-events: none;
        opacity: 0;
        transition: opacity dt('galleria.transition.duration') ease-in-out;
    }

    .h-galleria-hover-navigators .h-galleria-items-container:hover .h-galleria-nav-button {
        pointer-events: all;
        opacity: 1;
    }

    .h-galleria-hover-navigators .h-galleria-items-container:hover .h-galleria-nav-button.h-disabled {
        pointer-events: none;
    }

    .h-galleria-caption {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background: dt('galleria.caption.background');
        color: dt('galleria.caption.color');
        padding: dt('galleria.caption.padding');
    }

    .h-galleria-thumbnails {
        display: flex;
        flex-direction: column;
        overflow: auto;
        flex-shrink: 0;
    }

    .h-galleria-thumbnail-nav-button {
        align-self: center;
        flex: 0 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        position: relative;
        margin: 0 dt('galleria.thumbnail.nav.button.gutter');
        padding: 0;
        border: none;
        user-select: none;
        cursor: pointer;
        background: transparent;
        color: dt('galleria.thumbnail.nav.button.color');
        width: dt('galleria.thumbnail.nav.button.size');
        height: dt('galleria.thumbnail.nav.button.size');
        transition:
            background dt('galleria.transition.duration'),
            color dt('galleria.transition.duration'),
            outline-color dt('galleria.transition.duration');
        outline-color: transparent;
        border-radius: dt('galleria.thumbnail.nav.button.border.radius');
    }

    .h-galleria-thumbnail-nav-button:hover {
        background: dt('galleria.thumbnail.nav.button.hover.background');
        color: dt('galleria.thumbnail.nav.button.hover.color');
    }

    .h-galleria-thumbnail-nav-button:focus-visible {
        box-shadow: dt('galleria.thumbnail.nav.button.focus.ring.shadow');
        outline: dt('galleria.thumbnail.nav.button.focus.ring.width') dt('galleria.thumbnail.nav.button.focus.ring.style') dt('galleria.thumbnail.nav.button.focus.ring.color');
        outline-offset: dt('galleria.thumbnail.nav.button.focus.ring.offset');
    }

    .h-galleria-thumbnail-nav-button .h-galleria-thumbnail-next-icon,
    .h-galleria-thumbnail-nav-button .h-galleria-thumbnail-prev-icon {
        font-size: dt('galleria.thumbnail.nav.button.icon.size');
        width: dt('galleria.thumbnail.nav.button.icon.size');
        height: dt('galleria.thumbnail.nav.button.icon.size');
    }

    .h-galleria-thumbnails-content {
        display: flex;
        flex-direction: row;
        background: dt('galleria.thumbnails.content.background');
        padding: dt('galleria.thumbnails.content.padding');
    }

    .h-galleria-thumbnails-viewport {
        overflow: hidden;
        width: 100%;
    }

    .h-galleria:not(.h-galleria-thumbnails-right):not(.h-galleria-thumbnails-left) .h-galleria-thumbnail-prev-button:dir(rtl),
    .h-galleria:not(.h-galleria-thumbnails-right):not(.h-galleria-thumbnails-left) .h-galleria-thumbnail-next-button:dir(rtl) {
        transform: rotate(180deg);
    }

    .h-galleria-thumbnail-items {
        display: flex;
    }

    .h-galleria-thumbnail-items:dir(rtl) {
        flex-direction: row-reverse;
    }

    .h-galleria-thumbnail-item {
        overflow: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0.5;
    }

    .h-galleria-thumbnail {
        outline-color: transparent;
    }

    .h-galleria-thumbnail-item:hover {
        opacity: 1;
        transition: opacity 0.3s;
    }

    .h-galleria-thumbnail-item-current {
        opacity: 1;
    }

    .h-galleria-thumbnails-left .h-galleria-content,
    .h-galleria-thumbnails-right .h-galleria-content {
        flex-direction: row;
    }

    .h-galleria-thumbnails-left .h-galleria-items-container,
    .h-galleria-thumbnails-right .h-galleria-items-container {
        flex-direction: row;
    }

    .h-galleria-thumbnails-left .h-galleria-items-container,
    .h-galleria-thumbnails-top .h-galleria-items-container {
        order: 2;
    }

    .h-galleria-thumbnails-left .h-galleria-thumbnails,
    .h-galleria-thumbnails-top .h-galleria-thumbnails {
        order: 1;
    }

    .h-galleria-thumbnails-left .h-galleria-thumbnails-content,
    .h-galleria-thumbnails-right .h-galleria-thumbnails-content {
        flex-direction: column;
        flex-grow: 1;
    }

    .h-galleria-thumbnails-left .h-galleria-thumbnail-items,
    .h-galleria-thumbnails-right .h-galleria-thumbnail-items {
        flex-direction: column;
        height: 100%;
    }

    .h-galleria-indicator-list {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: dt('galleria.indicator.list.padding');
        gap: dt('galleria.indicator.list.gap');
        margin: 0;
        list-style: none;
    }

    .h-galleria-indicator-button {
        display: inline-flex;
        align-items: center;
        background: dt('galleria.indicator.button.background');
        width: dt('galleria.indicator.button.width');
        height: dt('galleria.indicator.button.height');
        transition:
            background dt('galleria.transition.duration'),
            color dt('galleria.transition.duration'),
            outline-color dt('galleria.transition.duration'),
            box-shadow dt('galleria.transition.duration');
        outline-color: transparent;
        border-radius: dt('galleria.indicator.button.border.radius');
        margin: 0;
        padding: 0;
        border: none;
        user-select: none;
        cursor: pointer;
    }

    .h-galleria-indicator-button:hover {
        background: dt('galleria.indicator.button.hover.background');
    }

    .h-galleria-indicator-button:focus-visible {
        box-shadow: dt('galleria.indicator.button.focus.ring.shadow');
        outline: dt('galleria.indicator.button.focus.ring.width') dt('galleria.indicator.button.focus.ring.style') dt('galleria.indicator.button.focus.ring.color');
        outline-offset: dt('galleria.indicator.button.focus.ring.offset');
    }

    .h-galleria-indicator-active .h-galleria-indicator-button {
        background: dt('galleria.indicator.button.active.background');
    }

    .h-galleria-indicators-left .h-galleria-items-container,
    .h-galleria-indicators-right .h-galleria-items-container {
        flex-direction: row;
        align-items: center;
    }

    .h-galleria-indicators-left .h-galleria-items,
    .h-galleria-indicators-top .h-galleria-items {
        order: 2;
    }

    .h-galleria-indicators-left .h-galleria-indicator-list,
    .h-galleria-indicators-top .h-galleria-indicator-list {
        order: 1;
    }

    .h-galleria-indicators-left .h-galleria-indicator-list,
    .h-galleria-indicators-right .h-galleria-indicator-list {
        flex-direction: column;
    }

    .h-galleria-inset-indicators .h-galleria-indicator-list {
        position: absolute;
        display: flex;
        z-index: 1;
        background: dt('galleria.inset.indicator.list.background');
    }

    .h-galleria-inset-indicators .h-galleria-indicator-button {
        background: dt('galleria.inset.indicator.button.background');
    }

    .h-galleria-inset-indicators .h-galleria-indicator-button:hover {
        background: dt('galleria.inset.indicator.button.hover.background');
    }

    .h-galleria-inset-indicators .h-galleria-indicator-active .h-galleria-indicator-button {
        background: dt('galleria.inset.indicator.button.active.background');
    }

    .h-galleria-inset-indicators.h-galleria-indicators-top .h-galleria-indicator-list {
        top: 0;
        left: 0;
        width: 100%;
        align-items: flex-start;
    }

    .h-galleria-inset-indicators.h-galleria-indicators-right .h-galleria-indicator-list {
        right: 0;
        top: 0;
        height: 100%;
        align-items: flex-end;
    }

    .h-galleria-inset-indicators.h-galleria-indicators-bottom .h-galleria-indicator-list {
        bottom: 0;
        left: 0;
        width: 100%;
        align-items: flex-end;
    }

    .h-galleria-inset-indicators.h-galleria-indicators-left .h-galleria-indicator-list {
        left: 0;
        top: 0;
        height: 100%;
        align-items: flex-start;
    }

    .h-galleria-mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .h-galleria-close-button {
        position: absolute !important;
        top: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        margin: dt('galleria.close.button.gutter');
        background: dt('galleria.close.button.background');
        color: dt('galleria.close.button.color');
        width: dt('galleria.close.button.size');
        height: dt('galleria.close.button.size');
        padding: 0;
        border: none;
        user-select: none;
        cursor: pointer;
        border-radius: dt('galleria.close.button.border.radius');
        outline-color: transparent;
        transition:
            background dt('galleria.transition.duration'),
            color dt('galleria.transition.duration'),
            outline-color dt('galleria.transition.duration');
    }

    .h-galleria-close-icon {
        font-size: dt('galleria.close.button.icon.size');
        width: dt('galleria.close.button.icon.size');
        height: dt('galleria.close.button.icon.size');
    }

    .h-galleria-close-button:hover {
        background: dt('galleria.close.button.hover.background');
        color: dt('galleria.close.button.hover.color');
    }

    .h-galleria-close-button:focus-visible {
        box-shadow: dt('galleria.close.button.focus.ring.shadow');
        outline: dt('galleria.close.button.focus.ring.width') dt('galleria.close.button.focus.ring.style') dt('galleria.close.button.focus.ring.color');
        outline-offset: dt('galleria.close.button.focus.ring.offset');
    }

    .h-galleria-mask .h-galleria-nav-button {
        position: fixed;
        top: 50%;
    }

       .h-items-hidden .h-galleria-thumbnail-item {
        visibility: hidden;
    }

    .h-items-hidden .h-galleria-thumbnail-item.h-galleria-thumbnail-item-active {
        visibility: visible;
    }

    .h-galleria-enter-active {
        animation: h-animate-galleria-enter 300ms cubic-bezier(.19,1,.22,1);
    }

    .h-galleria-leave-active {
        animation: h-animate-galleria-leave 300ms cubic-bezier(.19,1,.22,1);
    }

    .h-galleria-enter-active .h-galleria-nav-button {
        opacity: 0;
    }

    @keyframes h-animate-galleria-enter {
        from {
            opacity: 0;
            transform: scale(0.93);
        }
    }

    @keyframes h-animate-galleria-leave {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.93);
        }
    }
`;
