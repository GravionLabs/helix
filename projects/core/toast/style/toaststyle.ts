import { Injectable } from '@angular/core';
import { style } from './toast.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

// Position
const inlineStyles = {
    root: ({ instance }) => {
        const { _position } = instance;

        return {
            position: 'fixed',
            top: _position === 'top-right' || _position === 'top-left' || _position === 'top-center' ? '20px' : _position === 'center' ? '50%' : null,
            right: (_position === 'top-right' || _position === 'bottom-right') && '20px',
            bottom: (_position === 'bottom-left' || _position === 'bottom-right' || _position === 'bottom-center') && '20px',
            left: _position === 'top-left' || _position === 'bottom-left' ? '20px' : _position === 'center' || _position === 'top-center' || _position === 'bottom-center' ? '50%' : null
        };
    }
};

const classes = {
    root: ({ instance }) => ['h-toast h-component', `h-toast-${instance._position}`],

    message: ({ instance }) => ({
        'h-toast-message': true,
        'h-toast-message-info': instance.message.severity === 'info' || instance.message.severity === undefined,
        'h-toast-message-warn': instance.message.severity === 'warn',
        'h-toast-message-error': instance.message.severity === 'error',
        'h-toast-message-success': instance.message.severity === 'success',
        'h-toast-message-secondary': instance.message.severity === 'secondary',
        'h-toast-message-contrast': instance.message.severity === 'contrast'
    }),
    messageContent: 'h-toast-message-content',
    messageIcon: ({ instance }) => ({
        'h-toast-message-icon': true,
        [`pi ${instance.message.icon}`]: !!instance.message.icon
    }),
    messageText: 'h-toast-message-text',
    summary: 'h-toast-summary',
    detail: 'h-toast-detail',
    closeButton: 'h-toast-close-button',
    closeIcon: ({ instance }) => ({
        'h-toast-close-icon': true,
        [`pi ${instance.message.closeIcon}`]: !!instance.message.closeIcon
    })
};

@Injectable()
export class ToastStyle extends BaseStyle {
    name = 'toast';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * Toast is used to display messages in an overlay.
 *
 * [Live Demo](https://www.primeng.org/toast/)
 *
 * @module toaststyle
 *
 */
export enum ToastClasses {
    /**
     * Class name of the root element
     */
    root = 'h-toast',
    /**
     * Class name of the message element
     */
    message = 'h-toast-message',
    /**
     * Class name of the message content element
     */
    messageContent = 'h-toast-message-content',
    /**
     * Class name of the message icon element
     */
    messageIcon = 'h-toast-message-icon',
    /**
     * Class name of the message text element
     */
    messageText = 'h-toast-message-text',
    /**
     * Class name of the summary element
     */
    summary = 'h-toast-summary',
    /**
     * Class name of the detail element
     */
    detail = 'h-toast-detail',
    /**
     * Class name of the close button element
     */
    closeButton = 'h-toast-close-button',
    /**
     * Class name of the close icon element
     */
    closeIcon = 'h-toast-close-icon'
}

export interface ToastStyle extends BaseStyle {}
