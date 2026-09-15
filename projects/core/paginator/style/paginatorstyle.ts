import { Injectable } from '@angular/core';
import { style } from './paginator.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    paginator: ({ instance }) => ['h-paginator h-component'],
    content: 'h-paginator-content',
    contentStart: 'h-paginator-content-start',
    contentEnd: 'h-paginator-content-end',
    first: ({ instance }) => [
        'h-paginator-first',
        {
            'h-disabled': instance.isFirstPage() || instance.empty()
        }
    ],
    firstIcon: 'h-paginator-first-icon',
    prev: ({ instance }) => [
        'h-paginator-prev',
        {
            'h-disabled': instance.isFirstPage() || instance.empty()
        }
    ],
    prevIcon: 'h-paginator-prev-icon',
    next: ({ instance }) => [
        'h-paginator-next',
        {
            'h-disabled': instance.isLastPage() || instance.empty()
        }
    ],
    nextIcon: 'h-paginator-next-icon',
    last: ({ instance }) => [
        'h-paginator-last',
        {
            'h-disabled': instance.isLastPage() || instance.empty()
        }
    ],
    lastIcon: 'h-paginator-last-icon',
    pages: 'h-paginator-pages',
    page: ({ instance, pageLink }) => [
        'h-paginator-page',
        {
            'h-paginator-page-selected': pageLink - 1 == instance.getPage()
        }
    ],
    current: 'h-paginator-current',
    pcRowPerPageDropdown: 'h-paginator-rpp-dropdown',
    pcJumpToPageDropdown: 'h-paginator-jtp-dropdown',
    pcJumpToPageInput: 'h-paginator-jtp-input'
};

@Injectable()
export class PaginatorStyle extends BaseStyle {
    name = 'paginator';

    style = style;

    classes = classes;
}

/**
 *
 * Paginator is a generic component to display content in paged format.
 *
 * [Live Demo](https://www.primeng.org/paginator)
 *
 * @module paginatorstyle
 *
 */

export enum PaginatorClasses {
    /**
     * Class name of the paginator element
     */
    paginator = 'h-paginator',
    /**
     * Class name of the content start element
     */
    contentStart = 'h-paginator-content-start',
    /**
     * Class name of the content end element
     */
    contentEnd = 'h-paginator-content-end',
    /**
     * Class name of the first element
     */
    first = 'h-paginator-first',
    /**
     * Class name of the first icon element
     */
    firstIcon = 'h-paginator-first-icon',
    /**
     * Class name of the prev element
     */
    prev = 'h-paginator-prev',
    /**
     * Class name of the prev icon element
     */
    prevIcon = 'h-paginator-prev-icon',
    /**
     * Class name of the next element
     */
    next = 'h-paginator-next',
    /**
     * Class name of the next icon element
     */
    nextIcon = 'h-paginator-next-icon',
    /**
     * Class name of the last element
     */
    last = 'h-paginator-last',
    /**
     * Class name of the last icon element
     */
    lastIcon = 'h-paginator-last-icon',
    /**
     * Class name of the pages element
     */
    pages = 'h-paginator-pages',
    /**
     * Class name of the page element
     */
    page = 'h-paginator-page',
    /**
     * Class name of the current element
     */
    current = 'h-paginator-current',
    /**
     * Class name of the row per page dropdown element
     */
    pcRowPerPageDropdown = 'h-paginator-rpp-dropdown',
    /**
     * Class name of the jump to page dropdown element
     */
    pcJumpToPageDropdown = 'h-paginator-jtp-dropdown',
    /**
     * Class name of the jump to page input element
     */
    pcJumpToPageInput = 'h-paginator-jtp-input'
}

export interface PaginatorStyle extends BaseStyle {}
