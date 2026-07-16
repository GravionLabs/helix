
import { AfterContentInit, booleanAttribute, ChangeDetectionStrategy, Component, inject, InjectionToken, NgModule, TemplateRef, ViewEncapsulation, input, output, contentChild, contentChildren, model } from '@angular/core';
import { PrimeTemplate, SharedModule } from '@gravionlabs/helix/api';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind } from '@gravionlabs/helix/bind';
import { ButtonModule } from '@gravionlabs/helix/button';
import { TimesIcon } from '@gravionlabs/helix/icons';
import { Ripple } from '@gravionlabs/helix/ripple';
import { InplaceContentTemplateContext, InplacePassThrough } from '@gravionlabs/helix/types/inplace';
import { InplaceStyle } from './style/inplacestyle';

const INPLACE_INSTANCE = new InjectionToken<Inplace>('INPLACE_INSTANCE');

@Component({
    selector: 'h-inplacedisplay, h-inplaceDisplay',
    standalone: true,
    imports: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: '<ng-content></ng-content>'
})
export class InplaceDisplay extends BaseComponent {}

@Component({
    selector: 'h-inplacecontent, h-inplaceContent',
    standalone: true,
    imports: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: '<ng-content></ng-content>'
})
export class InplaceContent extends BaseComponent {}
/**
 * Inplace provides an easy to do editing and display at the same time where clicking the output displays the actual content.
 * @group Components
 */
@Component({
    selector: 'h-inplace',
    standalone: true,
    imports: [ButtonModule, TimesIcon, SharedModule, Ripple, Bind],
    templateUrl: './inplace.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [InplaceStyle, { provide: INPLACE_INSTANCE, useExisting: Inplace }, { provide: PARENT_INSTANCE, useExisting: Inplace }],
    host: {
        '[attr.aria-live]': "'polite'",
        '[class]': "cn(cx('root'), styleClass())"
    },
    hostDirectives: [Bind]
})
export class Inplace extends BaseComponent<InplacePassThrough> {
    componentName = 'Inplace';

    $pcInplace: Inplace | undefined = inject(INPLACE_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    /**
     * Whether the content is displayed or not.
     * @group Props
     */
    readonly active = model<boolean | undefined>(false);
    /**
     * Displays a button to switch back to display mode.
     * @deprecated since v20.0.0, use `closeCallback` within content template.
     * @group Props
     */
    readonly closable = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    readonly disabled = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });
    /**
     * Allows to prevent clicking.
     * @group Props
     */
    readonly preventClick = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    readonly styleClass = input<string>();
    /**
     * Icon to display in the close button.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    readonly closeIcon = input<string>();
    /**
     * Establishes a string value that labels the close button.
     * @group Props
     */
    readonly closeAriaLabel = input<string>();
    /**
     * Callback to invoke when inplace is opened.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onActivate = output<Event | undefined>();
    /**
     * Callback to invoke when inplace is closed.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onDeactivate = output<Event | undefined>();

    hover!: boolean;
    /**
     * Custom display template.
     * @group Templates
     */
    readonly displayTemplate = contentChild<TemplateRef<void>>('display', { descendants: false });
    /**
     * Custom content template.
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<InplaceContentTemplateContext>>('content', { descendants: false });
    /**
     * Custom close icon template.
     * @group Templates
     */
    readonly closeIconTemplate = contentChild<TemplateRef<void>>('closeicon', { descendants: false });

    _componentStyle = inject(InplaceStyle);

    onActivateClick(event: MouseEvent) {
        if (!this.preventClick()) this.activate(event);
    }

    onDeactivateClick(event: MouseEvent) {
        if (!this.preventClick()) this.deactivate(event);
    }
    /**
     * Activates the content.
     * @param {Event} event - Browser event.
     * @group Method
     */
    activate(event?: Event) {
        if (!this.disabled()) {
            this.active.set(true);
            this.onActivate.emit(event);
            this.cd.markForCheck();
        }
    }
    /**
     * Deactivates the content.
     * @param {Event} event - Browser event.
     * @group Method
     */
    deactivate(event?: Event) {
        if (!this.disabled()) {
            this.active.set(false);
            this.hover = false;
            this.onDeactivate.emit(event);
            this.cd.markForCheck();
        }
    }

    onKeydown(event: KeyboardEvent) {
        if (event.code === 'Enter') {
            this.activate(event);
            event.preventDefault();
        }
    }

    readonly templates = contentChildren(PrimeTemplate);

    _displayTemplate: TemplateRef<void> | undefined;

    _closeIconTemplate: TemplateRef<void> | undefined;

    _contentTemplate: TemplateRef<InplaceContentTemplateContext> | undefined;

    onAfterContentInit() {
        this.templates()?.forEach((item) => {
            switch (item.getType()) {
                case 'display':
                    this._displayTemplate = item.template;
                    break;

                case 'closeicon':
                    this._closeIconTemplate = item.template;
                    break;

                case 'content':
                    this._contentTemplate = item.template;
                    break;
            }
        });
    }
}

@NgModule({
    imports: [Inplace, InplaceContent, InplaceDisplay, SharedModule],
    exports: [Inplace, InplaceContent, InplaceDisplay, SharedModule]
})
export class InplaceModule {}
