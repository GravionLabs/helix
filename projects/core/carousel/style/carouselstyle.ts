import { Injectable } from '@angular/core';
import { style } from './carousel.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => [
        'h-carousel h-component',
        {
            'h-carousel-vertical': instance.isVertical(),
            'h-carousel-horizontal': !instance.isVertical()
        }
    ],
    header: 'h-carousel-header',
    contentContainer: 'h-carousel-content-container',
    content: 'h-carousel-content',
    pcPrevButton: ({ instance }) => [
        'h-carousel-prev-button',
        {
            'h-disabled': instance.isBackwardNavDisabled()
        }
    ],
    viewport: 'h-carousel-viewport',
    itemList: 'h-carousel-item-list',
    itemClone: ({ instance, index }) => [
        'h-carousel-item h-carousel-item-clone',
        {
            'h-carousel-item-active': instance.totalShiftedItems * -1 === instance.value().length,
            'h-carousel-item-start': 0 === index,
            'h-carousel-item-end': instance.clonedItemsForStarting.length - 1 === index
        }
    ],
    item: ({ instance, index }) => [
        'h-carousel-item',
        {
            'h-carousel-item-active': instance.firstIndex() <= index && instance.lastIndex() >= index,
            'h-carousel-item-start': instance.firstIndex() === index,
            'h-carousel-item-end': instance.lastIndex() === index
        }
    ],
    pcNextButton: ({ instance }) => [
        'h-carousel-next-button',
        {
            'h-disabled': instance.isForwardNavDisabled()
        }
    ],
    indicatorList: ({ instance }) => ['h-carousel-indicator-list', instance.indicatorsContentClass()],
    indicator: ({ instance, index }) => [
        'h-carousel-indicator',
        {
            'h-carousel-indicator-active': instance._page === index
        }
    ],
    indicatorButton: ({ instance }) => ['h-carousel-indicator-button', instance.indicatorStyleClass()],
    footer: 'h-carousel-footer'
};

@Injectable()
export class CarouselStyle extends BaseStyle {
    name = 'carousel';

    style = style;

    classes = classes;
}

/**
 *
 * Carousel is a content slider featuring various customization options.
 *
 * [Live Demo](https://www.primeng.org/carousel/)
 *
 * @module carouselstyle
 *
 */
export enum CarouselClasses {
    /**
     * Class name of the root element
     */
    root = 'h-carousel',
    /**
     * Class name of the header element
     */
    header = 'h-carousel-header',
    /**
     * Class name of the content container element
     */
    contentContainer = 'h-carousel-content-container',
    /**
     * Class name of the content element
     */
    content = 'h-carousel-content',
    /**
     * Class name of the previous button element
     */
    pcPrevButton = 'h-carousel-prev-button',
    /**
     * Class name of the viewport element
     */
    viewport = 'h-carousel-viewport',
    /**
     * Class name of the item list element
     */
    itemList = 'h-carousel-item-list',
    /**
     * Class name of the item clone element
     */
    itemClone = 'h-carousel-item-clone',
    /**
     * Class name of the item element
     */
    item = 'h-carousel-item',
    /**
     * Class name of the next button element
     */
    pcNextButton = 'h-carousel-next-button',
    /**
     * Class name of the indicator list element
     */
    indicatorList = 'h-carousel-indicator-list',
    /**
     * Class name of the indicator element
     */
    indicator = 'h-carousel-indicator',
    /**
     * Class name of the indicator button element
     */
    indicatorButton = 'h-carousel-indicator-button',
    /**
     * Class name of the footer element
     */
    footer = 'h-carousel-footer'
}

export interface CarouselStyle extends BaseStyle {}
