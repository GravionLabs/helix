import { Injectable } from '@angular/core';
import { style } from './picklist.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: () => ['h-picklist h-component'],
    sourceControls: 'h-picklist-controls h-picklist-source-controls',
    sourceListContainer: 'h-picklist-list-container h-picklist-source-list-container',
    transferControls: 'h-picklist-controls h-picklist-transfer-controls',
    targetListContainer: 'h-picklist-list-container h-picklist-target-list-container',
    targetControls: 'h-picklist-controls h-picklist-target-controls'
};

@Injectable()
export class PickListStyle extends BaseStyle {
    name = 'picklist';

    style = style;

    classes = classes;
}

/**
 *
 * PickList is used to reorder items between different lists.
 *
 * [Live Demo](https://www.primeng.org/picklist)
 *
 * @module pickliststyle
 *
 */

export enum PickListClasses {
    /**
     * Class name of the root element
     */
    root = 'h-picklist',
    /**
     * Class name of the source controls element
     */
    sourceControls = 'h-picklist-source-controls',
    /**
     * Class name of the source list container element
     */
    sourceListContainer = 'h-picklist-source-list-container',
    /**
     * Class name of the transfer controls element
     */
    transferControls = 'h-picklist-transfer-controls',
    /**
     * Class name of the target list container element
     */
    targetListContainer = 'h-picklist-target-list-container',
    /**
     * Class name of the target controls element
     */
    targetControls = 'h-picklist-target-controls'
}

export interface PickListStyle extends BaseStyle {}
