import { Injectable } from '@angular/core';
import { style } from './blockui.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => [
        'h-blockui h-blockui-mask',
        {
            'h-blockui-mask-document': !instance.target
        }
    ]
};

@Injectable()
export class BlockUiStyle extends BaseStyle {
    name = 'blockui';

    style = style;

    classes = classes;
}

/**
 *
 * BlockUI represents people using icons, labels and images.
 *
 * [Live Demo](https://www.primeng.org/blockui)
 *
 * @module blockuistyle
 *
 */
export enum BlockUIClasses {
    /**
     * Class name of the root element
     */
    root = 'h-blockui'
}

export interface BlockUIStyle extends BaseStyle {}
