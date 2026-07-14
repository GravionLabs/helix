import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIcon } from '@gravionlabs/helix/icons/baseicon';

@Component({
    selector: '[data-p-icon="blank"]',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    template: ` <svg:rect width="1" height="1" fill="currentColor" fill-opacity="0" /> `
})
export class BlankIcon extends BaseIcon {}
