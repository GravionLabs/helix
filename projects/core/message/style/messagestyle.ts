import { Injectable } from '@angular/core';
import { style } from './message.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => ['h-message h-component h-message-' + instance.severity(), instance.variant() && 'h-message-' + instance.variant(), { 'h-message-sm': instance.size() === 'small', 'h-message-lg': instance.size() === 'large' }],
    contentWrapper: 'h-message-content-wrapper',
    content: 'h-message-content',
    icon: 'h-message-icon',
    text: 'h-message-text',
    closeButton: 'h-message-close-button',
    closeIcon: 'h-message-close-icon'
};

@Injectable()
export class MessageStyle extends BaseStyle {
    name = 'message';

    style = style;

    classes = classes;
}

/**
 *
 * Message groups a collection of contents in tabs.
 *
 * [Live Demo](https://www.primeng.org/message/)
 *
 * @module messagestyle
 *
 */

export enum MessageClasses {
    /**
     * Class name of the root element
     */
    root = 'h-message',
    /**
     * Class name of the content element
     */
    content = 'h-message-content',
    /**
     * Class name of the icon element
     */
    icon = 'h-message-icon',
    /**
     * Class name of the text element
     */
    text = 'h-message-text',
    /**
     * Class name of the close button element
     */
    closeButton = 'h-message-close-button',
    /**
     * Class name of the close icon element
     */
    closeIcon = 'h-message-close-icon'
}

export interface MessageStyle extends BaseStyle {}
