import { Injectable } from '@angular/core';
import { style } from './chip.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const inlineStyles = {
    root: ({ instance }) => ({
        display: !instance.visible && 'none'
    })
};

const classes = {
    root: ({ instance }) => [
        'h-chip h-component',
        {
            'h-disabled': instance.disabled()
        }
    ],
    image: 'h-chip-image',
    icon: 'h-chip-icon',
    label: 'h-chip-label',
    removeIcon: 'h-chip-remove-icon'
};

@Injectable()
export class ChipStyle extends BaseStyle {
    name = 'chip';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * Chip represents people using icons, labels and images.
 *
 * [Live Demo](https://www.primeng.org/chip)
 *
 * @module chipstyle
 *
 */
export enum ChipClasses {
    /**
     * Class name of the root element
     */
    root = 'h-chip',
    /**
     * Class name of the image element
     */
    image = 'h-chip-image',
    /**
     * Class name of the icon element
     */
    icon = 'h-chip-icon',
    /**
     * Class name of the label element
     */
    label = 'h-chip-label',
    /**
     * Class name of the remove icon element
     */
    removeIcon = 'h-chip-remove-icon'
}

export interface ChipStyle extends BaseStyle {}
