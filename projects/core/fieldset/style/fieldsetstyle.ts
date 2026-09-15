import { Injectable } from '@angular/core';
import { style } from './fieldset.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => [
        'h-fieldset h-component',
        {
            'h-fieldset-toggleable': instance.toggleable(),
            'h-fieldset-collapsed': instance.collapsed() && instance.toggleable()
        }
    ],
    legend: 'h-fieldset-legend',
    legendLabel: 'h-fieldset-legend-label',
    toggleButton: 'h-fieldset-toggle-button',
    toggleIcon: 'h-fieldset-toggle-icon',
    contentContainer: 'h-fieldset-content-container',
    contentWrapper: 'h-fieldset-content-wrapper',
    content: 'h-fieldset-content'
};

@Injectable()
export class FieldsetStyle extends BaseStyle {
    name = 'fieldset';

    style = style;

    classes = classes;
}

/**
 *
 * Fieldset is a grouping component with the optional content toggle feature.
 *
 * [Live Demo](https://www.primeng.org/fieldset/)
 *
 * @module fieldsetstyle
 *
 */
export enum FieldsetClasses {
    /**
     * Class name of the root element
     */
    root = 'h-fieldset',
    /**
     * Class name of the legend element
     */
    legend = 'h-fieldset-legend',
    /**
     * Class name of the legend label element
     */
    legendLabel = 'h-fieldset-legend-label',
    /**
     * Class name of the toggle icon element
     */
    toggleIcon = 'h-fieldset-toggle-icon',
    /**
     * Class name of the content container element
     */
    contentContainer = 'h-fieldset-content-container',
    /**
     * Class name of the content wrapper element
     */
    contentWrapper = 'h-fieldset-content-wrapper',
    /**
     * Class name of the content element
     */
    content = 'h-fieldset-content'
}

export interface FieldsetStyle extends BaseStyle {}
