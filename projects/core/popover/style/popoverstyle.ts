import { Injectable } from '@angular/core';
import { style } from './popover.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const inlineStyles = {
    root: () => ({ position: 'absolute' })
};

const classes = {
    root: 'p-popover p-component',
    content: 'p-popover-content'
};

@Injectable()
export class PopoverStyle extends BaseStyle {
    name = 'popover';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}
