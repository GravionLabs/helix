import { Injectable } from '@angular/core';
import { style as autocomplete_style } from './autocomplete.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
${autocomplete_style}

/* For Helix */
h-autoComplete.ng-invalid.ng-dirty .h-autocomplete-input,
h-autoComplete.ng-invalid.ng-dirty .h-autocomplete-input-multiple,
h-auto-complete.ng-invalid.ng-dirty .h-autocomplete-input,
h-auto-complete.ng-invalid.ng-dirty .h-autocomplete-input-multiple h-autocomplete.ng-invalid.ng-dirty .h-autocomplete-input,
h-autocomplete.ng-invalid.ng-dirty .h-autocomplete-input-multiple {
    border-color: dt('autocomplete.invalid.border.color');
}

h-autoComplete.ng-invalid.ng-dirty .h-autocomplete-input:enabled:focus,
h-autoComplete.ng-invalid.ng-dirty:not(.h-disabled).h-focus .h-autocomplete-input-multiple,
h-auto-complete.ng-invalid.ng-dirty .h-autocomplete-input:enabled:focus,
h-auto-complete.ng-invalid.ng-dirty:not(.h-disabled).h-focus .h-autocomplete-input-multiple,
h-autocomplete.ng-invalid.ng-dirty .h-autocomplete-input:enabled:focus,
h-autocomplete.ng-invalid.ng-dirty:not(.h-disabled).h-focus .h-autocomplete-input-multiple {
    border-color: dt('autocomplete.focus.border.color');
}

h-autoComplete.ng-invalid.ng-dirty .h-autocomplete-input-chip input::placeholder,
h-auto-complete.ng-invalid.ng-dirty .h-autocomplete-input-chip input::placeholder,
h-autocomplete.ng-invalid.ng-dirty .h-autocomplete-input-chip input::placeholder {
    color: dt('autocomplete.invalid.placeholder.color');
}

h-autoComplete.ng-invalid.ng-dirty .h-autocomplete-input::placeholder,
h-auto-complete.ng-invalid.ng-dirty .h-autocomplete-input::placeholder,
h-autocomplete.ng-invalid.ng-dirty .h-autocomplete-input::placeholder {
    color: dt('autocomplete.invalid.placeholder.color');
}
`;

const inlineStyles = {
    root: { position: 'relative' }
};

const classes = {
    root: ({ instance }) => [
        'h-autocomplete h-component h-inputwrapper',
        {
            'h-invalid': instance.invalid(),
            'h-focus': instance.focused,
            'h-inputwrapper-filled': instance.$filled(),
            'h-inputwrapper-focus': (instance.focused && !instance.$disabled()) || instance.autofocus || instance.overlayVisible,
            'h-autocomplete-open': instance.overlayVisible,
            'h-autocomplete-clearable': instance.showClear && !instance.$disabled(),
            'h-autocomplete-fluid': instance.hasFluid
        }
    ],
    pcInputText: 'h-autocomplete-input',
    inputMultiple: ({ instance }) => [
        'h-autocomplete-input-multiple',
        {
            'h-disabled': instance.$disabled(),
            'h-variant-filled': instance.$variant() === 'filled'
        }
    ],
    chipItem: ({ instance, i }) => [
        'h-autocomplete-chip-item',
        {
            'h-focus': instance.focusedMultipleOptionIndex() === i
        }
    ],
    pcChip: 'h-autocomplete-chip',
    chipIcon: 'h-autocomplete-chip-icon',
    inputChip: 'h-autocomplete-input-chip',
    loader: 'h-autocomplete-loader',
    dropdown: 'h-autocomplete-dropdown',
    overlay: ({ instance }) => ['h-autocomplete-overlay h-component-overlay h-component', { 'h-input-filled': instance.$variant() === 'filled', 'h-ripple-disabled': instance.config.ripple() === false }],
    listContainer: 'h-autocomplete-list-container',
    list: 'h-autocomplete-list',
    optionGroup: 'h-autocomplete-option-group',
    option: ({ instance, option, i, scrollerOptions }) => ({
        'h-autocomplete-option': true,
        'h-autocomplete-option-selected': instance.isSelected(option),
        'h-focus': instance.focusedOptionIndex() === instance.getOptionIndex(i, scrollerOptions),
        'h-disabled': instance.isOptionDisabled(option)
    }),
    emptyMessage: 'h-autocomplete-empty-message',
    clearIcon: 'h-autocomplete-clear-icon'
};

@Injectable()
export class AutoCompleteStyle extends BaseStyle {
    name = 'autocomplete';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * AutoComplete is an input component that provides real-time suggestions while being typed.
 *
 * [Live Demo](https://www.primeng.org/autocomplete/)
 *
 * @module autocompletestyle
 *
 */
export enum AutoCompleteClasses {
    /**
     * Class name of the root element
     */
    root = 'h-autocomplete',
    /**
     * Class name of the input element
     */
    pcInputText = 'h-autocomplete-input',
    /**
     * Class name of the input multiple element
     */
    inputMultiple = 'h-autocomplete-input-multiple',
    /**
     * Class name of the chip item element
     */
    chipItem = 'h-autocomplete-chip-item',
    /**
     * Class name of the chip element
     */
    pcChip = 'h-autocomplete-chip',
    /**
     * Class name of the chip icon element
     */
    chipIcon = 'h-autocomplete-chip-icon',
    /**
     * Class name of the input chip element
     */
    inputChip = 'h-autocomplete-input-chip',
    /**
     * Class name of the loader element
     */
    loader = 'h-autocomplete-loader',
    /**
     * Class name of the dropdown element
     */
    dropdown = 'h-autocomplete-dropdown',
    /**
     * Class name of the panel element
     */
    panel = 'h-autocomplete-overlay',
    /**
     * Class name of the list element
     */
    list = 'h-autocomplete-list',
    /**
     * Class name of the option group element
     */
    optionGroup = 'h-autocomplete-option-group',
    /**
     * Class name of the option element
     */
    option = 'h-autocomplete-option',
    /**
     * Class name of the empty message element
     */
    emptyMessage = 'h-autocomplete-empty-message',
    /**
     * Class name of the clear icon
     */
    clearIcon = 'h-autocomplete-clear-icon'
}

export interface AutoCompleteStyle extends BaseStyle {}
