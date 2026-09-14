import { Injectable } from '@angular/core';
import { style } from './image.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => [
        'h-image h-component',
        {
            'h-image-preview': instance.preview()
        }
    ],
    previewMask: 'h-image-preview-mask',
    previewIcon: 'h-image-preview-icon',
    mask: 'h-image-mask h-overlay-mask',
    toolbar: 'h-image-toolbar',
    rotateRightButton: 'h-image-action h-image-rotate-right-button',
    rotateLeftButton: 'h-image-action h-image-rotate-left-button',
    zoomOutButton: ({ instance }) => [
        'h-image-action h-image-zoom-out-button',
        {
            'h-disabled': instance.isZoomOutDisabled
        }
    ],
    zoomInButton: ({ instance }) => [
        'h-image-action h-image-zoom-in-button',
        {
            'h-disabled': instance.isZoomInDisabled
        }
    ],
    closeButton: 'h-image-action h-image-close-button',
    original: 'h-image-original'
};

@Injectable()
export class ImageStyle extends BaseStyle {
    name = 'image';

    style = style;

    classes = classes;
}

/**
 *
 * Displays an image with preview and tranformation options. For multiple image, see Galleria.
 *
 * [Live Demo](https://www.primeng.org/image/)
 *
 * @module imagestyle
 *
 */
export enum ImageClasses {
    /**
     * Class name of the root element
     */
    root = 'h-image',
    /**
     * Class name of the preview mask element
     */
    previewMask = 'h-image-preview-mask',
    /**
     * Class name of the preview icon element
     */
    previewIcon = 'h-image-preview-icon',
    /**
     * Class name of the mask element
     */
    mask = 'h-image-mask',
    /**
     * Class name of the toolbar element
     */
    toolbar = 'h-image-toolbar',
    /**
     * Class name of the rotate right button element
     */
    rotateRightButton = 'h-image-rotate-right-button',
    /**
     * Class name of the rotate left button element
     */
    rotateLeftButton = 'h-image-rotate-left-button',
    /**
     * Class name of the zoom out button element
     */
    zoomOutButton = 'h-image-zoom-out-button',
    /**
     * Class name of the zoom in button element
     */
    zoomInButton = 'h-image-zoom-in-button',
    /**
     * Class name of the close button element
     */
    closeButton = 'h-image-close-button',
    /**
     * Class name of the original element
     */
    original = 'h-image-original'
}

export interface ImageStyle extends BaseStyle {}
