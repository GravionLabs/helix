import { Injectable } from '@angular/core';
import { style } from './orderlist.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const theme = /*css*/ `
    ${style}

    /* For Helix */
    .h-orderlist-controls-right .h-orderlist-controls {
        order: 2;
    }
`;

const classes = {
    root: ({ instance }) => ['h-orderlist h-component', { 'h-orderlist-controls-left': instance.controlsPosition() === 'left', 'h-orderlist-controls-right': instance.controlsPosition() === 'right' }],
    controls: 'h-orderlist-controls'
};

@Injectable()
export class OrderListStyle extends BaseStyle {
    name = 'orderlist';

    style = theme;

    classes = classes;
}

/**
 *
 * OrderList is used to maneged the order of a collection.
 *
 * [Live Demo](https://primeng.org/orderlist)
 *
 * @module orderliststyle
 *
 */

export enum OrderListClasses {
    /**
     * Class name of the root element
     */
    root = 'h-orderlist',
    /**
     * Class name of the controls element
     */
    controls = 'h-orderlist-controls'
}

export interface OrderListStyle extends BaseStyle {}
