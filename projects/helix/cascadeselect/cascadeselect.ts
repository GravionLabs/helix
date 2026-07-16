import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChild,
  effect,
  ElementRef,
  forwardRef,
  HostListener,
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
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MotionOptions } from '@primeuix/motion';
import { calculateScrollbarWidth, equals, findLastIndex, findSingle, focus, getHiddenElementOuterWidth, getOffset, getOuterWidth, getViewport, isEmpty, isNotEmpty, isPrintableCharacter, resolveFieldData, uuid } from '@primeuix/utils';
import { OverlayOptions, OverlayService, PrimeTemplate, SharedModule, TranslationKeys } from '@gravionlabs/helix/api';
import { AutoFocus } from '@gravionlabs/helix/autofocus';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { BaseEditableHolder } from '@gravionlabs/helix/baseeditableholder';
import { Bind } from '@gravionlabs/helix/bind';
import { Fluid } from '@gravionlabs/helix/fluid';
import { AngleRightIcon, ChevronDownIcon, TimesIcon } from '@gravionlabs/helix/icons';
import { Overlay } from '@gravionlabs/helix/overlay';
import { Ripple } from '@gravionlabs/helix/ripple';
import { Nullable, VoidListener } from '@gravionlabs/helix/ts-helpers';
import {
    CascadeSelectBeforeHideEvent,
    CascadeSelectBeforeShowEvent,
    CascadeSelectChangeEvent,
    CascadeSelectHideEvent,
    CascadeSelectOptionTemplateContext,
    CascadeSelectPassThrough,
    CascadeSelectShowEvent,
    CascadeSelectValueTemplateContext
} from '@gravionlabs/helix/types/cascadeselect';
import { CascadeSelectStyle } from './style/cascadeselectstyle';

const CASCADESELECT_INSTANCE = new InjectionToken<CascadeSelect>('CASCADESELECT_INSTANCE');

export const CASCADESELECT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CascadeSelect),
    multi: true
};

@Component({
    selector: 'ul[hCascadeSelectSub]',
    standalone: true,
    imports: [CommonModule, Ripple, AngleRightIcon, SharedModule, Bind],
    templateUrl: './cascadeselectsub.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [CascadeSelectStyle, { provide: PARENT_INSTANCE, useExisting: CascadeSelectSub }]
})
export class CascadeSelectSub extends BaseComponent {
    readonly selectId = input<string>();

    readonly activeOptionPath = input<any[]>(undefined!);

    readonly optionDisabled = input<any[]>(undefined!);

    readonly focusedOptionId = input<string>();

    readonly options = input<any[] | string[] | string | null>();

    readonly optionGroupChildren = input<string[] | string | null>();

    readonly optionTemplate = input<Nullable<TemplateRef<any>>>();

    readonly groupicon = input<Nullable<TemplateRef<any>>>();

    readonly level = input<number, unknown>(0, { transform: numberAttribute });

    readonly optionLabel = input<string>();

    readonly optionValue = input<string>();

    readonly optionGroupLabel = input<string>();

    readonly dirty = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    readonly root = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    readonly onChange = output<any>();

    readonly onFocusChange = output<any>();

    readonly onFocusEnterChange = output<any>();

    _componentStyle = inject(CascadeSelectStyle);

    constructor(public cascadeselect: CascadeSelect) {
        super();
    }

    getPTOptions(processedOption: any, index: number, key: string) {
        return this.ptm(key, {
            context: {
                option: processedOption,
                index,
                level: this.level(),
                optionGroup: this.isOptionGroup(processedOption),
                active: this.isOptionActive(processedOption),
                focused: this.isOptionFocused(processedOption),
                disabled: this.isOptionDisabled(processedOption)
            }
        });
    }

    onInit() {
        if (!this.root()) {
            this.position();
        }
    }

    onOptionClick(event, processedOption: any) {
        this.onChange.emit({
            originalEvent: event,
            processedOption,
            isFocus: true
        });
    }

    onOptionMouseEnter(event, processedOption) {
        this.onFocusEnterChange.emit({ originalEvent: event, processedOption });
    }

    onOptionMouseMove(event, processedOption) {
        this.onFocusChange.emit({ originalEvent: event, processedOption });
    }

    getOptionId(processedOption) {
        return `${this.selectId()}_${processedOption.key}`;
    }

    getOptionLabel(processedOption) {
        const optionLabel = this.optionLabel();
        return optionLabel ? resolveFieldData(processedOption.option, optionLabel) : processedOption.option;
    }

    getOptionValue(processedOption) {
        const optionValue = this.optionValue();
        return optionValue ? resolveFieldData(processedOption.option, optionValue) : processedOption.option;
    }

    getOptionLabelToRender(processedOption) {
        return this.isOptionGroup(processedOption) ? this.getOptionGroupLabel(processedOption) : this.getOptionLabel(processedOption);
    }

    isOptionDisabled(processedOption) {
        const optionDisabled = this.optionDisabled();
        return optionDisabled ? resolveFieldData(processedOption.option, optionDisabled) : false;
    }

