import { Injectable } from '@angular/core';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const inlineStyles = {
    root: () => ({ position: 'absolute', top: '0' })
};

const style = /*css*/ `
.h-overlay-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.h-overlay-content {
    transform-origin: inherit;
    will-change: transform;
}

/* Github Issue #18560 */
.h-component-overlay.h-component {
    position: relative;
}

.h-overlay-modal > .h-overlay-content {
    z-index: 1;
    width: 90%;
}

/* Position */
/* top */
.h-overlay-top {
    align-items: flex-start;
}
.h-overlay-top-start {
    align-items: flex-start;
    justify-content: flex-start;
}
.h-overlay-top-end {
    align-items: flex-start;
    justify-content: flex-end;
}

/* bottom */
.h-overlay-bottom {
    align-items: flex-end;
}
.h-overlay-bottom-start {
    align-items: flex-end;
    justify-content: flex-start;
}
.h-overlay-bottom-end {
    align-items: flex-end;
    justify-content: flex-end;
}

/* left */
.h-overlay-left {
    justify-content: flex-start;
}
.h-overlay-left-start {
    justify-content: flex-start;
    align-items: flex-start;
}
.h-overlay-left-end {
    justify-content: flex-start;
    align-items: flex-end;
}

/* right */
.h-overlay-right {
    justify-content: flex-end;
}
.h-overlay-right-start {
    justify-content: flex-end;
    align-items: flex-start;
}
.h-overlay-right-end {
    justify-content: flex-end;
    align-items: flex-end;
}

.h-overlay-content ~ .h-overlay-content {
    display: none;
}
`;

const classes = {
    host: 'h-overlay-host',
    root: ({ instance }: { instance: any }) => [
        'h-overlay h-component',
        {
            'h-overlay-modal h-overlay-mask h-overlay-mask-enter-active': instance.modal,
            'h-overlay-center': instance.modal && instance.overlayResponsiveDirection === 'center',
            'h-overlay-top': instance.modal && instance.overlayResponsiveDirection === 'top',
            'h-overlay-top-start': instance.modal && instance.overlayResponsiveDirection === 'top-start',
            'h-overlay-top-end': instance.modal && instance.overlayResponsiveDirection === 'top-end',
            'h-overlay-bottom': instance.modal && instance.overlayResponsiveDirection === 'bottom',
            'h-overlay-bottom-start': instance.modal && instance.overlayResponsiveDirection === 'bottom-start',
            'h-overlay-bottom-end': instance.modal && instance.overlayResponsiveDirection === 'bottom-end',
            'h-overlay-left': instance.modal && instance.overlayResponsiveDirection === 'left',
            'h-overlay-left-start': instance.modal && instance.overlayResponsiveDirection === 'left-start',
            'h-overlay-left-end': instance.modal && instance.overlayResponsiveDirection === 'left-end',
            'h-overlay-right': instance.modal && instance.overlayResponsiveDirection === 'right',
            'h-overlay-right-start': instance.modal && instance.overlayResponsiveDirection === 'right-start',
            'h-overlay-right-end': instance.modal && instance.overlayResponsiveDirection === 'right-end'
        }
    ],
    content: 'h-overlay-content'
};

@Injectable()
export class OverlayStyle extends BaseStyle {
    name = 'overlay';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}
