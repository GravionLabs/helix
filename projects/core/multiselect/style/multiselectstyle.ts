import { Injectable } from '@angular/core';
import { style as multiselect_style } from './multiselect.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    ${multiselect_style}

    /* For Helix */
   .h-multiselect.ng-invalid.ng-dirty {
        border-color: dt('multiselect.invalid.border.color');
    }
    h-multiSelect.ng-invalid.ng-dirty .h-multiselect-label.h-placeholder,
    h-multi-select.ng-invalid.ng-dirty .h-multiselect-label.h-placeholder,
    h-multiselect.ng-invalid.ng-dirty .h-multiselect-label.h-placeholder {
        color: dt('multiselect.invalid.placeholder.color');
    }
`;

const inlineStyles = {
    root: ({ instance }) => ({ position: instance.$appendTo() === 'self' ? 'relative' : undefined })
};

const classes = {
    root: ({ instance }) => [
        'h-multiselect h-component h-inputwrapper',
        {
            'h-multiselect h-component h-inputwrapper': true,
            'h-multiselect-display-chip': instance.display === 'chip',
            'h-disabled': instance.$disabled(),
            'h-invalid': instance.invalid(),
            'h-variant-filled': instance.$variant() === 'filled',
            'h-focus': instance.focused,
            'h-inputwrapper-filled': instance.$filled(),
            'h-inputwrapper-focus': instance.focused || instance.overlayVisible,
            'h-multiselect-open': instance.overlayVisible,
            'h-multiselect-fluid': instance.hasFluid,
            'h-multiselect-sm h-inputfield-sm': instance.size() === 'small',
            'h-multiselect-lg h-inputfield-lg': instance.size() === 'large'
        }
    ],
    labelContainer: 'h-multiselect-label-container',
    label: ({ instance }) => ({
        'h-multiselect-label': true,
        'h-placeholder': instance.label() === instance.placeholder(),
        'h-multiselect-label-empty': !instance.placeholder() && !instance.defaultLabel && (!instance.modelValue() || instance.modelValue().length === 0)
    }),
    chipItem: 'h-multiselect-chip-item',
    pcChip: 'h-multiselect-chip',
    chipIcon: 'h-multiselect-chip-icon',
    dropdown: 'h-multiselect-dropdown',
    loadingIcon: 'h-multiselect-loading-icon',
    dropdownIcon: 'h-multiselect-dropdown-icon',
    overlay: 'h-multiselect-overlay h-component-overlay h-component',
    header: 'h-multiselect-header',
    pcFilterContainer: 'h-multiselect-filter-container',
    pcFilter: 'h-multiselect-filter',
    listContainer: 'h-multiselect-list-container',
    list: 'h-multiselect-list',
    optionGroup: 'h-multiselect-option-group',
    option: ({ instance }) => ({
        'h-multiselect-option': true,
        'h-multiselect-option-selected': instance.selected && instance.highlightOnSelect,
        'h-disabled': instance.disabled,
        'h-focus': instance.focused
    }),
    emptyMessage: 'h-multiselect-empty-message',
    clearIcon: 'h-multiselect-clear-icon'
};

@Injectable()
export class MultiSelectStyle extends BaseStyle {
    name = 'multiselect';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * MultiSelect is used to select multiple items from a collection.
 *
 * [Live Demo](https://www.primeng.org/multiselect/)
 *
 * @module multiselectstyle
 *
 */
export enum MultiSelectClasses {
    /**
     * Class name of the root element
     */
    root = 'h-multiselect',
    /**
     * Class name of the label container element
     */
    labelContainer = 'h-multiselect-label-container',
    /**
     * Class name of the label element
     */
    label = 'h-multiselect-label',
    /**
     * Class name of the chip item element
     */
    chipItem = 'h-multiselect-chip-item',
    /**
     * Class name of the chip element
     */
    pcChip = 'h-multiselect-chip',
    /**
     * Class name of the chip icon element
     */
    chipIcon = 'h-multiselect-chip-icon',
    /**
     * Class name of the dropdown element
     */
    dropdown = 'h-multiselect-dropdown',
    /**
     * Class name of the loading icon element
     */
    loadingIcon = 'h-multiselect-loading-icon',
    /**
     * Class name of the dropdown icon element
     */
    dropdownIcon = 'h-multiselect-dropdown-icon',
    /**
     * Class name of the overlay element
     */
    overlay = 'h-multiselect-overlay',
    /**
     * Class name of the header element
     */
    header = 'h-multiselect-header',
    /**
     * Class name of the filter container element
     */
    pcFilterContainer = 'h-multiselect-filter-container',
    /**
     * Class name of the filter element
     */
    pcFilter = 'h-multiselect-filter',
    /**
     * Class name of the list container element
     */
    listContainer = 'h-multiselect-list-container',
    /**
     * Class name of the list element
     */
    list = 'h-multiselect-list',
    /**
     * Class name of the option group element
     */
    optionGroup = 'h-multiselect-option-group',
    /**
     * Class name of the option element
     */
    option = 'h-multiselect-option',
    /**
     * Class name of the empty message element
     */
    emptyMessage = 'h-multiselect-empty-message',
    /**
     * Class name of the clear icon
     */
    clearIcon = 'h-autocomplete-clear-icon'
}

export interface MultiSelectStyle extends BaseStyle {}
