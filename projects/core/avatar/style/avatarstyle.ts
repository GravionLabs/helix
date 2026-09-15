import { Injectable } from '@angular/core';
import { style } from './avatar.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => [
        'h-avatar h-component',
        {
            'h-avatar-image': instance.image() != null,
            'h-avatar-circle': instance.shape() === 'circle',
            'h-avatar-lg': instance.size() === 'large',
            'h-avatar-xl': instance.size() === 'xlarge'
        }
    ],
    label: 'h-avatar-label',
    icon: 'h-avatar-icon'
};

@Injectable()
export class AvatarStyle extends BaseStyle {
    name = 'avatar';

    style = style;

    classes = classes;
}

/**
 *
 * Avatar represents people using icons, labels and images.
 *
 * - [Live Demo](https://primeng.org/avatar)
 *
 * @module avatarstyle
 *
 */
export enum AvatarClasses {
    /**
     * Class name of the root element
     */
    root = 'h-avatar',
    /**
     * Class name of the label element
     */
    label = 'h-avatar-label',
    /**
     * Class name of the icon element
     */
    icon = 'h-avatar-icon',
    /**
     * Container element in image mode
     */
    image = 'h-avatar-image',
    /**
     * Container element with a circle shape
     */
    circle = 'h-avatar-circle',
    /**
     *  Container element with a large size
     */
    large = 'h-avatar-lg',
    /**
     *  Container element with an xlarge size
     */
    xlarge = 'h-avatar-xl'
}

export interface AvatarStyle extends BaseStyle {}