    getOptionGroupLabel(processedOption) {
        const optionGroupLabel = this.optionGroupLabel();
        return optionGroupLabel ? resolveFieldData(processedOption.option, optionGroupLabel) : null;
    }

    getOptionGroupChildren(processedOption) {
        return processedOption.children;
    }

    isOptionGroup(processedOption) {
        return isNotEmpty(processedOption.children);
    }

    isOptionSelected(processedOption) {
        return equals(this.cascadeselect?.modelValue(), processedOption?.option);
    }

    isOptionActive(processedOption) {
        return this.activeOptionPath().some((path) => path.key === processedOption.key);
    }

    isOptionFocused(processedOption) {
        return this.focusedOptionId() === this.getOptionId(processedOption);
    }

    position() {
        const parentItem = this.el.nativeElement.parentElement;
        const containerOffset = <any>getOffset(parentItem);
        const viewport = <any>getViewport();
        const sublistWidth = this.el.nativeElement.childNodes[0].offsetParent ? this.el.nativeElement.children[0].offsetWidth : getHiddenElementOuterWidth(this.el.nativeElement.children[0]);
        const itemOuterWidth = <any>getOuterWidth(parentItem.children[0]);
        if (parseInt(containerOffset.left, 10) + itemOuterWidth + sublistWidth > viewport.width - calculateScrollbarWidth()) {
            this.el.nativeElement.children[0].style.left = '-200%';
        }
    }
}
/**
 * CascadeSelect is a form component to select a value from a nested structure of options.
 * @group Components
 */
@Component({
    selector: 'h-cascadeSelect, h-cascadeselect, h-cascade-select',
    standalone: true,
    imports: [CommonModule, Overlay, AutoFocus, CascadeSelectSub, ChevronDownIcon, TimesIcon, SharedModule, Bind],
    templateUrl: './cascadeselect.html',
    providers: [CASCADESELECT_VALUE_ACCESSOR, CascadeSelectStyle, { provide: PARENT_INSTANCE, useExisting: CascadeSelect }, { provide: CASCADESELECT_INSTANCE, useExisting: CascadeSelect }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[style]': "sx('root')",
        '(mousedown)': 'onHostClick($event)'
    },
    hostDirectives: [Bind]
})
export class CascadeSelect extends BaseEditableHolder<CascadeSelectPassThrough> {
    componentName = 'CascadeSelect';

