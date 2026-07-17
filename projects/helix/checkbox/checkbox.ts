import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  InjectionToken,
  input,
  Input,
  NgModule,
  numberAttribute,
  signal,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
  output,
  viewChild,
  contentChild,
  contentChildren
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { contains, equals } from '@primeuix/utils';
import { PrimeTemplate, SharedModule } from '@gravionlabs/helix/api';
import { PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { BaseEditableHolder } from '@gravionlabs/helix/baseeditableholder';
import { Bind, BindModule } from '@gravionlabs/helix/bind';
import { CheckIcon } from '@gravionlabs/helix/icons/check';
import { MinusIcon } from '@gravionlabs/helix/icons/minus';
import { Nullable } from '@gravionlabs/helix/ts-helpers';
import { CheckboxChangeEvent, CheckboxIconTemplateContext, CheckboxPassThrough } from '@gravionlabs/helix/types/checkbox';
import { CheckboxStyle } from './style/checkboxstyle';

const CHECKBOX_INSTANCE = new InjectionToken<Checkbox>('CHECKBOX_INSTANCE');

export const CHECKBOX_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Checkbox),
    multi: true
};
/**
 * Checkbox is an extension to standard checkbox element with theming.
 * @group Components
 */
@Component({
    selector: 'h-checkbox, h-checkBox, h-check-box',
    standalone: true,
    imports: [CommonModule, SharedModule, CheckIcon, MinusIcon, BindModule],
    templateUrl: './checkbox.html',
    providers: [CHECKBOX_VALUE_ACCESSOR, CheckboxStyle, { provide: CHECKBOX_INSTANCE, useExisting: Checkbox }, { provide: PARENT_INSTANCE, useExisting: Checkbox }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[attr.data-p-highlight]': 'checked',
        '[attr.data-p-checked]': 'checked',
        '[attr.data-p-disabled]': '$disabled()',
        '[attr.data-p]': 'dataP'
    },
    hostDirectives: [Bind]
})
export class Checkbox extends BaseEditableHolder<CheckboxPassThrough> {
    componentName = 'Checkbox';

    readonly hostName = input<any>('');
    /**
     * Value of the checkbox.
     * @group Props
     */
    readonly value = input<any>();
    /**
     * Allows to select a boolean value instead of multiple values.
     * @group Props
     */
    readonly binary = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    readonly ariaLabelledBy = input<string>();
    /**
     * Used to define a string that labels the input element.
     * @group Props
     */
    readonly ariaLabel = input<string>();
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number, unknown>(undefined, { transform: numberAttribute });
    /**
     * Identifier of the focus input to match a label defined for the component.
     * @group Props
     */
    readonly inputId = input<string>();
    /**
     * Inline style of the input element.
     * @group Props
     */
    readonly inputStyle = input<{
    [klass: string]: any;
} | null>();
    /**
     * Style class of the component.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    readonly styleClass = input<string>();
    /**
     * Style class of the input element.
     * @group Props
     */
    readonly inputClass = input<string>();
    /**
     * When present, it specifies input state as indeterminate.
     * @group Props
     */
    readonly indeterminate = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Form control value.
     * @group Props
     */
    readonly formControl = input<FormControl>();
    /**
     * Icon class of the checkbox icon.
     * @group Props
     */
    readonly checkboxIcon = input<string>();
    /**
     * When present, it specifies that the component cannot be edited.
     * @group Props
     */
    readonly readonly = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    readonly autofocus = input<boolean, unknown>(undefined, { transform: booleanAttribute });
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
     * Specifies the input variant of the component.
     * @defaultValue undefined
     * @group Props
     */
    variant = input<'filled' | 'outlined' | undefined>();
    /**
     * Specifies the size of the component.
     * @defaultValue undefined
     * @group Props
     */
    size = input<'large' | 'small' | undefined>();
    /**
     * Callback to invoke on value change.
     * @param {CheckboxChangeEvent} event - Custom value change event.
     * @group Emits
     */
    readonly onChange = output<CheckboxChangeEvent>();
    /**
     * Callback to invoke when the receives focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onFocus = output<Event>();
    /**
     * Callback to invoke when the loses focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onBlur = output<Event>();

    readonly inputViewChild = viewChild<Nullable<ElementRef>>('input');

    get checked() {
        return this._indeterminate() ? false : this.binary() ? this.modelValue() === this.trueValue() : contains(this.value(), this.modelValue());
    }

    _indeterminate = signal<any>(undefined);
    /**
     * Custom checkbox icon template.
     * @group Templates
     */
    readonly checkboxIconTemplate = contentChild<TemplateRef<CheckboxIconTemplateContext>>('icon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    _checkboxIconTemplate: TemplateRef<CheckboxIconTemplateContext> | undefined;

    focused: boolean = false;

    _componentStyle = inject(CheckboxStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcCheckbox: Checkbox | undefined = inject(CHECKBOX_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    $variant = computed(() => this.variant() || this.config.inputStyle() || this.config.inputVariant());

    onAfterContentInit() {
        this.templates()?.forEach((item) => {
            switch (item.getType()) {
                case 'icon':
                    this._checkboxIconTemplate = item.template;
                    break;
                case 'checkboxicon':
                    this._checkboxIconTemplate = item.template;
                    break;
            }
        });
    }

    onChanges(changes: SimpleChanges) {
        if (changes.indeterminate) {
            this._indeterminate.set(changes.indeterminate.currentValue);
        }
    }

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    updateModel(event) {
        let newModelValue;

        /*
         * When `formControlName` or `formControl` is used - `writeValue` is not called after control changes.
         * Otherwise it is causing multiple references to the actual value: there is one array reference inside the component and another one in the control value.
         * `selfControl` is the source of truth of references, it is made to avoid reference loss.
         * */
        const selfControl = this.injector.get<NgControl | null>(NgControl, null, { optional: true, self: true });

        const currentModelValue = selfControl && !this.formControl() ? selfControl.value : this.modelValue();

        if (!this.binary()) {
            if (this.checked || this._indeterminate()) newModelValue = currentModelValue.filter((val) => !equals(val, this.value()));
            else newModelValue = currentModelValue ? [...currentModelValue, this.value()] : [this.value()];

            this.onModelChange(newModelValue);
            this.writeModelValue(newModelValue);

            const formControl = this.formControl();
            if (formControl) {
                formControl.setValue(newModelValue);
            }
        } else {
            newModelValue = this._indeterminate() ? this.trueValue() : this.checked ? this.falseValue() : this.trueValue();
            this.writeModelValue(newModelValue);
            this.onModelChange(newModelValue);
        }

        if (this._indeterminate()) {
            this._indeterminate.set(false);
        }

        this.onChange.emit({ checked: newModelValue, originalEvent: event });
    }

    handleChange(event) {
        if (!this.readonly()) {
            this.updateModel(event);
        }
    }

    onInputFocus(event) {
        this.focused = true;
        this.onFocus.emit(event);
    }

    onInputBlur(event) {
        this.focused = false;
        this.onBlur.emit(event);
        this.onModelTouched();
    }

    focus() {
        this.inputViewChild()?.nativeElement.focus();
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
            invalid: this.invalid(),
            checked: this.checked,
            disabled: this.$disabled(),
            filled: this.$variant() === 'filled',
            [this.size() as string]: this.size()
        });
    }
}

@NgModule({
    imports: [Checkbox, SharedModule],
    exports: [Checkbox, SharedModule]
})
export class CheckboxModule {}
