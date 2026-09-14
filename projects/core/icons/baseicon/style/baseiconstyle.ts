import { Injectable } from '@angular/core';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const css = /*css*/ `
.h-icon {
    display: inline-block;
    vertical-align: baseline;
    flex-shrink: 0;
}

.h-icon-spin {
    -webkit-animation: h-icon-spin 2s infinite linear;
    animation: h-icon-spin 2s infinite linear;
}

@-webkit-keyframes h-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}

@keyframes h-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}
`;

@Injectable({
    providedIn: 'root'
})
export class BaseIconStyle extends BaseStyle {
    name = 'baseicon';

    css = css;
}
/**
 *
 * [Live Demo](https://www.primeng.org/)
 *
 * @module baseiconstyle
 *
 */

export enum BaseIconClasses {
    root = 'h-icon'
}

export interface BaseIconStyle extends BaseStyle {}
