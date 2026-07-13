import { CommonModule } from '@angular/common';
import { Component, Directive, Input, NgModule, TemplateRef } from '@angular/core';

@Component({
    selector: 'h-header',
    template: '<ng-content></ng-content>',
    standalone: false
})
export class Header {}

@Component({
    selector: 'h-footer',
    template: '<ng-content></ng-content>',
    standalone: false
})
export class Footer {}

@Directive({
    selector: '[hTemplate]',
    standalone: true
})
export class PrimeTemplate {
    @Input() type: string | undefined;

    @Input('hTemplate') name: string | undefined;

    constructor(public template: TemplateRef<any>) {}

    getType(): string {
        return this.name!;
    }
}

@NgModule({
    imports: [CommonModule, PrimeTemplate],
    exports: [Header, Footer, PrimeTemplate],
    declarations: [Header, Footer]
})
export class SharedModule {}
