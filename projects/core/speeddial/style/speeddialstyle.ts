import { Injectable } from '@angular/core';
import { style } from './speeddial.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

/* Direction */
const inlineStyles = {
    root: ({ instance }) => ({
        alignItems: (instance.direction() === 'up' || instance.direction() === 'down') && 'center',
        justifyContent: (instance.direction() === 'left' || instance.direction() === 'right') && 'center',
        flexDirection: instance.direction() === 'up' ? 'column-reverse' : instance.direction() === 'down' ? 'column' : instance.direction() === 'left' ? 'row-reverse' : instance.direction() === 'right' ? 'row' : null
    }),
    list: ({ instance }) => ({
        flexDirection: instance.direction() === 'up' ? 'column-reverse' : instance.direction() === 'down' ? 'column' : instance.direction() === 'left' ? 'row-reverse' : instance.direction() === 'right' ? 'row' : null
    })
};

const classes = {
    root: ({ instance }) => [
        `h-speeddial h-component h-speeddial-${instance.type()}`,
        {
            [`h-speeddial-direction-${instance.direction()}`]: instance.type() !== 'circle',
            'h-speeddial-open': instance.visible(),
            'h-disabled': instance.disabled()
        }
    ],
    pcButton: ({ instance }) => [
        'h-button-icon-only h-speeddial-button h-button-rounded',
        {
            'h-speeddial-rotate': instance.rotateAnimation() && !instance.hideIcon()
        }
    ],
    list: 'h-speeddial-list',
    item: ({ instance, item, i }) => ['h-speeddial-item', { 'h-hidden': item.visible === false, 'h-focus': instance.focusedOptionId == instance.$id() + '_' + i }],
    pcAction: 'h-speeddial-action',
    actionIcon: 'h-speeddial-action-icon',
    mask: 'h-speeddial-mask h-overlay-mask'
};

@Injectable()
export class SpeedDialStyle extends BaseStyle {
    name = 'speeddial';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * When pressed, a floating action button can display multiple primary actions that can be performed on a page.
 *
 * [Live Demo](https://www.primeng.org/speeddial/)
 *
 * @module speeddialstyle
 *
 */
export enum SpeedDialClasses {
    /**
     * Class name of the root element
     */
    root = 'h-speeddial',
    /**
     * Class name of the button element
     */
    pcButton = 'h-speeddial-button',
    /**
     * Class name of the list element
     */
    list = 'h-speeddial-list',
    /**
     * Class name of the item element
     */
    item = 'h-speeddial-item',
    /**
     * Class name of the action element
     */
    pcAction = 'h-speeddial-action',
    /**
     * Class name of the action icon element
     */
    actionIcon = 'h-speeddial-action-icon',
    /**
     * Class name of the mask element
     */
    mask = 'h-speeddial-mask'
}

export interface SpeedDialStyle extends BaseStyle {}
