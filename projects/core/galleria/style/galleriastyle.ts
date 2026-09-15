import { Injectable } from '@angular/core';
import { style } from './galleria.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    mask: 'h-galleria-mask h-overlay-mask',
    root: ({ instance }) => {
        const thumbnailsPosClass = instance.galleria.showThumbnails && instance.getPositionClass('h-galleria-thumbnails', instance.galleria.thumbnailsPosition);
        const indicatorPosClass = instance.galleria.showIndicators && instance.getPositionClass('h-galleria-indicators', instance.galleria.indicatorsPosition);

        return [
            'h-galleria h-component',
            {
                'h-galleria-fullscreen': instance.galleria.fullScreen(),
                'h-galleria-inset-indicators': instance.galleria.showIndicatorsOnItem,
                'h-galleria-hover-navigators': instance.galleria.showItemNavigatorsOnHover && !instance.galleria.fullScreen()
            },
            thumbnailsPosClass,
            indicatorPosClass
        ];
    },
    closeButton: 'h-galleria-close-button',
    closeIcon: 'h-galleria-close-icon',
    header: 'h-galleria-header',
    content: 'h-galleria-content',
    footer: 'h-galleria-footer',
    itemsContainer: 'h-galleria-items-container',
    items: 'h-galleria-items',
    prevButton: ({ instance }) => [
        'h-galleria-prev-button h-galleria-nav-button',
        {
            'h-disabled': instance.isNavBackwardDisabled()
        }
    ],
    prevIcon: 'h-galleria-prev-icon',
    item: 'h-galleria-item',
    nextButton: ({ instance }) => [
        'h-galleria-next-button h-galleria-nav-button',
        {
            'h-disabled': instance.isNavForwardDisabled()
        }
    ],
    nextIcon: 'h-galleria-next-icon',
    caption: 'h-galleria-caption',
    indicatorList: 'h-galleria-indicator-list',
    indicator: ({ instance, index }) => [
        'h-galleria-indicator',
        {
            'h-galleria-indicator-active': instance.isIndicatorItemActive(index)
        }
    ],
    indicatorButton: 'h-galleria-indicator-button',
    thumbnails: 'h-galleria-thumbnails',
    thumbnailContent: 'h-galleria-thumbnails-content',
    thumbnailPrevButton: ({ instance }) => [
        'h-galleria-thumbnail-prev-button h-galleria-thumbnail-nav-button',
        {
            'h-disabled': instance.isNavBackwardDisabled()
        }
    ],
    thumbnailPrevIcon: 'h-galleria-thumbnail-prev-icon',
    thumbnailsViewport: 'h-galleria-thumbnails-viewport',
    thumbnailItems: 'h-galleria-thumbnail-items',
    thumbnailItem: ({ instance, index, activeIndex }) => [
        'h-galleria-thumbnail-item',
        {
            'h-galleria-thumbnail-item-current': activeIndex === index,
            'h-galleria-thumbnail-item-active': instance.isItemActive(index),
            'h-galleria-thumbnail-item-start': instance.firstItemAciveIndex() === index,
            'h-galleria-thumbnail-item-end': instance.lastItemActiveIndex() === index
        }
    ],
    thumbnail: 'h-galleria-thumbnail',
    thumbnailNextButton: ({ instance }) => [
        'h-galleria-thumbnail-next-button  h-galleria-thumbnail-nav-button',
        {
            'h-disabled': instance.isNavForwardDisabled()
        }
    ],
    thumbnailNextIcon: 'h-galleria-thumbnail-next-icon'
};

@Injectable()
export class GalleriaStyle extends BaseStyle {
    name = 'galleria';

    style = style;

    classes = classes;
}

/**
 *
 * Galleria is an advanced content gallery component.
 *
 * [Live Demo](https://www.primeng.org/galleria/)
 *
 * @module galleriastyle
 *
 */
export enum GalleriaClasses {
    /**
     * Class name of the mask element
     */
    mask = 'h-galleria-mask',
    /**
     * Class name of the root element
     */
    root = 'h-galleria',
    /**
     * Class name of the close button element
     */
    closeButton = 'h-galleria-close-button',
    /**
     * Class name of the close icon element
     */
    closeIcon = 'h-galleria-close-icon',
    /**
     * Class name of the header element
     */
    header = 'h-galleria-header',
    /**
     * Class name of the content element
     */
    content = 'h-galleria-content',
    /**
     * Class name of the footer element
     */
    footer = 'h-galleria-footer',
    /**
     * Class name of the items container element
     */
    itemsContainer = 'h-galleria-items-container',
    /**
     * Class name of the items element
     */
    items = 'h-galleria-items',
    /**
     * Class name of the previous item button element
     */
    prevButton = 'h-galleria-prev-button',
    /**
     * Class name of the previous item icon element
     */
    prevIcon = 'h-galleria-prev-icon',
    /**
     * Class name of the item element
     */
    item = 'h-galleria-item',
    /**
     * Class name of the next item button element
     */
    nextButton = 'h-galleria-next-button',
    /**
     * Class name of the next item icon element
     */
    nextIcon = 'h-galleria-next-icon',
    /**
     * Class name of the caption element
     */
    caption = 'h-galleria-caption',
    /**
     * Class name of the indicator list element
     */
    indicatorList = 'h-galleria-indicator-list',
    /**
     * Class name of the indicator element
     */
    indicator = 'h-galleria-indicator',
    /**
     * Class name of the indicator button element
     */
    indicatorButton = 'h-galleria-indicator-button',
    /**
     * Class name of the thumbnails element
     */
    thumbnails = 'h-galleria-thumbnails',
    /**
     * Class name of the thumbnail content element
     */
    thumbnailContent = 'h-galleria-thumbnails-content',
    /**
     * Class name of the previous thumbnail button element
     */
    previousThumbnailButton = 'h-galleria-thumbnail-prev-button',
    /**
     * Class name of the previous thumbnail icon element
     */
    previousThumbnailIcon = 'h-galleria-thumbnail-prev-icon',
    /**
     * Class name of the thumbnails viewport element
     */
    thumbnailsViewport = 'h-galleria-thumbnails-viewport',
    /**
     * Class name of the thumbnail items element
     */
    thumbnailItems = 'h-galleria-thumbnail-items',
    /**
     * Class name of the thumbnail item element
     */
    thumbnailItem = 'h-galleria-thumbnail-item',
    /**
     * Class name of the thumbnail element
     */
    thumbnail = 'h-galleria-thumbnail',
    /**
     * Class name of the next thumbnail button element
     */
    nextThumbnailButton = 'h-galleria-thumbnail-next-button',
    /**
     * Class name of the next thumbnail icon element
     */
    nextThumbnailIcon = 'h-galleria-thumbnail-next-icon'
}

export interface GalleriaStyle extends BaseStyle {}