    $pcCascadeSelect: CascadeSelect | undefined = inject(CASCADESELECT_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    /**
     * Unique identifier of the component
     * @group Props
     */
    readonly id = input<string>();

    private readonly autoId = uuid('pn_id_');

    readonly $id = computed(() => this.id() || this.autoId);
    /**
     * Text to display when the search is active. Defaults to global value in i18n translation configuration.
     * @group Props
     * @defaultValue '{0} results are available'
     */
    readonly searchMessage = input<string>();
    /**
     * Text to display when there is no data. Defaults to global value in i18n translation configuration.
     * @group Props
     */
    readonly emptyMessage = input<string>();
    /**
     * Text to be displayed in hidden accessible field when options are selected. Defaults to global value in i18n translation configuration.
     * @group Props
     * @defaultValue '{0} items selected'
     */
    readonly selectionMessage = input<string>();
    /**
     * Text to display when filtering does not return any results. Defaults to value from Helix locale configuration.
     * @group Props
     * @defaultValue 'No available options'
     */
    readonly emptySearchMessage = input<string>();
    /**
     * Text to display when filtering does not return any results. Defaults to global value in i18n translation configuration.
     * @group Props
     * @defaultValue 'No selected item'
     */
    readonly emptySelectionMessage = input<string>();
    /**
     * Locale to use in searching. The default locale is the host environment's current locale.
     * @group Props
     */
    readonly searchLocale = input<string>();
    /**
     * Name of the disabled field of an option.
     * @group Props
     */
    readonly optionDisabled = input<any>();
    /**
     * Fields used when filtering the options, defaults to optionLabel.
     * @group Props
     */
    readonly focusOnHover = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Determines if the option will be selected on focus.
     * @group Props
     */
    readonly selectOnFocus = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether to focus on the first visible or selected element when the overlay panel is shown.
     * @group Props
     */
    readonly autoOptionFocus = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Style class of the component.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    readonly styleClass = input<string>();
    /**
     * An array of selectitems to display as the available options.
     * @group Props
     */
    readonly options = input<string[] | string>();
    /**
     * Property name or getter function to use as the label of an option.
     * @group Props
     */
    readonly optionLabel = input<string>();
    /**
     * Property name or getter function to use as the value of an option, defaults to the option itself when not defined.
     * @group Props
     */
    readonly optionValue = input<string>();
    /**
     * Property name or getter function to use as the label of an option group.
     * @group Props
     */
    readonly optionGroupLabel = input<string>();
    /**
     * Property name or getter function to retrieve the items of a group.
     * @group Props
     */
    readonly optionGroupChildren = input<string[] | string | null>();
    /**
     * Default text to display when no option is selected.
     * @group Props
     */
    readonly placeholder = input<string>();
    /**
     * Selected value of the component.
     * @group Props
     */
    @Input() value: string | undefined | null;
    /**
     * A property to uniquely identify an option.
     * @group Props
     */
    readonly dataKey = input<string>();
    /**
     * Identifier of the underlying input element.
     * @group Props
     */
    readonly inputId = input<string>();
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number | undefined, unknown>(0, { transform: numberAttribute });
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    readonly ariaLabelledBy = input<string>();
    /**
     * Label of the input for accessibility.
     * @group Props
     */
    readonly inputLabel = input<string>();
    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    readonly ariaLabel = input<string>();
    /**
     * When enabled, a clear icon is displayed to clear the value.
     * @group Props
     */
    readonly showClear = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Style class of the overlay panel.
     * @group Props
     */
    readonly panelStyleClass = input<string>();
    /**
     * Inline style of the overlay panel.
     * @group Props
     */
    readonly panelStyle = input<{
    [klass: string]: any;
} | null>();
    /**
     * Whether to use overlay API feature. The properties of overlay API can be used like an object in it.
     * @group Props
     */
    readonly overlayOptions = input<OverlayOptions>();
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    readonly autofocus = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Whether the dropdown is in loading state.
     * @group Props
     */
    readonly loading = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });
    /**
     * Icon to display in loading state.
     * @group Props
     */
    readonly loadingIcon = input<string>();
    /**
     * The breakpoint to define the maximum width boundary.
     * @group Props
     */
    readonly breakpoint = input<string>('960px');
    /**
     * Specifies the size of the component.
     * @defaultValue undefined
     * @group Props
     */
    size = input<'large' | 'small' | undefined>();
    /**
     * Specifies the input variant of the component.
     * @defaultValue undefined
     * @group Props
     */
    variant = input<'filled' | 'outlined' | undefined>();
    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue undefined
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);
    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);
    /**
     * Callback to invoke on value change.
     * @param {CascadeSelectChangeEvent} event - Custom change event.
     * @group Emits
     */
    readonly onChange = output<CascadeSelectChangeEvent>();
    /**
     * Callback to invoke when a group changes.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onGroupChange = output<Event>();
    /**
     * Callback to invoke when the overlay is shown.
     * @param {CascadeSelectShowEvent} event - Custom overlay show event.
     * @group Emits
     */
    readonly onShow = output<CascadeSelectShowEvent>();
    /**
     * Callback to invoke when the overlay is hidden.
     * @param {CascadeSelectHideEvent} event - Custom overlay hide event.
     * @group Emits
     */
    readonly onHide = output<CascadeSelectHideEvent>();
    /**
     * Callback to invoke when the clear token is clicked.
     * @group Emits
     */
    readonly onClear = output<any>();
    /**
     * Callback to invoke before overlay is shown.
     * @param {CascadeSelectBeforeShowEvent} event - Custom overlay show event.
     * @group Emits
     */
    readonly onBeforeShow = output<CascadeSelectBeforeShowEvent>();
    /**
     * Callback to invoke before overlay is hidden.
     * @param {CascadeSelectBeforeHideEvent} event - Custom overlay hide event.
     * @group Emits
     */
    readonly onBeforeHide = output<CascadeSelectBeforeHideEvent>();
    /**
     * Callback to invoke when input receives focus.
     * @param {FocusEvent} event - Focus event.
     * @group Emits
     */
    readonly onFocus = output<FocusEvent>();
    /**
     * Callback to invoke when input loses focus.
     * @param {FocusEvent} event - Focus event.
     * @group Emits
     */
    readonly onBlur = output<FocusEvent>();

    readonly focusInputViewChild = viewChild<Nullable<ElementRef>>('focusInput');

    readonly panelViewChild = viewChild<Nullable<ElementRef>>('panel');

    readonly overlayViewChild = viewChild<Nullable<Overlay>>('overlay');
    /**
     * Custom value template.
     * @group Templates
     */
    readonly valueTemplate = contentChild<Nullable<TemplateRef<CascadeSelectValueTemplateContext>>>('value', { descendants: false });

    /**
     * Custom option template.
     * @group Templates
     */
    readonly optionTemplate = contentChild<Nullable<TemplateRef<CascadeSelectOptionTemplateContext>>>('option', { descendants: false });

    /**
     * Custom header template.
     * @group Templates
     */
    readonly headerTemplate = contentChild<Nullable<TemplateRef<void>>>('header', { descendants: false });

    /**
     * Custom footer template.
     * @group Templates
     */
    readonly footerTemplate = contentChild<Nullable<TemplateRef<void>>>('footer', { descendants: false });

    /**
     * Custom trigger icon template.
     * @group Templates
     */
    readonly triggerIconTemplate = contentChild<Nullable<TemplateRef<void>>>('triggericon', { descendants: false });

    /**
     * Custom loading icon template.
     * @group Templates
     */
    readonly loadingIconTemplate = contentChild<Nullable<TemplateRef<void>>>('loadingicon', { descendants: false });

    /**
     * Custom option group icon template.
     * @group Templates
     */
    readonly groupIconTemplate = contentChild<Nullable<TemplateRef<void>>>('optiongroupicon', { descendants: false });

    /**
     * Custom clear icon template.
     * @group Templates
     */
    readonly clearIconTemplate = contentChild<Nullable<TemplateRef<void>>>('clearicon', { descendants: false });

    _valueTemplate: TemplateRef<CascadeSelectValueTemplateContext> | undefined;

    _optionTemplate: TemplateRef<CascadeSelectOptionTemplateContext> | undefined;

    _headerTemplate: TemplateRef<void> | undefined;

    _footerTemplate: TemplateRef<void> | undefined;

    _triggerIconTemplate: TemplateRef<void> | undefined;

    _loadingIconTemplate: TemplateRef<void> | undefined;

    _groupIconTemplate: TemplateRef<void> | undefined;

    _clearIconTemplate: TemplateRef<void> | undefined;

    selectionPath: any = null;

    focused: boolean = false;

    overlayVisible: boolean = false;

    clicked: boolean = false;

    dirty: boolean = false;

    searchValue: string | undefined;

    searchTimeout: any;

    focusedOptionInfo = signal<any>({ index: -1, level: 0, parentKey: '' });

    activeOptionPath = signal<any>([]);

    processedOptions: string[] | string | undefined = [];

    _componentStyle = inject(CascadeSelectStyle);

    initialized: boolean = false;

    $variant = computed(() => this.variant() || this.config.inputStyle() || this.config.inputVariant());

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    pcFluid: Fluid | null = inject(Fluid, { optional: true, host: true, skipSelf: true });

    get hasFluid() {
        return this.fluid() ?? !!this.pcFluid;
    }

    onHostClick(event: MouseEvent) {
        this.onContainerClick(event);
    }

    get listLabel(): string {
        return this.config.getTranslation(TranslationKeys.ARIA)['listLabel'];
    }

    get focusedOptionId() {
        return this.focusedOptionInfo().index !== -1 ? `${this.$id()}${isNotEmpty(this.focusedOptionInfo().parentKey) ? '_' + this.focusedOptionInfo().parentKey : ''}_${this.focusedOptionInfo().index}` : null;
    }

    get searchResultMessageText() {
        return isNotEmpty(this.visibleOptions()) ? this.searchMessageText.replaceAll('{0}', this.visibleOptions().length) : this.emptySearchMessageText;
    }

    get searchMessageText() {
        return this.searchMessage() || this.config.translation.searchMessage || '';
    }

    get emptySearchMessageText() {
        return this.emptySearchMessage() || this.config.translation.emptySearchMessage || '';
    }

    get emptyMessageText() {
        return this.emptyMessage() || this.config.translation.emptyMessage || '';
    }

    get selectionMessageText() {
        return this.selectionMessage() || this.config.translation.selectionMessage || '';
    }

    get emptySelectionMessageText() {
        return this.emptySelectionMessage() || this.config.translation.emptySelectionMessage || '';
    }

    get selectedMessageText() {
        return this.hasSelectedOption() ? this.selectionMessageText.replaceAll('{0}', '1') : this.emptySelectionMessageText;
    }

    visibleOptions = computed(() => {
        const processedOption = this.activeOptionPath().find((p) => p.key === this.focusedOptionInfo().parentKey);

        return processedOption ? processedOption.children : this.processedOptions;
    });

    label = computed(() => {
        const label = this.placeholder() || 'p-emptylabel';

        if (this.hasSelectedOption()) {
            const activeOptionPath = this.findOptionPathByValue(this.modelValue(), null);
            const processedOption = isNotEmpty(activeOptionPath) ? activeOptionPath[activeOptionPath.length - 1] : null;

            return processedOption ? this.getOptionLabel(processedOption.option) : label;
        }
        return label;
    });

    get _label() {
        const label = this.placeholder() || 'p-emptylabel';

        if (this.hasSelectedOption()) {
            const activeOptionPath = this.findOptionPathByValue(this.modelValue(), null);
            const processedOption = isNotEmpty(activeOptionPath) ? activeOptionPath[activeOptionPath.length - 1] : null;

            return processedOption ? this.getOptionLabel(processedOption.option) : label;
        }
        return label;
    }

    readonly templates = contentChildren(PrimeTemplate);

    onAfterContentInit() {
        this.templates().forEach((item) => {
            switch (item.getType()) {
                case 'value':
                    this._valueTemplate = item.template;
                    break;

                case 'option':
                    this._optionTemplate = item.template;
                    break;

                case 'header':
                    this._headerTemplate = item.template;
                    break;

                case 'footer':
                    this._footerTemplate = item.template;
                    break;

                case 'triggericon':
                    this._triggerIconTemplate = item.template;
                    break;

                case 'loadingicon':
                    this._loadingIconTemplate = item.template;
                    break;

                case 'clearicon':
                    this._clearIconTemplate = item.template;
                    break;

                case 'optiongroupicon':
                    this._groupIconTemplate = item.template;
                    break;
            }
        });
    }

    onChanges(changes: SimpleChanges): void {
        if (changes.options) {
            this.processedOptions = this.createProcessedOptions(changes.options.currentValue || []);
            this.updateModel(null);
        }
    }

    hasSelectedOption() {
        return isNotEmpty(this.modelValue());
    }

    createProcessedOptions(options, level = 0, parent = {}, parentKey = '') {
        const processedOptions: any[] = [];

        options &&
            options.forEach((option, index) => {
                const key = (parentKey !== '' ? parentKey + '_' : '') + index;
                const newOption = {
                    option,
                    index,
                    level,
                    key,
                    parent,
                    parentKey
                };

                newOption['children'] = this.createProcessedOptions(this.getOptionGroupChildren(option, level), level + 1, newOption, key);
                processedOptions.push(newOption);
            });

        return processedOptions;
    }

    onInputFocus(event: FocusEvent) {
        if (this.$disabled()) {
            // For screenreaders
            return;
        }

        this.focused = true;
        this.onFocus.emit(event);
    }

    onInputBlur(event: FocusEvent) {
        this.focused = false;
        this.focusedOptionInfo.set({ indeX: -1, level: 0, parentKey: '' });
        this.searchValue = '';
        this.onModelTouched();
        this.onBlur.emit(event);
    }

    onInputKeyDown(event: KeyboardEvent) {
        if (this.$disabled() || this.loading()) {
            event.preventDefault();

            return;
        }

        const metaKey = event.metaKey || event.ctrlKey;

        switch (event.code) {
            case 'ArrowDown':
                this.onArrowDownKey(event);
                break;

            case 'ArrowUp':
                this.onArrowUpKey(event);
                break;

            case 'ArrowLeft':
                this.onArrowLeftKey(event);
                break;

            case 'ArrowRight':
                this.onArrowRightKey(event);
                break;

            case 'Home':
                this.onHomeKey(event);
                break;

            case 'End':
                this.onEndKey(event);
                break;

            case 'Space':
                this.onSpaceKey(event);
                break;

            case 'Enter':
            case 'NumpadEnter':
                this.onEnterKey(event);
                break;

            case 'Escape':
                this.onEscapeKey(event);
                break;

            case 'Tab':
                this.onTabKey(event);
                break;

            case 'Backspace':
                this.onBackspaceKey(event);
                break;

            case 'PageDown':
            case 'PageUp':
            case 'ShiftLeft':
            case 'ShiftRight':
                //NOOP
                break;

            default:
                if (!metaKey && isPrintableCharacter(event.key)) {
                    !this.overlayVisible && this.show();
                    this.searchOptions(event, event.key);
                }

                break;
        }

        this.clicked = false;
    }

    onArrowDownKey(event) {
        if (!this.overlayVisible) {
            this.show();
        } else {
            const optionIndex = this.focusedOptionInfo().index !== -1 ? this.findNextOptionIndex(this.focusedOptionInfo().index) : this.clicked ? this.findFirstOptionIndex() : this.findFirstFocusedOptionIndex();

            this.changeFocusedOptionIndex(event, optionIndex, true);
        }

        event.preventDefault();
    }

    onArrowUpKey(event) {
        if (event.altKey) {
            if (this.focusedOptionInfo().index !== -1) {
                const processedOption = this.visibleOptions[this.focusedOptionInfo().index];
                const grouped = this.isProccessedOptionGroup(processedOption);

                !grouped && this.onOptionChange({ originalEvent: event, processedOption });
            }

            this.overlayVisible && this.hide();
            event.preventDefault();
        } else {
            const optionIndex = this.focusedOptionInfo().index !== -1 ? this.findPrevOptionIndex(this.focusedOptionInfo().index) : this.clicked ? this.findLastOptionIndex() : this.findLastFocusedOptionIndex();

            this.changeFocusedOptionIndex(event, optionIndex, true);

            !this.overlayVisible && this.show();
            event.preventDefault();
        }
    }

    onArrowLeftKey(event) {
        if (this.overlayVisible) {
            const processedOption = this.visibleOptions()[this.focusedOptionInfo().index];
            const parentOption = this.activeOptionPath().find((p) => p.key === processedOption.parentKey);
            const matched = this.focusedOptionInfo().parentKey === '' || (parentOption && parentOption.key === this.focusedOptionInfo().parentKey);
            const root = isEmpty(processedOption.parent);

            if (matched) {
                const activeOptionPath = this.activeOptionPath().filter((p) => p.parentKey !== this.focusedOptionInfo().parentKey);
                this.activeOptionPath.set(activeOptionPath);
            }

            if (!root) {
                this.focusedOptionInfo.set({ index: -1, parentKey: parentOption ? parentOption.parentKey : '' });
                this.searchValue = '';
                this.onArrowDownKey(event);
            }

            event.preventDefault();
        }
    }

    onArrowRightKey(event) {
        if (this.overlayVisible) {
            const processedOption = this.visibleOptions()[this.focusedOptionInfo().index];
            const grouped = this.isProccessedOptionGroup(processedOption);

            if (grouped) {
                const matched = this.activeOptionPath().some((p) => processedOption.key === p.key);

                if (matched) {
                    this.focusedOptionInfo.set({ index: -1, parentKey: processedOption.key });
                    this.searchValue = '';
                    this.onArrowDownKey(event);
                } else {
                    this.onOptionChange({ originalEvent: event, processedOption });
                }
            }

            event.preventDefault();
        }
    }

    onHomeKey(event) {
        this.changeFocusedOptionIndex(event, this.findFirstOptionIndex());

        !this.overlayVisible && this.show();
        event.preventDefault();
    }

    onEndKey(event) {
        this.changeFocusedOptionIndex(event, this.findLastOptionIndex());

        !this.overlayVisible && this.show();
        event.preventDefault();
    }

    onEnterKey(event) {
        if (!this.overlayVisible) {
            this.focusedOptionInfo.set({ ...this.focusedOptionInfo(), index: -1 }); // reset
            this.onArrowDownKey(event);
        } else {
            if (this.focusedOptionInfo().index !== -1) {
                const processedOption = this.visibleOptions()[this.focusedOptionInfo().index];
                const grouped = this.isProccessedOptionGroup(processedOption);

                this.onOptionClick({ originalEvent: event, processedOption });
                !grouped && this.hide();
            }
        }

        event.preventDefault();
    }

    onSpaceKey(event) {
        this.onEnterKey(event);
    }

    onEscapeKey(event) {
        this.overlayVisible && this.hide(event, true);
        event.preventDefault();
    }

    onTabKey(event) {
        if (this.focusedOptionInfo().index !== -1) {
            const processedOption = this.visibleOptions()[this.focusedOptionInfo().index];
            const grouped = this.isProccessedOptionGroup(processedOption);

            !grouped && this.onOptionChange({ originalEvent: event, processedOption });
        }

        this.overlayVisible && this.hide();
    }

    onBackspaceKey(event) {
        if (isNotEmpty(this.modelValue()) && this.showClear()) {
            this.clear();
        }

        event.stopPropagation();
    }

    equalityKey() {
        return this.optionValue() ? undefined : this.dataKey();
    }

    updateModel(value, event?) {
        this.value = value;
        this.onModelChange(value);
        this.writeModelValue(value);

        if (this.initialized) {
            this.onChange.emit({
                originalEvent: event,
                value: value
            });
        }
    }

    autoUpdateModel() {
        if (this.selectOnFocus() && this.autoOptionFocus() && !this.hasSelectedOption()) {
            this.focusedOptionInfo().index = this.findFirstFocusedOptionIndex();
            this.onOptionChange({
                originalEvent: null,
                processedOption: this.visibleOptions()[this.focusedOptionInfo().index],
                isHide: false
            });

            !this.overlayVisible && this.focusedOptionInfo.set({ index: -1, level: 0, parentKey: '' });
        }
    }

    scrollInView(index = -1) {
        const id = index !== -1 ? `${this.$id()}_${index}` : this.focusedOptionId;
        const element = findSingle(this.panelViewChild()?.nativeElement, `li[id="${id}"]`);

        if (element) {
            element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'start' });
        }
    }

    changeFocusedOptionIndex(event, index, preventSelection?: boolean) {
        const focusedOptionInfo = this.focusedOptionInfo();

        if (focusedOptionInfo.index !== index) {
            this.focusedOptionInfo.set({ ...focusedOptionInfo, index });
            this.scrollInView();

            if (this.focusOnHover()) {
                this.onOptionClick({ originalEvent: event, processedOption: this.visibleOptions()[index], isHide: false, preventSelection });
            }

            if (this.selectOnFocus()) {
                this.onOptionChange({ originalEvent: event, processedOption: this.visibleOptions()[index], isHide: false });
            }
        }
    }
    matchMediaListener: VoidListener;

    onOptionSelect(event) {
        const { originalEvent, value, isHide } = event;
        const newValue = this.getOptionValue(value);

        const activeOptionPath = this.activeOptionPath();
        activeOptionPath.forEach((p) => (p.selected = true));

        this.activeOptionPath.set(activeOptionPath);
        this.updateModel(newValue, originalEvent);
        isHide && this.hide(event, true);
    }

    onOptionGroupSelect(event) {
        this.dirty = true;
        this.onGroupChange.emit(event);
    }

    onContainerClick(event: MouseEvent) {
        if (this.$disabled() || this.loading()) {
            return;
        }

        if (!this.overlayViewChild()?.el?.nativeElement?.contains(event.target)) {
            if (this.overlayVisible) {
                this.hide();
            } else {
                this.show();
            }

            this.focusInputViewChild()?.nativeElement.focus();
        }

        this.clicked = true;
    }

    isOptionMatched(processedOption) {
        return this.isValidOption(processedOption) && this.getProccessedOptionLabel(processedOption).toLocaleLowerCase(this.searchLocale()).startsWith(this.searchValue?.toLocaleLowerCase(this.searchLocale()));
    }

    isOptionDisabled(option) {
        const optionDisabled = this.optionDisabled();
        return optionDisabled ? resolveFieldData(option, optionDisabled) : false;
    }

    isValidOption(processedOption) {
        return !!processedOption && !this.isOptionDisabled(processedOption.option);
    }

    isValidSelectedOption(processedOption) {
        return this.isValidOption(processedOption) && this.isSelected(processedOption);
    }

    isSelected(processedOption) {
        return this.activeOptionPath().some((p) => p.key === processedOption.key);
    }

    findOptionPathByValue(value, processedOptions?, level = 0) {
        processedOptions = processedOptions || (level === 0 && this.processedOptions);

        if (!processedOptions) return null;
        if (isEmpty(value)) return [];

        for (let i = 0; i < processedOptions.length; i++) {
            const processedOption = processedOptions[i];

            if (equals(value, this.getOptionValue(processedOption.option), this.equalityKey())) {
                return [processedOption];
            }

            const matchedOptions = this.findOptionPathByValue(value, processedOption.children, level + 1);

            if (matchedOptions) {
                matchedOptions.unshift(processedOption);

                return matchedOptions;
            }
        }
    }

    findFirstOptionIndex() {
        return this.visibleOptions().findIndex((processedOption) => this.isValidOption(processedOption));
    }

    findLastOptionIndex() {
        return findLastIndex(this.visibleOptions(), (processedOption) => this.isValidOption(processedOption));
    }

    findNextOptionIndex(index) {
        const matchedOptionIndex =
            index < this.visibleOptions().length - 1
                ? this.visibleOptions()
                      .slice(index + 1)
                      .findIndex((processedOption) => this.isValidOption(processedOption))
                : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : index;
    }

    findPrevOptionIndex(index) {
        const matchedOptionIndex = index > 0 ? findLastIndex(this.visibleOptions().slice(0, index), (processedOption) => this.isValidOption(processedOption)) : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex : index;
    }

    findSelectedOptionIndex() {
        return this.visibleOptions().findIndex((processedOption) => this.isValidSelectedOption(processedOption));
    }

    findFirstFocusedOptionIndex() {
        const selectedIndex = this.findSelectedOptionIndex();

        return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
    }

    findLastFocusedOptionIndex() {
        const selectedIndex = this.findSelectedOptionIndex();

        return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
    }

    searchOptions(event, char) {
        this.searchValue = (this.searchValue || '') + char;

        let optionIndex = -1;
        let matched = false;
        const focusedOptionInfo = this.focusedOptionInfo();

        if (focusedOptionInfo.index !== -1) {
            optionIndex = this.visibleOptions()
                .slice(focusedOptionInfo.index)
                .findIndex((processedOption) => this.isOptionMatched(processedOption));
            optionIndex =
                optionIndex === -1
                    ? this.visibleOptions()
                          .slice(0, focusedOptionInfo.index)
                          .findIndex((processedOption) => this.isOptionMatched(processedOption))
                    : optionIndex + focusedOptionInfo.index;
        } else {
            optionIndex = this.visibleOptions().findIndex((processedOption) => this.isOptionMatched(processedOption));
        }

        if (optionIndex !== -1) {
            matched = true;
        }

        if (optionIndex === -1 && focusedOptionInfo.index === -1) {
            optionIndex = this.findFirstFocusedOptionIndex();
        }

        if (optionIndex !== -1) {
            this.changeFocusedOptionIndex(event, optionIndex);
        }

        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        this.searchTimeout = setTimeout(() => {
            this.searchValue = '';
            this.searchTimeout = null;
        }, 500);

        return matched;
    }

    hide(event?, isFocus = false) {
        const _hide = () => {
            this.overlayVisible = false;
            this.clicked = false;
            this.activeOptionPath.set([]);
            this.focusedOptionInfo.set({ index: -1, level: 0, parentKey: '' });

            isFocus && focus(this.focusInputViewChild()?.nativeElement);
            this.onHide.emit(event);
            this.cd.markForCheck();
        };

        setTimeout(() => {
            _hide();
        }, 0); // For ScreenReaders
    }

    show(event?, isFocus = false) {
        this.onShow.emit(event);
        this.overlayVisible = true;
        const activeOptionPath = this.hasSelectedOption() ? this.findOptionPathByValue(this.modelValue()) : this.activeOptionPath();
        this.activeOptionPath.set(activeOptionPath);
        let focusedOptionInfo;

        if (this.hasSelectedOption() && isNotEmpty(this.activeOptionPath())) {
            const processedOption = this.activeOptionPath()[this.activeOptionPath().length - 1];

            focusedOptionInfo = {
                index: processedOption.index,
                level: processedOption.level,
                parentKey: processedOption.parentKey
            };
        } else {
            focusedOptionInfo = { index: this.autoOptionFocus() ? this.findFirstFocusedOptionIndex() : this.findSelectedOptionIndex(), level: 0, parentKey: '' };
        }

        this.focusedOptionInfo.set(focusedOptionInfo);

        isFocus && focus(this.focusInputViewChild()?.nativeElement);
    }

    clear(event?: MouseEvent) {
        if (isNotEmpty(this.modelValue()) && this.showClear()) {
            this.updateModel(null);
            this.focusedOptionInfo.set({ index: -1, level: 0, parentKey: '' });
            this.activeOptionPath.set([]);
            this.onClear.emit(event);
        }

        event && event.stopPropagation();
    }

    getOptionLabel(option) {
        const optionLabel = this.optionLabel();
        return optionLabel ? resolveFieldData(option, optionLabel) : option;
    }

    getOptionValue(option) {
        const optionValue = this.optionValue();
        return optionValue ? resolveFieldData(option, optionValue) : option;
    }

    getOptionGroupLabel(optionGroup) {
        const optionGroupLabel = this.optionGroupLabel();
        return optionGroupLabel ? resolveFieldData(optionGroup, optionGroupLabel) : null;
    }

    getOptionGroupChildren(optionGroup, level) {
        return resolveFieldData(optionGroup, this.optionGroupChildren()?.[level]);
    }

    isOptionGroup(option, level) {
        return Object.prototype.hasOwnProperty.call(option, this.optionGroupChildren()?.[level]);
    }

    isProccessedOptionGroup(processedOption) {
        return isNotEmpty(processedOption?.children);
    }

    getProccessedOptionLabel(processedOption) {
        const grouped = this.isProccessedOptionGroup(processedOption);

        return grouped ? this.getOptionGroupLabel(processedOption.option) : this.getOptionLabel(processedOption.option);
    }

    constructor(public overlayService: OverlayService) {
        super();
        effect(() => {
            const activeOptionPath = this.activeOptionPath();
            if (isNotEmpty(activeOptionPath)) {
                this.overlayViewChild()?.alignOverlay();
            }
        });
    }
    query: any;
    queryMatches = signal<boolean>(false);
    mobileActive = signal<boolean>(false);

    onOptionChange(event) {
        const { processedOption, type } = event;

        if (isEmpty(processedOption)) return;

        const { index, key, level, parentKey, children } = processedOption;
        const grouped = isNotEmpty(children);
        const activeOptionPath = this.activeOptionPath().filter((p) => p.parentKey !== parentKey && p.parentKey !== key);

        this.focusedOptionInfo.set({ index, level, parentKey });

        if (type == 'hover' && this.queryMatches()) {
            return;
        }

        if (grouped) {
            activeOptionPath.push(processedOption);
        }

        this.activeOptionPath.set([...activeOptionPath]);
    }

    onOptionClick(event) {
        const { originalEvent, processedOption, isFocus, isHide, preventSelection } = event;
        const { index, key, level, parentKey } = processedOption;
        const grouped = this.isProccessedOptionGroup(processedOption);
        const selected = this.isSelected(processedOption);

        if (selected) {
            const activeOptionPath = this.activeOptionPath().filter((p) => key !== p.key && key.startsWith(p.key));
            this.activeOptionPath.set([...activeOptionPath]);
            this.focusedOptionInfo.set({ index, level, parentKey });
        } else {
            if (grouped) {
                this.onOptionChange(event);
                this.onOptionGroupSelect({ originalEvent, value: processedOption.option, isFocus: false });
            } else {
                const activeOptionPath = this.activeOptionPath().filter((p) => p.parentKey !== parentKey);

                activeOptionPath.push(processedOption);

                this.focusedOptionInfo.set({ index, level, parentKey });

                if (!preventSelection || processedOption?.children.length !== 0) {
                    this.activeOptionPath.set([...activeOptionPath]);
                    this.onOptionSelect({ originalEvent, value: processedOption.option, isHide: isFocus });
                }
            }
        }

        isFocus && focus(this.focusInputViewChild()?.nativeElement);
    }

    onOptionMouseEnter(event) {
        if (this.focusOnHover()) {
            if (this.dirty || (!this.dirty && isNotEmpty(this.modelValue()))) {
                this.onOptionChange({ ...event, type: 'hover' });
            } else if (!this.dirty && event.processedOption.level === 0) {
                this.onOptionClick({ ...event, type: 'hover' });
            }
        }
    }

    onOptionMouseMove(event) {
        if (this.focused && this.focusOnHover()) {
            this.changeFocusedOptionIndex(event, event.processedOption.index);
        }
    }

    onInit() {
        this.autoUpdateModel();
        this.bindMatchMediaListener();
    }

    onAfterViewInit() {
        this.initialized = true;
    }

    bindMatchMediaListener() {
        if (!this.matchMediaListener) {
            const window: Window | null = this.document.defaultView;
            if (window && window.matchMedia) {
                const query = window.matchMedia(`(max-width: ${this.breakpoint()})`);
                this.query = query;
                this.queryMatches.set(query?.matches);

                this.matchMediaListener = () => {
                    this.queryMatches.set(query?.matches);
                    this.mobileActive.set(false);
                };

                this.query.addEventListener('change', this.matchMediaListener);
            }
        }
    }

    unbindMatchMediaListener() {
        if (this.matchMediaListener) {
            this.query.removeEventListener('change', this.matchMediaListener);
            this.matchMediaListener = null;
        }
    }

    onOverlayAfterLeave() {
        this.dirty = false;
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        this.value = value;
        setModelValue(value);
        this.cd.markForCheck();
    }

    onDestroy() {
        if (this.matchMediaListener) {
            this.unbindMatchMediaListener();
        }
    }
}

@NgModule({
    imports: [CascadeSelect, SharedModule],
    exports: [CascadeSelect, SharedModule]
})
export class CascadeSelectModule {}
