import { Injectable } from '@angular/core';
import { style } from './metergroup.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => [
        'h-metergroup h-component',
        {
            'h-metergroup-horizontal': instance.orientation() === 'horizontal',
            'h-metergroup-vertical': instance.orientation() === 'vertical'
        }
    ],
    meters: 'h-metergroup-meters',
    meter: 'h-metergroup-meter',
    labelList: ({ instance }) => [
        'h-metergroup-label-list',
        {
            'h-metergroup-label-list-vertical': instance.labelOrientation() === 'vertical',
            'h-metergroup-label-list-horizontal': instance.labelOrientation() === 'horizontal'
        }
    ],
    label: 'h-metergroup-label',
    labelIcon: 'h-metergroup-label-icon',
    labelMarker: 'h-metergroup-label-marker',
    labelText: 'h-metergroup-label-text'
};

@Injectable()
export class MeterGroupStyle extends BaseStyle {
    name = 'metergroup';

    style = style;

    classes = classes;
}

/**
 *
 * MeterGroup is a group of process status indicators.
 *
 * [Live Demo](https://www.primeng.org/metergroup)
 *
 * @module metergroupstyle
 *
 */
export enum MeterGroupClasses {
    /**
     * Class name of the root element
     */
    root = 'h-metergroup',
    /**
     * Class name of the meters element
     */
    meters = 'h-metergroup-meters',
    /**
     * Class name of the meter element
     */
    meter = 'h-metergroup-meter',
    /**
     * Class name of the label list element
     */
    labelList = 'h-metergroup-label-list',
    /**
     * Class name of the label element
     */
    label = 'h-metergroup-label',
    /**
     * Class name of the label icon element
     */
    labelIcon = 'h-metergroup-label-icon',
    /**
     * Class name of the label marker element
     */
    labelMarker = 'h-metergroup-label-marker',
    /**
     * Class name of the label text element
     */
    labelText = 'h-metergroup-label-text'
}

export interface MeterGroupStyle extends BaseStyle {}
