import { Injectable } from '@angular/core';
import { style } from './dataview.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => [
        'h-dataview h-component',
        {
            'h-dataview-list': instance.layout() === 'list',
            'h-dataview-grid': instance.layout() === 'grid'
        }
    ],
    header: 'h-dataview-header',
    loading: 'h-dataview-loading',
    loadingOverlay: 'h-dataview-loading-overlay h-overlay-mask',
    loadingIcon: 'h-dataview-loading-icon',
    pcPaginator: ({ position }) => 'h-dataview-paginator-' + position,
    content: 'h-dataview-content',
    emptyMessage: 'h-dataview-empty-message',
    footer: 'h-dataview-footer'
};

@Injectable()
export class DataViewStyle extends BaseStyle {
    name = 'dataview';

    style = style;

    classes = classes;
}

/**
 *
 * DataView displays data in grid or list layout with pagination and sorting features.
 *
 * [Live Demo](https://www.primeng.org/dataview/)
 *
 * @module dataviewstyle
 *
 */
export enum DataViewClasses {
    /**
     * Class name of the root element
     */
    root = 'h-dataview',
    /**
     * Class name of the header element
     */
    header = 'h-dataview-header',
    /**
     * Class name of the loading element
     */
    loading = 'h-dataview-loading',
    /**
     * Class name of the loading overlay element
     */
    loadingOverlay = 'h-dataview-loading-overlay',
    /**
     * Class name of the loading icon element
     */
    loadingIcon = 'h-dataview-loading-icon',
    /**
     * Class name of the paginator element
     */
    pcPaginator = 'h-dataview-paginator-[position]',
    /**
     * Class name of the content element
     */
    content = 'h-dataview-content',
    /**
     * Class name of the empty message element
     */
    emptyMessage = 'h-dataview-empty-message',
    /**
     * Class name of the footer element
     */
    footer = 'h-dataview-footer'
}

export interface DataViewStyle extends BaseStyle {}
