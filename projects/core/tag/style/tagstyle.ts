import { Injectable } from '@angular/core';
import { style } from './tag.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => [
        'h-tag h-component',
        {
            'h-tag-info': instance.severity === 'info',
            'h-tag-success': instance.severity === 'success',
            'h-tag-warn': instance.severity === 'warn',
            'h-tag-danger': instance.severity === 'danger',
            'h-tag-secondary': instance.severity === 'secondary',
            'h-tag-contrast': instance.severity === 'contrast',
            'h-tag-rounded': instance.rounded
        }
    ],
    icon: 'h-tag-icon',
    label: 'h-tag-label'
};

@Injectable()
export class TagStyle extends BaseStyle {
    name = 'tag';

    style = style;

    classes = classes;
}

/**
 *
 * Tag component is used to categorize content.
 *
 * [Live Demo](https://www.primeng.org/tag)
 *
 * @module tagstyle
 *
 */
export enum TagClasses {
    /**
     * Class name of the root element
     */
    root = 'h-tag',
    /**
     * Class name of the icon element
     */
    icon = 'h-tag-icon',
    /**
     * Class name of the label element
     */
    label = 'h-tag-label'
}

export interface TagStyle extends BaseStyle {}
