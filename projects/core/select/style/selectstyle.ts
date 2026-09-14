import { Injectable } from '@angular/core';
import { style as select_style } from './select.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    ${select_style}

    /* For Helix */
    .h-select-label.h-placeholder {
        color: dt('select.placeholder.color');
    }

    .h-select.ng-invalid.ng-dirty {
        border-color: dt('select.invalid.border.color');
    }

    .h-dropdown.ng-invalid.ng-dirty .h-dropdown-label.h-placeholder,
    .h-select.ng-invalid.ng-dirty .h-select-label.h-placeholder {
        color: dt('select.invalid.placeholder.color');
    }
`;

const classes = {
    root: ({ instance }) => [
        'h-select h-component h-inputwrapper',
        {
            'h-disabled': instance.$disabled(),
            'h-variant-filled': instance.$variant() === 'filled',
            'h-focus': instance.focused,
            'h-invalid': instance.invalid(),
            'h-inputwrapper-filled': instance.$filled(),
            'h-inputwrapper-focus': instance.focused || instance.overlayVisible,
            'h-select-open': instance.overlayVisible,
            'h-select-fluid': instance.hasFluid,
            'h-select-sm h-inputfield-sm': instance.size() === 'small',
            'h-select-lg h-inputfield-lg': instance.size() === 'large'
        }
    ],
    label: ({ instance }) => [
        'h-select-label',
        {
            'h-placeholder': instance.placeholder() && instance.label() === instance.placeholder(),
            'h-select-label-empty': !instance.editable && !instance.selectedItemTemplate && (instance.label() === undefined || instance.label() === null || instance.label() === 'h-emptylabel' || instance.label().length === 0)
        }
    ],
    clearIcon: 'h-select-clear-icon',
    dropdown: 'h-select-dropdown',
    loadingIcon: 'h-select-loading-icon',
    dropdownIcon: 'h-select-dropdown-icon',
    overlay: 'h-select-overlay h-component-overlay h-component',
    header: 'h-select-header',
    pcFilter: 'h-select-filter',
    listContainer: 'h-select-list-container',
    list: 'h-select-list',
    optionGroup: 'h-select-option-group',
    optionGroupLabel: 'h-select-option-group-label',
    option: ({ instance }) => [
        'h-select-option',
        {
            'h-select-option-selected': instance.selected && !instance.checkmark,
            'h-disabled': instance.disabled,
            'h-focus': instance.focused
        }
    ],
    optionLabel: 'h-select-option-label',
    optionCheckIcon: 'h-select-option-check-icon',
    optionBlankIcon: 'h-select-option-blank-icon',
    emptyMessage: 'h-select-empty-message'
};

@Injectable()
export class SelectStyle extends BaseStyle {
    name = 'select';

    style = style;

    classes = classes;
}

/**
 *
 * Select also known as Select, is used to choose an item from a collection of options.
 *
 * [Live Demo](https://www.primeng.org/select/)
 *
 * @module selectstyle
 *
 */
export enum SelectClasses {
    /**
     * Class name of the root element
     */
    root = 'h-select',
    /**
     * Class name of the label element
     */
    label = 'h-select-label',
    /**
     * Class name of the clear icon element
     */
    clearIcon = 'h-select-clear-icon',
    /**
     * Class name of the dropdown element
     */
    dropdown = 'h-select-dropdown',
    /**
     * Class name of the loadingicon element
     */
    loadingIcon = 'h-select-loading-icon',
    /**
     * Class name of the dropdown icon element
     */
    dropdownIcon = 'h-select-dropdown-icon',
    /**
     * Class name of the overlay element
     */
    overlay = 'h-select-overlay',
    /**
     * Class name of the header element
     */
    header = 'h-select-header',
    /**
     * Class name of the filter element
     */
    pcFilter = 'h-select-filter',
    /**
     * Class name of the list container element
     */
    listContainer = 'h-select-list-container',
    /**
     * Class name of the list element
     */
    list = 'h-select-list',
    /**
     * Class name of the option group element
     */
    optionGroup = 'h-select-option-group',
    /**
     * Class name of the option group label element
     */
    optionGroupLabel = 'h-select-option-group-label',
    /**
     * Class name of the option element
     */
    option = 'h-select-option',
    /**
     * Class name of the option label element
     */
    optionLabel = 'h-select-option-label',
    /**
     * Class name of the option check icon element
     */
    optionCheckIcon = 'h-select-option-check-icon',
    /**
     * Class name of the option blank icon element
     */
    optionBlankIcon = 'h-select-option-blank-icon',
    /**
     * Class name of the empty message element
     */
    emptyMessage = 'h-select-empty-message'
}

export interface SelectStyle extends BaseStyle {}
