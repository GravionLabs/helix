import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  forwardRef,
  inject,
  InjectionToken,
  input,
  NgModule,
  numberAttribute,
  TemplateRef,
  ViewEncapsulation,
  output,
  viewChild,
  contentChildren
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PrimeTemplate, SharedModule } from '@gravionlabs/helix/api';
import { AutoFocus } from '@gravionlabs/helix/autofocus';
import { PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { BaseEditableHolder } from '@gravionlabs/helix/baseeditableholder';
import { Bind, BindModule } from '@gravionlabs/helix/bind';
import { ToggleSwitchChangeEvent, ToggleSwitchHandleTemplateContext, ToggleSwitchPassThrough } from '@gravionlabs/helix/types/toggleswitch';
import { ToggleSwitchStyle } from './style/toggleswitchstyle';

const TOGGLESWITCH_INSTANCE = new InjectionToken<ToggleSwitch>('TOGGLESWITCH_INSTANCE');

export const TOGGLESWITCH_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleSwitch),
    multi: true
};
/**
 * ToggleSwitch is used to select a boolean value.
 * @group Components
 */
@Component({
    selector: 'h-toggleswitch, h-toggleSwitch, h-toggle-switch',
    standalone: true,
    imports: [CommonModule, AutoFocus, SharedModule, BindModule],
    templateUrl: './toggleswitch.html',
    providers: [TOGGLESWITCH_VALUE_ACCESSOR, ToggleSwitchStyle, { provide: TOGGLESWITCH_INSTANCE, useExisting: ToggleSwitch }, { provide: PARENT_INSTANCE, useExisting: ToggleSwitch }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[style]': "sx('root')",
        '[attr.data-p-checked]': 'checked()',
        '[attr.data-p-disabled]': '$disabled()',
        '[attr.data-p]': 'dataP',
        '(click)': 'onHostClick($event)'
    },
    hostDirectives: [Bind]
})
export class ToggleSwitch extends BaseEditableHolder<ToggleSwitchPassThrough> {
    componentName = 'ToggleSwitch';

    $pcToggleSwitch: ToggleSwitch | undefined = inject(TOGGLESWITCH_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    /**
     * Style class of the component.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    readonly styleClass = input<string>();
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number, unknown>(undefined, { transform: numberAttribute });
    /**
     * Identifier of the input element.
     * @group Props
     */
    readonly inputId = input<string>();
    /**
     * When present, it specifies that the component cannot be edited.
     * @group Props
     */
    readonly readonly = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Value in checked state.
     * @group Props
     */
    readonly trueValue = input<any>(true);
    /**
     * Value in unchecked state.
     * @group Props
     */
    readonly falseValue = input<any>(false);
    /**
     * Used to define a string that autocomplete attribute the current element.
     * @group Props
     */
    readonly ariaLabel = input<string>();
    /**
     * Specifies the size of the component.
     * @defaultValue undefined
     * @group Props
     */
    size = input<'large' | 'small' | undefined>();
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    readonly ariaLabelledBy = input<string>();
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    readonly autofocus = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Callback to invoke when the on value change.
     * @param {ToggleSwitchChangeEvent} event - Custom change event.
     * @group Emits
     */
    readonly onChange = output<ToggleSwitchChangeEvent>();

    readonly input = viewChild.required<ElementRef>('input');
    /**
     * Custom handle template.
     * @param {ToggleSwitchHandleTemplateContext} context - handle context.
     * @see {@link ToggleSwitchHandleTemplateContext}
     * @group Templates
     */
    @ContentChild('handle', { descendants: false }) handleTemplate: TemplateRef<ToggleSwitchHandleTemplateContext> | undefined;

    _handleTemplate: TemplateRef<ToggleSwitchHandleTemplateContext> | undefined;

    focused: boolean = false;

    _componentStyle = inject(ToggleSwitchStyle);

    readonly templates = contentChildren(PrimeTemplate);

    onHostClick(event: MouseEvent) {
        this.onClick(event);
    }

    onAfterContentInit() {
        this.templates().forEach((item) => {
            switch (item.getType()) {
                case 'handle':
                    this._handleTemplate = item.template;
                    break;
                default:
                    this._handleTemplate = item.template;
                    break;
            }
        });
    }

    onClick(event: Event) {
        if (!this.$disabled() && !this.readonly()) {
            this.writeModelValue(this.checked() ? this.falseValue() : this.trueValue());

            this.onModelChange(this.modelValue());
            this.onChange.emit({
                originalEvent: event,
                checked: this.modelValue()
            });

            this.input().nativeElement.focus();
        }
    }

    onFocus() {
        this.focused = true;
    }

    onBlur() {
        this.focused = false;
        this.onModelTouched();
    }

    checked() {
        return this.modelValue() === this.trueValue();
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        setModelValue(value);
        this.cd.markForCheck();
    }

    get dataP() {
        return this.cn({
            checked: this.checked(),
            disabled: this.$disabled(),
            invalid: this.invalid()
        });
    }
}

@NgModule({
    imports: [ToggleSwitch, SharedModule],
    exports: [ToggleSwitch, SharedModule]
})
export class ToggleSwitchModule {}
