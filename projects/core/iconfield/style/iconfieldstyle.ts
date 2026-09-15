import { Injectable } from '@angular/core';
import { style } from './iconfield.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => [
        'h-iconfield',
        {
            'h-iconfield-left': instance.iconPosition() == 'left',
            'h-iconfield-right': instance.iconPosition() == 'right'
        }
    ]
};

@Injectable()
export class IconFieldStyle extends BaseStyle {
    name = 'iconfield';

    style = style;

    classes = classes;
}

/**
 *
 * IconField wraps an input and an icon.
 *
 * [Live Demo](https://www.primeng.org/iconfield/)
 *
 * @module iconfieldstyle
 *
 */
export enum IconFieldClasses {
    /**
     * Class name of the root element
     */
    root = 'h-iconfield'
}

export interface IconFieldStyle extends BaseStyle {}
