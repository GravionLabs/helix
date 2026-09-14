import { Injectable } from '@angular/core';
import { style as rating_style } from './rating.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    ${rating_style}

    /* For Helix */
    h-rating.ng-invalid.ng-dirty > .h-rating > .h-rating-icon {
        stroke: dt('rating.invalid.icon.color');
    }
`;

const classes = {
    root: ({ instance }) => [
        'h-rating',
        {
            'h-readonly': instance.readonly(),
            'h-disabled': instance.$disabled()
        }
    ],
    option: ({ instance, star, value }) => [
        'h-rating-option',

        {
            'h-rating-option-active': star + 1 <= value,
            'h-focus-visible': star + 1 === instance.focusedOptionIndex() && instance.isFocusVisibleItem
        }
    ],
    onIcon: ({ instance }) => ['h-rating-icon h-rating-on-icon', { 'h-invalid': instance.invalid() }],
    offIcon: ({ instance }) => ['h-rating-icon h-rating-off-icon', { 'h-invalid': instance.invalid() }]
};

@Injectable()
export class RatingStyle extends BaseStyle {
    name = 'rating';

    style = style;

    classes = classes;
}

/**
 *
 * Rating component is a star based selection input.
 *
 * [Live Demo](https://www.primeng.org/rating/)
 *
 * @module ratingstyle
 *
 */
export enum RatingClasses {
    /**
     * Class name of the root element
     */
    root = 'h-rating',
    /**
     * Class name of the option element
     */
    option = 'h-rating-option',
    /**
     * Class name of the on icon element
     */
    onIcon = 'h-rating-on-icon',
    /**
     * Class name of the off icon element
     */
    offIcon = 'h-rating-off-icon'
}

export interface RatingStyle extends BaseStyle {}
