import { Injectable } from '@angular/core';
import { style as cascadeselect_style } from './cascadeselect.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    ${cascadeselect_style}

    /* For Helix */
    .h-cascadeselect.ng-invalid.ng-dirty:not(.ng-untouched):not(.ng-pristine) {
        border-color: dt('cascadeselect.invalid.border.color');
    }

    .h-cascadeselect.ng-invalid.ng-dirty:not(.ng-untouched):not(.ng-pristine) .h-cascadeselect-label.h-placeholder {
        color: dt('cascadeselect.invalid.placeholder.color');
    }
`;
const inlineStyles = {
    root: ({ instance }) => ({ position: instance.$appendTo() === 'self' ? 'relative' : undefined })
};

const classes = {
    root: ({ instance }) => [
        'h-cascadeselect h-component h-inputwrapper',
        {
            'h-cascadeselect h-component h-inputwrapper': true,
            'h-cascadeselect-clearable': instance.showClear() && !instance.$disabled(),
            'h-cascadeselect-mobile': instance.queryMatches(),
            'h-disabled': instance.$disabled(),
            'h-invalid': instance.invalid(),
            'h-focus': instance.focused,
            'h-inputwrapper-filled': instance.modelValue(),
            'h-variant-filled': instance.$variant() === 'filled',
            'h-inputwrapper-focus': instance.focused || instance.overlayVisible,
            'h-cascadeselect-open': instance.overlayVisible,
            'h-cascadeselect-fluid': instance.hasFluid,
            'h-cascadeselect-sm h-inputfield-sm': instance.size() === 'small',
            'h-cascadeselect-lg h-inputfield-lg': instance.size() === 'large'
        }
    ],
    label: ({ instance }) => [
        'h-cascadeselect-label',
        {
            'h-placeholder': instance.label() === instance.placeholder(),
            'h-cascadeselect-label-empty': !instance.value && (instance.label() === 'h-emptylabel' || instance.label().length === 0)
        }
    ],
    clearIcon: 'h-cascadeselect-clear-icon',
    dropdown: 'h-cascadeselect-dropdown',
    loadingIcon: 'h-cascadeselect-loading-icon',
    dropdownIcon: 'h-cascadeselect-dropdown-icon',
    overlay: ({ instance }) => [
        'h-cascadeselect-overlay h-component-overlay h-component',
        {
            'h-cascadeselect-mobile-active': instance.queryMatches()
        }
    ],
    listContainer: 'h-cascadeselect-list-container',
    list: 'h-cascadeselect-list',
    option: ({ instance, processedOption }) => [
        'h-cascadeselect-option',
        {
            'h-cascadeselect-option-group': instance.isOptionGroup(processedOption),
            'h-cascadeselect-option-active': instance.isOptionActive(processedOption),
            'h-cascadeselect-option-selected': instance.isOptionSelected(processedOption),
            'h-focus': instance.isOptionFocused(processedOption),
            'h-disabled': instance.isOptionDisabled(processedOption)
        }
    ],
    optionContent: 'h-cascadeselect-option-content',
    optionText: 'h-cascadeselect-option-text',
    groupIcon: 'h-cascadeselect-group-icon',
    optionList: 'h-cascadeselect-list h-cascadeselect-overlay h-cascadeselect-option-list'
};

@Injectable()
export class CascadeSelectStyle extends BaseStyle {
    name = 'cascadeselect';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * CascadeSelect is a form component to select a value from a nested structure of options.
 *
 * [Live Demo](https://www.primeng.org/cascadeselect/)
 *
 * @module cascadeselectstyle
 *
 */
export enum CascadeSelectClasses {
    /**
     * Class name of the root element
     */
    root = 'h-cascadeselect',
    /**
     * Class name of the label element
     */
    label = 'h-cascadeselect-label',
    /**
     * Class name of the dropdown element
     */
    dropdown = 'h-cascadeselect-dropdown',
    /**
     * Class name of the loading icon element
     */
    loadingIcon = 'h-cascadeselect-loading-icon',
    /**
     * Class name of the dropdown icon element
     */
    clearIcon = 'h-cascadeselect-clear-icon',
    /**
     * Class name of the dropdown icon element
     */
    dropdownIcon = 'h-cascadeselect-dropdown-icon',
    /**
     * Class name of the overlay element
     */
    overlay = 'h-cascadeselect-overlay',
    /**
     * Class name of the list container element
     */
    listContainer = 'h-cascadeselect-list-container',
    /**
     * Class name of the list element
     */
    list = 'h-cascadeselect-list',
    /**
     * Class name of the item element
     */
    item = 'h-cascadeselect-item',
    /**
     * Class name of the item content element
     */
    itemContent = 'h-cascadeselect-item-content',
    /**
     * Class name of the item text element
     */
    itemText = 'h-cascadeselect-item-text',
    /**
     * Class name of the group icon element
     */
    groupIcon = 'h-cascadeselect-group-icon',
    /**
     * Class name of the item list element
     */
    itemList = 'h-cascadeselect-item-list'
}

export interface CascadeSelectStyle extends BaseStyle {}
