import { Injectable } from '@angular/core';
import { style as drawer_style } from './drawer.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
${drawer_style}

/** For Helix **/
.h-drawer {
    position: fixed;
}

.h-drawer-left {
    top: 0;
    left: 0;
    width: 20rem;
    height: 100%;
    border-inline-end-width: 1px;
}

.h-drawer-right {
    top: 0;
    right: 0;
    width: 20rem;
    height: 100%;
    border-inline-start-width: 1px;
}

.h-drawer-top {
    top: 0;
    left: 0;
    width: 100%;
    height: 10rem;
    border-block-end-width: 1px;
}

.h-drawer-bottom {
    bottom: 0;
    left: 0;
    width: 100%;
    height: 10rem;
    border-block-start-width: 1px;
}

.h-drawer-full {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    -webkit-transition: none;
    transition: none;
}

/* Animations */
.h-drawer-enter-left {
    animation: h-animate-drawer-enter-left 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.h-drawer-leave-left {
    animation: h-animate-drawer-leave-left 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.h-drawer-enter-right {
    animation: h-animate-drawer-enter-right 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.h-drawer-leave-right {
    animation: h-animate-drawer-leave-right 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.h-drawer-enter-top {
    animation: h-animate-drawer-enter-top 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.h-drawer-leave-top {
    animation: h-animate-drawer-leave-top 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.h-drawer-enter-bottom {
    animation: h-animate-drawer-enter-bottom 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.h-drawer-leave-bottom {
    animation: h-animate-drawer-leave-bottom 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.h-drawer-enter-full {
    animation: h-animate-drawer-enter-full 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.h-drawer-leave-full {
    animation: h-animate-drawer-leave-full 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}
`;

const classes = {
    mask: ({ instance }) => ['h-drawer-mask', { [`h-overlay-mask h-overlay-mask-enter-active`]: instance.modal() }, { 'h-drawer-full': instance.fullScreen() }],
    root: ({ instance }) => [
        'h-drawer h-component',
        {
            'h-drawer-full': instance.fullScreen(),
            'h-drawer-open': instance.visible
        },
        `h-drawer-${instance.position()}`
    ],
    header: 'h-drawer-header',
    title: 'h-drawer-title',
    pcCloseButton: 'h-drawer-close-button',
    content: 'h-drawer-content',
    footer: 'h-drawer-footer'
};

@Injectable()
export class DrawerStyle extends BaseStyle {
    name = 'drawer';

    style = style;

    classes = classes;
}

/**
 *
 * Drawer is a panel component displayed as an overlay at the edges of the screen.
 *
 * [Live Demo](https://www.primeng.org/drawer)
 *
 * @module drawerstyle
 *
 */
export enum DrawerClasses {
    /**
     * Class name of the mask element
     */
    mask = 'h-drawer-mask',
    /**
     * Class name of the root element
     */
    root = 'h-drawer',
    /**
     * Class name of the header element
     */
    header = 'h-drawer-header',
    /**
     * Class name of the title element
     */
    title = 'h-drawer-title',
    /**
     * Class name of the close button element
     */
    pcCloseButton = 'h-drawer-close-button',
    /**
     * Class name of the content element
     */
    content = 'h-drawer-content'
}

export interface DrawerStyle extends BaseStyle {}
