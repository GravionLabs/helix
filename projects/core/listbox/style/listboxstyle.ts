import { Injectable } from '@angular/core';
import { style as listbox_style } from './listbox.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    ${listbox_style}

    /* For Helix */
    .h-listbox.ng-invalid.ng-dirty {
        border-color: dt('listbox.invalid.border.color');
    }

    .h-listbox-header {
        display: flex;
        align-items: center;
    }

    .h-listbox-header > .h-iconfield {
        flex-grow: 1;
    }

    .h-listbox-list-container {
        height: 100%;
    }

    /* CDK Drag & Drop styles */
    .h-listbox-option.cdk-drag-preview {
        background: dt('listbox.background');
    }

    .h-listbox-dragging .h-listbox-option:not(.cdk-drag-preview) {
        pointer-events: none !important;
    }

    .h-listbox-dragging .h-listbox-option:not(.cdk-drag-preview):hover {
        background: inherit !important;
        color: inherit !important;
    }

    .cdk-drag-placeholder {
        pointer-events: none;
    }
`;

const classes = {
    root: ({ instance }) => [
        'h-listbox h-component',
        {
            'h-listbox-striped': instance.striped(),
            'h-disabled': instance.$disabled(),
            'h-invalid': instance.invalid(),
            'h-listbox-fluid': instance.fluid(),
            'h-listbox-dragging': instance.isDragging()
        }
    ],
    header: 'h-listbox-header',
    pcFilter: 'h-listbox-filter',
    listContainer: 'h-listbox-list-container',
    list: 'h-listbox-list',
    optionGroup: 'h-listbox-option-group',
    option: ({ instance, option, i, scrollerOptions }) => [
        'h-listbox-option',
        {
            'h-listbox-option-selected': instance.isSelected(option) && instance.highlightOnSelect(),
            'h-focus': instance.focusedOptionIndex() === instance.getOptionIndex(i, scrollerOptions),
            'h-disabled': instance.isOptionDisabled(option)
        }
    ],
    optionCheckIcon: 'h-listbox-option-check-icon',
    optionBlankIcon: 'h-listbox-option-blank-icon',
    emptyMessage: 'h-listbox-empty-message'
};

@Injectable()
export class ListBoxStyle extends BaseStyle {
    name = 'listbox';

    style = style;

    classes = classes;
}

/**
 *
 * ListBox is used to select one or more values from a list of items.
 *
 * [Live Demo](https://www.primeng.org/listbox/)
 *
 * @module listboxstyle
 *
 */
export enum ListboxClasses {
    /**
     * Class name of the root element
     */
    root = 'h-listbox',
    /**
     * Class name of the header element
     */
    header = 'h-listbox-header',
    /**
     * Class name of the filter element
     */
    pcFilter = 'h-listbox-filter',
    /**
     * Class name of the list container element
     */
    listContainer = 'h-listbox-list-container',
    /**
     * Class name of the list element
     */
    list = 'h-listbox-list',
    /**
     * Class name of the option group element
     */
    optionGroup = 'h-listbox-option-group',
    /**
     * Class name of the option element
     */
    option = 'h-listbox-option',
    /**
     * Class name of the option check icon element
     */
    optionCheckIcon = 'h-listbox-option-check-icon',
    /**
     * Class name of the option blank icon element
     */
    optionBlankIcon = 'h-listbox-option-blank-icon',
    /**
     * Class name of the empty message element
     */
    emptyMessage = 'h-listbox-empty-message'
}

export interface ListboxStyle extends BaseStyle {}
