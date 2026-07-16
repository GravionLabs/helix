import { CommonModule } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, ElementRef, inject, InjectionToken, input, Input, NgModule, TemplateRef, ViewEncapsulation, output, viewChild, contentChild, contentChildren, model } from '@angular/core';
import { MotionEvent, MotionOptions } from '@primeuix/motion';
import { uuid } from '@primeuix/utils';
import { BlockableUI, PrimeTemplate, SharedModule } from '@gravionlabs/helix/api';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind, BindModule } from '@gravionlabs/helix/bind';
import { MinusIcon, PlusIcon } from '@gravionlabs/helix/icons';
import { MotionModule } from '@gravionlabs/helix/motion';
import type { FieldsetAfterToggleEvent, FieldsetBeforeToggleEvent, FieldsetPassThrough } from '@gravionlabs/helix/types/fieldset';
import { FieldsetStyle } from './style/fieldsetstyle';

const FIELDSET_INSTANCE = new InjectionToken<Fieldset>('FIELDSET_INSTANCE');

/**
 * Fieldset is a grouping component with the optional content toggle feature.
 * @group Components
 */
@Component({
    selector: 'h-fieldset',
    standalone: true,
    imports: [CommonModule, MinusIcon, PlusIcon, SharedModule, BindModule, MotionModule],
    templateUrl: './fieldset.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [FieldsetStyle, { provide: FIELDSET_INSTANCE, useExisting: Fieldset }, { provide: PARENT_INSTANCE, useExisting: Fieldset }],
    hostDirectives: [Bind]
})
export class Fieldset extends BaseComponent<FieldsetPassThrough> implements BlockableUI {
    componentName = 'Fieldset';

    $pcFieldset: Fieldset | undefined = inject(FIELDSET_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    _componentStyle = inject(FieldsetStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('host'));
    }

    get dataP() {
        return this.cn({
            toggleable: this.toggleable()
        });
    }

    /**
     * Header text of the fieldset.
     * @group Props
     */
    readonly legend = input<string>();
    /**
     * When specified, content can toggled by clicking the legend.
     * @group Props
     * @defaultValue false
     */
    readonly toggleable = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Inline style of the component.
     * @group Props
     */
    readonly style = input<{
    [klass: string]: any;
} | null>();
    /**
     * Style class of the component.
     * @group Props
     */
    readonly styleClass = input<string>();
    /**
     * Transition options of the panel animation.
     * @group Props
     * @deprecated since v21.0.0, use `motionOptions` instead.
     */
    readonly transitionOptions = input<string>('400ms cubic-bezier(0.86, 0, 0.07, 1)');
    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion'),
            ...this.motionOptions()
        };
    });
    /**
     * Callback to invoke before panel toggle.
     * @param {PanelBeforeToggleEvent} event - Custom toggle event
     * @group Emits
     */
    readonly onBeforeToggle = output<FieldsetBeforeToggleEvent>();
    /**
     * Callback to invoke after panel toggle.
     * @param {PanelAfterToggleEvent} event - Custom toggle event
     * @group Emits
     */
    readonly onAfterToggle = output<FieldsetAfterToggleEvent>();

    readonly contentWrapperViewChild = viewChild.required<ElementRef>('contentWrapper');

    private _id: string = uuid('pn_id_');

    get id() {
        return this._id;
    }

    get buttonAriaLabel() {
        return this.legend();
    }

    /**
     * Defines the initial state of content, supports one or two-way binding as well.
     * @group Props
     */
    readonly collapsed = model<boolean | undefined>(false);

    /**
     * Custom header template.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<void>>('header', { descendants: false });

    /**
     * Custom expand icon template.
     * @group Templates
     */
    readonly expandIconTemplate = contentChild<TemplateRef<void>>('expandicon', { descendants: false });

    /**
     * Custom collapse icon template.
     * @group Templates
     */
    readonly collapseIconTemplate = contentChild<TemplateRef<void>>('collapseicon', { descendants: false });

    /**
     * Custom content template.
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<void>>('content', { descendants: false });

    toggle(event: MouseEvent) {
        this.onBeforeToggle.emit({ originalEvent: event, collapsed: this.collapsed() });

        if (this.collapsed()) this.expand();
        else this.collapse();

        event.preventDefault();
    }

    onKeyDown(event) {
        if (event.code === 'Enter' || event.code === 'Space') {
            this.toggle(event);
            event.preventDefault();
        }
    }

    expand() {
        this.collapsed.set(false);
        this.updateTabIndex();
    }

    collapse() {
        this.collapsed.set(true);
        this.updateTabIndex();
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }

    updateTabIndex() {
        const contentWrapperViewChild = this.contentWrapperViewChild();
        if (contentWrapperViewChild) {
            const focusableElements = contentWrapperViewChild.nativeElement.querySelectorAll('input, button, select, a, textarea, [tabindex]');
            focusableElements.forEach((element: HTMLElement) => {
                if (this.collapsed()) {
                    element.setAttribute('tabindex', '-1');
                } else {
                    element.removeAttribute('tabindex');
                }
            });
        }
    }

    onToggleDone(event: MotionEvent) {
        this.onAfterToggle.emit({ originalEvent: event as any, collapsed: this.collapsed() });
    }

    _headerTemplate: TemplateRef<void> | undefined;

    _expandIconTemplate: TemplateRef<void> | undefined;

    _collapseIconTemplate: TemplateRef<void> | undefined;

    _contentTemplate: TemplateRef<void> | undefined;

    readonly templates = contentChildren(PrimeTemplate);

    onAfterContentInit() {
        this.templates().forEach((item) => {
            switch (item.getType()) {
                case 'header':
                    this._headerTemplate = item.template;
                    break;

                case 'expandicon':
                    this._expandIconTemplate = item.template;
                    break;

                case 'collapseicon':
                    this._collapseIconTemplate = item.template;
                    break;

                case 'content':
                    this._contentTemplate = item.template;
                    break;
            }
        });
    }
}

@NgModule({
    imports: [Fieldset, SharedModule, BindModule],
    exports: [Fieldset, SharedModule, BindModule]
})
export class FieldsetModule {}
