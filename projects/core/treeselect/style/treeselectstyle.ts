import { Injectable } from '@angular/core';
import { style as treeselect_style } from './treeselect.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    ${treeselect_style}

    /* For Helix */

    .h-treeselect.ng-invalid.ng-dirty {
        border-color: dt('treeselect.invalid.border.color');
    }

    h-treeselect.ng-invalid.ng-dirty.h-focus {
        border-color: dt('treeselect.focus.border.color');
    }

    h-treeselect.ng-invalid.ng-dirty .h-treeselect-label.h-placeholder {
        color: dt('treeselect.invalid.placeholder.color');
    }

    .h-treeselect-clear-icon.h-icon {
        flex-shrink: 0;
    }
`;

const inlineStyles = {
    root: ({ instance }) => ({ position: instance.$appendTo() === 'self' ? 'relative' : undefined, ...instance.containerStyle() })
};

const classes = {
    root: ({ instance }) => [
        'h-treeselect h-component h-inputwrapper',
        {
            'h-treeselect-display-chip': instance.display() === 'chip',
            'h-disabled': instance.$disabled(),
            'h-invalid': instance.invalid(),
            'h-focus': instance.focused,
            'h-variant-filled': instance.$variant() === 'filled',
            'h-inputwrapper-filled': !instance.emptyValue,
            'h-inputwrapper-focus': instance.focused || instance.overlayVisible,
            'h-treeselect-open': instance.overlayVisible,
            'h-treeselect-clearable': instance.showClear(),
            'h-treeselect-fluid': instance.hasFluid,
            'h-treeselect-sm h-inputfield-sm': instance.size() === 'small',
            'h-treeselect-lg h-inputfield-lg': instance.size() === 'large'
        }
    ],
    labelContainer: 'h-treeselect-label-container',
    label: ({ instance }) => [
        'h-treeselect-label',
        {
            'h-placeholder': instance.label === instance.placeholder(),
            'h-treeselect-label-empty': !instance.placeholder() && instance.emptyValue
        }
    ],
    clearIcon: 'h-treeselect-clear-icon',
    chip: 'h-treeselect-chip-item',
    pcChip: 'h-treeselect-chip',
    dropdown: 'h-treeselect-dropdown',
    dropdownIcon: 'h-treeselect-dropdown-icon',
    panel: 'h-treeselect-overlay h-component-overlay h-component',
    treeContainer: 'h-treeselect-tree-container',
    emptyMessage: 'h-treeselect-empty-message'
};

@Injectable()
export class TreeSelectStyle extends BaseStyle {
    name = 'treeselect';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * TreeSelect is a form component to choose from hierarchical data.
 *
 * [Live Demo](https://www.primeng.org/treeselect/)
 *
 * @module treeselectstyle
 *
 */
export enum TreeSelectClasses {
    /**
     * Class name of the root element
     */
    root = 'h-treeselect',
    /**
     * Class name of the label container element
     */
    labelContainer = 'h-treeselect-label-container',
    /**
     * Class name of the label element
     */
    label = 'h-treeselect-label',
    /**
     * Class name of the chip item element
     */
    chipItem = 'h-treeselect-chip-item',
    /**
     * Class name of the clear icon element
     */
    clearIcon = 'h-treeselect-clear-icon',
    /**
     * Class name of the chip element
     */
    pcChip = 'h-treeselect-chip',
    /**
     * Class name of the dropdown element
     */
    dropdown = 'h-treeselect-dropdown',
    /**
     * Class name of the dropdown icon element
     */
    dropdownIcon = 'h-treeselect-dropdown-icon',
    /**
     * Class name of the panel element
     */
    panel = 'h-treeselect-overlay',
    /**
     * Class name of the tree container element
     */
    treeContainer = 'h-treeselect-tree-container',
    /**
     * Class name of the empty message element
     */
    emptyMessage = 'h-treeselect-empty-message'
}

export interface TreeSelectStyle extends BaseStyle {}
