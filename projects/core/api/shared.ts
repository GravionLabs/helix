import { CommonModule } from '@angular/common';
import { Component, Directive, NgModule, TemplateRef, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
    selector: 'h-header',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class Header {}

@Component({
    selector: 'h-footer',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class Footer {}

@Directive({
    selector: '[hTemplate]',
    standalone: true
})
export class HelixTemplate {
    readonly type = input<string>();

    readonly name = input<string>(undefined, { alias: "hTemplate" });

    constructor(public template: TemplateRef<any>) {}

    getType(): string {
        return this.name()!;
    }
}

@NgModule({
    imports: [CommonModule, HelixTemplate],
    exports: [Header, Footer, HelixTemplate],
    declarations: [Header, Footer]
})
export class SharedModule {}
