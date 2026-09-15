import { Injectable } from '@angular/core';
import { style } from './organizationchart.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => ['h-organizationchart h-component', { 'h-organizationchart-preservespace': instance.preserveSpace() }],
    table: 'h-organizationchart-table',
    node: ({ instance }) => [
        'h-organizationchart-node',
        { 'h-organizationchart-node': true, 'h-organizationchart-node-selectable': instance.chart.selectionMode && instance.node.selectable !== false, 'h-organizationchart-node-selected': instance.isSelected() }
    ],
    nodeToggleButton: 'h-organizationchart-node-toggle-button',
    nodeToggleButtonIcon: 'h-organizationchart-node-toggle-button-icon',
    connectors: 'h-organizationchart-connectors',
    connectorDown: 'h-organizationchart-connector-down',
    connectorLeft: ({ first }) => ['h-organizationchart-connector-left', { 'h-organizationchart-connector-top': !first }],
    connectorRight: ({ last }) => ['h-organizationchart-connector-right', { 'h-organizationchart-connector-top': !last }],
    nodeChildren: 'h-organizationchart-node-children'
};

@Injectable()
export class OrganizationChartStyle extends BaseStyle {
    name = 'organizationchart';

    style = style;

    classes = classes;
}

/**
 *
 * OrganizationChart visualizes hierarchical organization data.
 *
 * [Live Demo](https://www.primeng.org/organizationchart)
 *
 * @module organizationchartstyle
 *
 */
export enum OrganizationChartClasses {
    /**
     * Class name of the root element
     */
    root = 'h-organizationchart',
    /**
     * Class name of the table element
     */
    table = 'h-organizationchart-table',
    /**
     * Class name of the node element
     */
    node = 'h-organizationchart-node',
    /**
     * Class name of the node toggle button element
     */
    nodeToggleButton = 'h-organizationchart-node-toggle-button',
    /**
     * Class name of the node toggle button icon element
     */
    nodeToggleButtonIcon = 'h-organizationchart-node-toggle-button-icon',
    /**
     * Class name of the connectors element
     */
    connectors = 'h-organizationchart-connectors',
    /**
     * Class name of the connector down element
     */
    connectorDown = 'h-organizationchart-connector-down',
    /**
     * Class name of the connector left element
     */
    connectorLeft = 'h-organizationchart-connector-left',
    /**
     * Class name of the connector right element
     */
    connectorRight = 'h-organizationchart-connector-right',
    /**
     * Class name of the node children element
     */
    nodeChildren = 'h-organizationchart-node-children'
}

export interface OrganizationChartStyle extends BaseStyle {}
