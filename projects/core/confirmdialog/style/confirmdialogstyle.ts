import { Injectable } from '@angular/core';
import { style } from './confirmdialog.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: 'h-confirmdialog',
    icon: 'h-confirmdialog-icon',
    message: 'h-confirmdialog-message',
    pcRejectButton: 'h-confirmdialog-reject-button',
    pcAcceptButton: 'h-confirmdialog-accept-button'
};

@Injectable()
export class ConfirmDialogStyle extends BaseStyle {
    name = 'confirmdialog';

    style = style;

    classes = classes;
}

/**
 *
 * ConfirmDialog uses a Dialog UI with confirmDialog method or <ConfirmDialog> tag.
 *
 * [Live Demo](https://www.primeng.org/confirmdialog)
 *
 * @module confirmdialogstyle
 *
 */
export enum ConfirmDialogClasses {
    /**
     * Class name of the root element
     */
    root = 'h-confirmdialog',
    /**
     * Class name of the icon element
     */
    icon = 'h-confirmdialog-icon',
    /**
     * Class name of the message element
     */
    message = 'h-confirmdialog-message',
    /**
     * Class name of the reject button element
     */
    pcRejectButton = 'h-confirmdialog-reject-button',
    /**
     * Class name of the accept button element
     */
    pcAcceptButton = 'h-confirmdialog-accept-button'
}

export interface ConfirmDialogStyle extends BaseStyle {}
