import { Injectable } from '@angular/core';
import { style } from './breadcrumb.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: () => ['h-breadcrumb h-component'],
    list: 'h-breadcrumb-list',
    homeItem: 'h-breadcrumb-home-item',
    separator: 'h-breadcrumb-separator',
    item: ({ menuitem }) => ['h-breadcrumb-item', { 'h-disabled': menuitem.disabled }],
    itemLink: 'h-breadcrumb-item-link',
    itemIcon: 'h-breadcrumb-item-icon',
    itemLabel: 'h-breadcrumb-item-label'
};

@Injectable()
export class BreadCrumbStyle extends BaseStyle {
    name = 'breadcrumb';

    style = style;

    classes = classes;
}

/**
 *
 * Breadcrumb provides contextual information about page hierarchy.
 *
 * [Live Demo](https://www.primeng.org/breadcrumb/)
 *
 * @module breadcrumbstyle
 *
 */
export enum BreadcrumbClasses {
    /**
     * Class name of the root element
     */
    root = 'h-breadcrumb',
    /**
     * Class name of the list element
     */
    list = 'h-breadcrumb-list',
    /**
     * Class name of the home item element
     */
    homeItem = 'h-breadcrumb-home-item',
    /**
     * Class name of the separator element
     */
    separator = 'h-breadcrumb-separator',
    /**
     * Class name of the item element
     */
    item = 'h-breadcrumb-item',
    /**
     * Class name of the item link element
     */
    itemLink = 'h-breadcrumb-item-link',
    /**
     * Class name of the item icon element
     */
    itemIcon = 'h-breadcrumb-item-icon',
    /**
     * Class name of the item label element
     */
    itemLabel = 'h-breadcrumb-item-label'
}

export interface BreadcrumbStyle extends BaseStyle {}
