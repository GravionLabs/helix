import { Injectable } from '@angular/core';
import { DialogStyle } from '@gravionlabs/helix-core/dialog';

@Injectable()
export class DynamicDialogStyle extends DialogStyle {
    name = 'dialog';
}

/**
 *
 * DynamicDialog is a container to display content in an overlay window.
 *
 * [Live Demo](https://www.primeng.org/dynamicdialog)
 *
 * @module dynamicdialogstyle
 *
 */
export enum DynamicDialogClasses {
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

export interface DynamicDialogStyle {}
