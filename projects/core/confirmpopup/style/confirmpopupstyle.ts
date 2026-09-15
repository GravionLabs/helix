import { Injectable } from '@angular/core';
import { style } from './confirmpopup.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: () => ['h-confirmpopup h-component'],
    content: 'h-confirmpopup-content',
    icon: ({ instance }) => ['h-confirmpopup-icon', instance.confirmation?.icon],
    message: 'h-confirmpopup-message',
    footer: 'h-confirmpopup-footer',
    pcRejectButton: 'h-confirmpopup-reject-button',
    pcAcceptButton: 'h-confirmpopup-accept-button'
};

@Injectable()
export class ConfirmPopupStyle extends BaseStyle {
    name = 'confirmpopup';

    style = style;

    classes = classes;
}

/**
 *
 * ConfirmPopup displays a confirmation overlay displayed relatively to its target.
 *
 * [Live Demo](https://www.primeng.org/confirmpopup)
 *
 * @module confirmpopupstyle
 *
 */
export enum ConfirmPopupClasses {
    /**
     * Class name of the root element
     */
    root = 'h-confirmpopup',
    /**
     * Class name of the content element
     */
    content = 'h-confirmpopup-content',
    /**
     * Class name of the icon element
     */
    icon = 'h-confirmpopup-icon',
    /**
     * Class name of the message element
     */
    message = 'h-confirmpopup-message',
    /**
     * Class name of the footer element
     */
    footer = 'h-confirmpopup-footer',
    /**
     * Class name of the reject button element
     */
    pcRejectButton = 'h-confirmpopup-reject-button',
    /**
     * Class name of the accept button element
     */
    pcAcceptButton = 'h-confirmpopup-accept-button'
}

export interface ConfirmPopupStyle extends BaseStyle {}
