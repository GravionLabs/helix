import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  InjectionToken,
  input,
  Input,
  NgModule,
  numberAttribute,
  TemplateRef,
  output,
  contentChild,
  contentChildren
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PrimeTemplate, SharedModule } from '@gravionlabs/helix/api';
import { PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { BaseEditableHolder } from '@gravionlabs/helix/baseeditableholder';
import { Bind } from '@gravionlabs/helix/bind';
import { BindModule } from '@gravionlabs/helix/bind';
import { Ripple } from '@gravionlabs/helix/ripple';
import { Nullable } from '@gravionlabs/helix/ts-helpers';
import { ToggleButtonChangeEvent, ToggleButtonContentTemplateContext, ToggleButtonIconTemplateContext, ToggleButtonPassThrough } from '@gravionlabs/helix/types/togglebutton';
import { ToggleButtonStyle } from './style/togglebuttonstyle';

const TOGGLEBUTTON_INSTANCE = new InjectionToken<ToggleButton>('TOGGLEBUTTON_INSTANCE');

export const TOGGLEBUTTON_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleButton),
    multi: true
};
/**
 * ToggleButton is used to select a boolean value using a button.
 * @group Components
 */
@Component({
    selector: 'h-toggleButton, h-togglebutton, h-toggle-button',
    standalone: true,
    imports: [CommonModule, SharedModule, BindModule],
    hostDirectives: [{ directive: Ripple }, Bind],
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[attr.aria-labelledby]': 'ariaLabelledBy()',
        '[attr.aria-label]': 'ariaLabel()',
        '[attr.aria-pressed]': 'checked ? "true" : "false"',
        '[attr.role]': '"button"',
        '[attr.tabindex]': 'tabindex() !== undefined ? tabindex() : (!$disabled() ? 0 : -1)',
        '[attr.data-pc-name]': "'togglebutton'",
        '[attr.data-p-checked]': 'active',
        '[attr.data-p-disabled]': '$disabled()',
        '[attr.data-p]': 'dataP',
        '(keydown)': 'onKeyDown($event)',
        '(click)': 'toggle($event)'
    },
    templateUrl: './togglebutton.html',
    providers: [TOGGLEBUTTON_VALUE_ACCESSOR, ToggleButtonStyle, { provide: TOGGLEBUTTON_INSTANCE, useExisting: ToggleButton }, { provide: PARENT_INSTANCE, useExisting: ToggleButton }],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleButton extends BaseEditableHolder<ToggleButtonPassThrough> {
    componentName = 'ToggleButton';

    $pcToggleButton: ToggleButton | undefined = inject(TOGGLEBUTTON_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    onKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            case 'Enter':
                this.toggle(event);
                event.preventDefault();
                break;
            case 'Space':
                this.toggle(event);
                event.preventDefault();
                break;
        }
    }

    toggle(event: Event) {
        if (!this.$disabled() && !(this.allowEmpty() === false && this.checked)) {
            this.checked = !this.checked;
            this.writeModelValue(this.checked);
            this.onModelChange(this.checked);
            this.onModelTouched();
            this.onChange.emit({
                originalEvent: event,
                checked: this.checked
            });

            this.cd.markForCheck();
        }
    }
    /**
     * Label for the on state.
     * @group Props
     */
    readonly onLabel = input<string>('Yes');
    /**
     * Label for the off state.
     * @group Props
     */
    readonly offLabel = input<string>('No');
    /**
     * Icon for the on state.
     * @group Props
     */
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    @Input() onIcon: string | undefined;
    /**
     * Icon for the off state.
     * @group Props
     */
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    @Input() offIcon: string | undefined;
    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    readonly ariaLabel = input<string>();
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    readonly ariaLabelledBy = input<string>();
    /**
     * Style class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    readonly styleClass = input<string>();
    /**
     * Identifier of the focus input to match a label defined for the component.
     * @group Props
     */
    readonly inputId = input<string>();
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number | undefined, unknown>(0, { transform: numberAttribute });
    /**
     * Position of the icon.
     * @group Props
     */
    readonly iconPos = input<'left' | 'right'>('left');
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    readonly autofocus = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Defines the size of the component.
     * @group Props
     */
    readonly size = input<'large' | 'small'>(undefined!);
    /**
     * Whether selection can not be cleared.
     * @group Props
     */
    readonly allowEmpty = input<boolean>();
    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue undefined
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });
    /**
     * Callback to invoke on value change.
     * @param {ToggleButtonChangeEvent} event - Custom change event.
     * @group Emits
     */
    readonly onChange = output<ToggleButtonChangeEvent>();
    /**
     * Custom icon template.
     * @param {ToggleButtonIconTemplateContext} context - icon context.
     * @see {@link ToggleButtonIconTemplateContext}
     * @group Templates
     */
    readonly iconTemplate = contentChild<Nullable<TemplateRef<ToggleButtonIconTemplateContext>>>('icon', { descendants: false });
    /**
     * Custom content template.
     * @param {ToggleButtonContentTemplateContext} context - content context.
     * @see {@link ToggleButtonContentTemplateContext}
     * @group Templates
     */
    readonly contentTemplate = contentChild<Nullable<TemplateRef<ToggleButtonContentTemplateContext>>>('content', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    checked: boolean = false;

    onInit() {
        if (this.checked === null || this.checked === undefined) {
            this.checked = false;
        }
    }

    _componentStyle = inject(ToggleButtonStyle);

    onBlur() {
        this.onModelTouched();
    }

    get hasOnLabel(): boolean {
        const onLabel = this.onLabel();
        return (onLabel && onLabel.length > 0) as boolean;
    }

    get hasOffLabel(): boolean {
        const offLabel = this.offLabel();
        return (offLabel && offLabel.length > 0) as boolean;
    }

    get active() {
        return this.checked === true;
    }

    _iconTemplate: TemplateRef<ToggleButtonIconTemplateContext> | undefined;

    _contentTemplate: TemplateRef<ToggleButtonContentTemplateContext> | undefined;

    onAfterContentInit() {
        this.templates().forEach((item) => {
            switch (item.getType()) {
                case 'icon':
                    this._iconTemplate = item.template;
                    break;
                case 'content':
                    this._contentTemplate = item.template;
                    break;
                default:
                    this._contentTemplate = item.template;
                    break;
            }
        });
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        this.checked = value;
        setModelValue(value);
        this.cd.markForCheck();
    }

    get dataP() {
        return this.cn({
            checked: this.active,
            invalid: this.invalid(),
            [this.size() as string]: this.size()
        });
    }
}

@NgModule({
    imports: [ToggleButton, SharedModule],
    exports: [ToggleButton, SharedModule]
})
export class ToggleButtonModule {}
