import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[hDynamicDialogContent]',
    standalone: true
})
export class DynamicDialogContent {
    constructor(public viewContainerRef: ViewContainerRef) {}
}
