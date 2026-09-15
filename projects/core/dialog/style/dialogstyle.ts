import { Injectable } from '@angular/core';
import { style } from './dialog.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

/* Position */
const inlineStyles = {
    mask: ({ instance }) => ({
        position: 'fixed',
        height: '100%',
        width: '100%',
        left: 0,
        top: 0,
        display: 'flex',
        justifyContent:
            instance.position() === 'left' || instance.position() === 'topleft' || instance.position() === 'bottomleft'
                ? 'flex-start'
                : instance.position() === 'right' || instance.position() === 'topright' || instance.position() === 'bottomright'
                  ? 'flex-end'
                  : 'center',
        alignItems:
            instance.position() === 'top' || instance.position() === 'topleft' || instance.position() === 'topright'
                ? 'flex-start'
                : instance.position() === 'bottom' || instance.position() === 'bottomleft' || instance.position() === 'bottomright'
                  ? 'flex-end'
                  : 'center',
        pointerEvents: instance.modal() ? 'auto' : 'none'
    }),
    root: {
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: 'auto'
    }
};

const classes = {
    mask: ({ instance }) => {
        const positions = ['left', 'right', 'top', 'topleft', 'topright', 'bottom', 'bottomleft', 'bottomright'];
        const pos = positions.find((item) => item === instance.position());

        return ['h-dialog-mask', { 'h-overlay-mask': instance.modal() }, pos ? `h-dialog-${pos}` : ''];
    },
    root: ({ instance }) => [
        'h-dialog h-component',
        {
            'h-dialog-maximized': instance.maximizable() && instance.maximized
        }
    ],
    header: 'h-dialog-header',
    title: 'h-dialog-title',
    resizeHandle: 'h-resizable-handle',
    headerActions: 'h-dialog-header-actions',
    pcMaximizeButton: 'h-dialog-maximize-button',
    pcCloseButton: 'h-dialog-close-button',
    content: () => ['h-dialog-content'],
    footer: 'h-dialog-footer'
};

@Injectable()
export class DialogStyle extends BaseStyle {
    name = 'dialog';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * Dialog is a container to display content in an overlay window.
 *
 * [Live Demo](https://www.primeng.org/dialog)
 *
 * @module dialogstyle
 *
 */
export enum DialogClasses {
    /**
     * Class name of the mask element
     */
    mask = 'h-dialog-mask',
    /**
     * Class name of the root element
     */
    root = 'h-dialog',
    /**
     * Class name of the header element
     */
    header = 'h-dialog-header',
    /**
     * Class name of the title element
     */
    title = 'h-dialog-title',
    /**
     * Class name of the header actions element
     */
    headerActions = 'h-dialog-header-actions',
    /**
     * Class name of the maximize button element
     */
    pcMaximizeButton = 'h-dialog-maximize-button',
    /**
     * Class name of the close button element
     */
    pcCloseButton = 'h-dialog-close-button',
    /**
     * Class name of the content element
     */
    content = 'h-dialog-content',
    /**
     * Class name of the footer element
     */
    footer = 'h-dialog-footer'
}

export interface DialogStyle extends BaseStyle {}
