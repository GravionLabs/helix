import { CommonModule, isPlatformBrowser } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChild, Directive, effect, inject, InjectionToken, input, NgModule, numberAttribute, TemplateRef, ViewEncapsulation, output, contentChildren } from '@angular/core';
import { addClass, createElement, findSingle, isEmpty } from '@primeuix/utils';
import { PrimeTemplate, SharedModule } from '@gravionlabs/helix/api';
import { AutoFocus } from '@gravionlabs/helix/autofocus';
import { BadgeModule } from '@gravionlabs/helix/badge';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind } from '@gravionlabs/helix/bind';
import { Fluid } from '@gravionlabs/helix/fluid';
import { SpinnerIcon } from '@gravionlabs/helix/icons';
import { Ripple } from '@gravionlabs/helix/ripple';
import type { ButtonIconTemplateContext, ButtonLoadingIconTemplateContext, ButtonPassThrough, ButtonProps, ButtonSeverity } from '@gravionlabs/helix/types/button';
import { ButtonStyle } from './style/buttonstyle';

const BUTTON_INSTANCE = new InjectionToken<Button>('BUTTON_INSTANCE');

const BUTTON_DIRECTIVE_INSTANCE = new InjectionToken<ButtonDirective>('BUTTON_DIRECTIVE_INSTANCE');

const BUTTON_LABEL_INSTANCE = new InjectionToken<ButtonLabel>('BUTTON_LABEL_INSTANCE');

const BUTTON_ICON_INSTANCE = new InjectionToken<ButtonIcon>('BUTTON_ICON_INSTANCE');

export type ButtonIconPosition = 'left' | 'right' | 'top' | 'bottom';

const INTERNAL_BUTTON_CLASSES = {
    button: 'p-button',
    component: 'p-component',
    iconOnly: 'p-button-icon-only',
    disabled: 'p-disabled',
    loading: 'p-button-loading',
    labelOnly: 'p-button-loading-label-only'
} as const;

@Directive({
    selector: '[hButtonLabel]',
    providers: [ButtonStyle, { provide: BUTTON_LABEL_INSTANCE, useExisting: ButtonLabel }, { provide: PARENT_INSTANCE, useExisting: ButtonLabel }],
    standalone: true,
    host: {
        '[class.p-button-label]': '!$unstyled() && true'
    },
    hostDirectives: [Bind]
})
export class ButtonLabel extends BaseComponent {
    componentName = 'ButtonLabel';

    /**
     * Used to pass attributes to DOM elements inside the hButtonLabel.
     * @defaultValue undefined
     * @deprecated use pButtonLabelPT instead.
     * @group Props
     */
    ptButtonLabel = input<any>();
    /**
     * Used to pass attributes to DOM elements inside the hButtonLabel.
     * @defaultValue undefined
     * @group Props
     */
    pButtonLabelPT = input<any>();
    /**
     * Indicates whether the component should be rendered without styles.
     * @defaultValue undefined
     * @group Props
     */
    pButtonLabelUnstyled = input<boolean | undefined>();

    $pcButtonLabel: ButtonLabel | undefined = inject(BUTTON_LABEL_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        effect(() => {
            const pt = this.ptButtonLabel() || this.pButtonLabelPT();
            pt && this.directivePT.set(pt);
        });

        effect(() => {
            this.pButtonLabelUnstyled() && this.directiveUnstyled.set(this.pButtonLabelUnstyled());
        });
    }

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }
}

@Directive({
    selector: '[hButtonIcon]',
    providers: [ButtonStyle, { provide: BUTTON_ICON_INSTANCE, useExisting: ButtonIcon }, { provide: PARENT_INSTANCE, useExisting: ButtonIcon }],
    standalone: true,
    host: {
        '[class.p-button-icon]': '!$unstyled() && true'
    },
    hostDirectives: [Bind]
})
export class ButtonIcon extends BaseComponent {
    componentName = 'ButtonIcon';

    /**
     * Used to pass attributes to DOM elements inside the hButtonIcon.
     * @defaultValue undefined
     * @deprecated use pButtonIconPT instead.
     * @group Props
     */
    ptButtonIcon = input<any>();
    /**
     * Used to pass attributes to DOM elements inside the hButtonIcon.
     * @defaultValue undefined
     * @group Props
     */
    pButtonIconPT = input<any>();
    /**
     * Indicates whether the component should be rendered without styles.
     * @defaultValue undefined
     * @group Props
     */
    pButtonUnstyled = input<boolean | undefined>();

    $pcButtonIcon: ButtonIcon | undefined = inject(BUTTON_ICON_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        effect(() => {
            const pt = this.ptButtonIcon() || this.pButtonIconPT();
            pt && this.directivePT.set(pt);
        });

        effect(() => {
            this.pButtonUnstyled() && this.directiveUnstyled.set(this.pButtonUnstyled());
        });
    }

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }
}
/**
 * Button directive is an extension to button component.
 * @group Components
 */
@Directive({
    selector: '[hButton]',
    standalone: true,
    providers: [ButtonStyle, { provide: BUTTON_DIRECTIVE_INSTANCE, useExisting: ButtonDirective }, { provide: PARENT_INSTANCE, useExisting: ButtonDirective }],
    host: {
        '[class.p-button-icon-only]': '!$unstyled() && isIconOnly()',
        '[class.p-button-text]': ' !$unstyled() && isTextButton()'
    },
    hostDirectives: [Bind]
})
export class ButtonDirective extends BaseComponent {
    componentName = 'Button';

    $pcButtonDirective: ButtonDirective | undefined = inject(BUTTON_DIRECTIVE_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(ButtonStyle);

    /**
     * Used to pass attributes to DOM elements inside the Button component.
     * @defaultValue undefined
     * @deprecated use pButtonPT instead.
     * @group Props
     */
    ptButtonDirective = input<ButtonPassThrough>();
    /**
     * Used to pass attributes to DOM elements inside the Button component.
     * @defaultValue undefined
     * @group Props
     */
    pButtonPT = input<ButtonPassThrough>();
    /**
     * Indicates whether the component should be rendered without styles.
     * @defaultValue undefined
     * @group Props
     */
    pButtonUnstyled = input<boolean | undefined>();

    readonly hostName = input<any>('');

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('root'));
    }

    constructor() {
        super();
        effect(() => {
            const pt = this.ptButtonDirective() || this.pButtonPT();
            pt && this.directivePT.set(pt);
        });

        effect(() => {
            this.pButtonUnstyled() && this.directiveUnstyled.set(this.pButtonUnstyled());
        });

        effect(() => {
            const unstyled = this.$unstyled();

            if (this.initialized && unstyled) {
                this.setStyleClass();
            }
        });

        effect(() => {
            this.label();
            this.icon();
            this.loading();
            this.severity();

            if (this.initialized) {
                this.updateLabel();
                this.updateIcon();
                this.setStyleClass();
            }
        });

        effect(() => {
            const val = this.buttonProps();
            if (val && typeof val === 'object') {
                Object.entries(val).forEach(([k, v]) => this[`_${k}`] !== v && (this[`_${k}`] = v));
            }
        });
    }

    /**
     * Add a textual class to the button without a background initially.
     * @group Props
     */
    readonly text = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Add a plain textual class to the button without a background initially.
     * @group Props
     */
    readonly plain = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Add a shadow to indicate elevation.
     * @group Props
     */
    readonly raised = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Defines the size of the button.
     * @group Props
     */
    readonly size = input<'small' | 'large'>();

    /**
     * Add a border class without a background initially.
     * @group Props
     */
    readonly outlined = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Add a circular border radius to the button.
     * @group Props
     */
    readonly rounded = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Position of the icon.
     * @group Props
     */
    readonly iconPos = input<ButtonIconPosition>('left');

    /**
     * Icon to display in loading state.
     * @group Props
     */
    readonly loadingIcon = input<string>();

    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue undefined
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });

    private iconSignal = contentChild(ButtonIcon);

    private labelSignal = contentChild(ButtonLabel);

    isIconOnly = computed(() => !!(!this.labelSignal() && this.iconSignal()));


    public initialized: boolean | undefined;

    private get htmlElement(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    private _internalClasses: string[] = Object.values(INTERNAL_BUTTON_CLASSES);

    pcFluid: Fluid | null = inject(Fluid, { optional: true, host: true, skipSelf: true });

    isTextButton = computed(() => !!(!this.iconSignal() && this.labelSignal() && this.text()));

    /**
     * Text of the button.
     * @deprecated use hButtonLabel directive instead.
     * @group Props
     */
    readonly label = input<string | undefined>(undefined);

    /**
     * Name of the icon.
     * @deprecated use hButtonIcon directive instead
     * @group Props
     */
    readonly icon = input<string | undefined>(undefined);

    /**
     * Whether the button is in loading state.
     * @group Props
     */
    readonly loading = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @deprecated assign props directly to the button element.
     * @group Props
     */
    readonly buttonProps = input<ButtonProps | undefined>(undefined);

    /**
     * Defines the style of the button.
     * @group Props
     */
    readonly severity = input<ButtonSeverity | undefined>(undefined);

    spinnerIcon = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="p-icon-spin">
        <g clip-path="url(#clip0_417_21408)">
            <path
                d="M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z"
                fill="currentColor"
            />
        </g>
        <defs>
            <clipPath id="clip0_417_21408">
                <rect width="14" height="14" fill="white" />
            </clipPath>
        </defs>
    </svg>`;

    onAfterViewInit() {
        !this.$unstyled() && addClass(this.htmlElement, this.getStyleClass().join(' '));

        if (isPlatformBrowser(this.platformId)) {
            this.createIcon();
            this.createLabel();
            this.initialized = true;
        }
    }

    getStyleClass(): string[] {
        const styleClass: string[] = [INTERNAL_BUTTON_CLASSES.button, INTERNAL_BUTTON_CLASSES.component];

        if (this.icon() && !this.label() && isEmpty(this.htmlElement.textContent)) {
            styleClass.push(INTERNAL_BUTTON_CLASSES.iconOnly);
        }

        if (this.loading()) {
            styleClass.push(INTERNAL_BUTTON_CLASSES.disabled, INTERNAL_BUTTON_CLASSES.loading);

            if (!this.icon() && this.label()) {
                styleClass.push(INTERNAL_BUTTON_CLASSES.labelOnly);
            }

            if (this.icon() && !this.label() && !isEmpty(this.htmlElement.textContent)) {
                styleClass.push(INTERNAL_BUTTON_CLASSES.iconOnly);
            }
        }

        if (this.text()) {
            styleClass.push('p-button-text');
        }

        if (this.severity()) {
            styleClass.push(`p-button-${this.severity()}`);
        }

        if (this.plain()) {
            styleClass.push('p-button-plain');
        }

        if (this.raised()) {
            styleClass.push('p-button-raised');
        }

        const size = this.size();
        if (size) {
            styleClass.push(`p-button-${size}`);
        }

        if (this.outlined()) {
            styleClass.push('p-button-outlined');
        }

        if (this.rounded()) {
            styleClass.push('p-button-rounded');
        }

        if (size === 'small') {
            styleClass.push('p-button-sm');
        }

        if (size === 'large') {
            styleClass.push('p-button-lg');
        }

        if (this.hasFluid) {
            styleClass.push('p-button-fluid');
        }

        return this.$unstyled() ? [] : styleClass;
    }

    get hasFluid() {
        return this.fluid() ?? !!this.pcFluid;
    }

    setStyleClass() {
        const styleClass = this.getStyleClass();
        this.removeExistingSeverityClass();

        this.htmlElement.classList.remove(...this._internalClasses);
        this.htmlElement.classList.add(...styleClass);
    }

    removeExistingSeverityClass() {
        const severityArray = ['success', 'info', 'warn', 'danger', 'help', 'primary', 'secondary', 'contrast'];
        const existingSeverityClass = this.htmlElement.classList.value.split(' ').find((cls) => severityArray.some((severity) => cls === `p-button-${severity}`));

        if (existingSeverityClass) {
            this.htmlElement.classList.remove(existingSeverityClass);
        }
    }

    createLabel() {
        const created = findSingle(this.htmlElement, '[data-pc-section="buttonlabel"]');
        const labelVal = this.label();
        if (!created && labelVal) {
            let labelElement = <HTMLElement>createElement('span', { class: this.cx('label'), 'p-bind': this.ptm('buttonlabel'), 'aria-hidden': this.icon() && !labelVal ? 'true' : null });
            labelElement.appendChild(this.document.createTextNode(labelVal));
            this.htmlElement.appendChild(labelElement);
        }
    }

    createIcon() {
        const created = findSingle(this.htmlElement, '[data-pc-section="buttonicon"]');
        if (!created && (this.icon() || this.loading())) {
            let iconPosClass = this.label() && !this.$unstyled() ? 'p-button-icon-' + this.iconPos() : null;
            let iconClass = !this.$unstyled() && this.getIconClass();
            let iconElement: HTMLElement = <HTMLElement>createElement('span', { class: this.cn(this.cx('icon'), iconPosClass, iconClass), 'aria-hidden': 'true', 'p-bind': this.ptm('buttonicon') });

            if (!this.loadingIcon() && this.loading()) {
                iconElement.innerHTML = this.spinnerIcon;
            }

            this.htmlElement.insertBefore(iconElement, this.htmlElement.firstChild);
        }
    }

    updateLabel() {
        let labelElement = findSingle(this.htmlElement, '[data-pc-section="buttonlabel"]');
        const labelVal = this.label();

        if (!labelVal) {
            labelElement && this.htmlElement.removeChild(labelElement);
            return;
        }

        labelElement ? (labelElement.textContent = labelVal) : this.createLabel();
    }

    updateIcon() {
        let iconElement = findSingle(this.htmlElement, '[data-pc-section="buttonicon"]');
        let labelElement = findSingle(this.htmlElement, '[data-pc-section="buttonlabel"]');

        if (this.loading() && !this.loadingIcon() && iconElement) {
            iconElement.innerHTML = this.spinnerIcon;
        } else if (iconElement?.innerHTML) {
            iconElement.innerHTML = '';
        }

        if (iconElement && !this.$unstyled()) {
            const iconPos = this.iconPos();
            if (iconPos) {
                iconElement.className = 'p-button-icon ' + (labelElement ? 'p-button-icon-' + iconPos : '') + ' ' + this.getIconClass();
            } else {
                iconElement.className = 'p-button-icon ' + this.getIconClass();
            }
        } else {
            this.createIcon();
        }
    }

    getIconClass() {
        const loadingIcon = this.loadingIcon();
        return this.loading() ? 'p-button-loading-icon ' + (loadingIcon ? loadingIcon : 'p-icon') : this.icon() || 'p-hidden';
    }

    onDestroy() {
        this.initialized = false;
    }
}
/**
 * Button is an extension to standard button element with icons and theming.
 * @group Components
 */
@Component({
    selector: 'h-button',
    standalone: true,
    imports: [CommonModule, Ripple, AutoFocus, SpinnerIcon, BadgeModule, SharedModule, Bind],
    templateUrl: './button.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ButtonStyle, { provide: BUTTON_INSTANCE, useExisting: Button }, { provide: PARENT_INSTANCE, useExisting: Button }],
    hostDirectives: [Bind]
})
export class Button extends BaseComponent<ButtonPassThrough> {
    componentName = 'Button';

    readonly hostName = input<any>('');

    $pcButton: Button | undefined = inject(BUTTON_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(ButtonStyle);

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('host'));
    }

    /**
     * Type of the button.
     * @group Props
     */
    readonly type = input<string>('button');

    /**
     * Value of the badge.
     * @group Props
     */
    readonly badge = input<string>();

    /**
     * When present, it specifies that the component should be disabled.
     * @group Props
     */
    readonly disabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Add a shadow to indicate elevation.
     * @group Props
     */
    readonly raised = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Add a circular border radius to the button.
     * @group Props
     */
    readonly rounded = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Add a textual class to the button without a background initially.
     * @group Props
     */
    readonly text = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Add a plain textual class to the button without a background initially.
     * @group Props
     */
    readonly plain = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Add a border class without a background initially.
     * @group Props
     */
    readonly outlined = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Add a link style to the button.
     * @group Props
     */
    readonly link = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Add a tabindex to the button.
     * @group Props
     */
    readonly tabindex = input<number, unknown>(undefined, { transform: numberAttribute });

    /**
     * Defines the size of the button.
     * @group Props
     */
    readonly size = input<'small' | 'large'>();

    /**
     * Specifies the variant of the component.
     * @group Props
     */
    readonly variant = input<'outlined' | 'text'>();

    /**
     * Inline style of the element.
     * @group Props
     */
    readonly style = input<{
    [klass: string]: any;
} | null>();

    /**
     * Class of the element.
     * @group Props
     */
    readonly styleClass = input<string>();

    /**
     * Style class of the badge.
     * @group Props
     * @deprecated use badgeSeverity instead.
     */
    readonly badgeClass = input<string>();

    /**
     * Severity type of the badge.
     * @group Props
     * @defaultValue secondary
     */
    readonly badgeSeverity = input<'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | null | undefined>('secondary');

    /**
     * Used to define a string that autocomplete attribute the current element.
     * @group Props
     */
    readonly ariaLabel = input<string>();

    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    readonly autofocus = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Position of the icon.
     * @group Props
     */
    readonly iconPos = input<ButtonIconPosition>('left');

    /**
     * Name of the icon.
     * @group Props
     */
    readonly icon = input<string>();

    /**
     * Text of the button.
     * @group Props
     */
    readonly label = input<string>();

    /**
     * Whether the button is in loading state.
     * @group Props
     */
    readonly loading = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Icon to display in loading state.
     * @group Props
     */
    readonly loadingIcon = input<string>();

    /**
     * Defines the style of the button.
     * @group Props
     */
    readonly severity = input<ButtonSeverity>();

    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    readonly buttonProps = input<ButtonProps>();

    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue undefined
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });

    /**
     * Callback to execute when button is clicked.
     * This event is intended to be used with the <h-button> component. Using a regular <button> element, use (click).
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    readonly onClick = output<MouseEvent>();

    /**
     * Callback to execute when button is focused.
     * This event is intended to be used with the <h-button> component. Using a regular <button> element, use (focus).
     * @param {FocusEvent} event - Focus event.
     * @group Emits
     */
    readonly onFocus = output<FocusEvent>();

    /**
     * Callback to execute when button loses focus.
     * This event is intended to be used with the <h-button> component. Using a regular <button> element, use (blur).
     * @param {FocusEvent} event - Focus event.
     * @group Emits
     */
    readonly onBlur = output<FocusEvent>();

    /**
     * Custom content template.
     * @group Templates
     **/
    readonly contentTemplate = contentChild<TemplateRef<void>>('content');

    /**
     * Custom loading icon template.
     * @group Templates
     **/
    readonly loadingIconTemplate = contentChild<TemplateRef<ButtonLoadingIconTemplateContext>>('loadingicon');

    /**
     * Custom icon template.
     * @group Templates
     **/
    readonly iconTemplate = contentChild<TemplateRef<ButtonIconTemplateContext>>('icon');

    readonly templates = contentChildren(PrimeTemplate);

    pcFluid: Fluid | null = inject(Fluid, { optional: true, host: true, skipSelf: true });

    get hasFluid() {
        return this.fluid() ?? !!this.pcFluid;
    }

    get hasIcon() {
        return this.icon() || this.buttonProps()?.icon || this.iconTemplate() || this._iconTemplate || this.loadingIcon() || this.loadingIconTemplate() || this._loadingIconTemplate;
    }

    _contentTemplate: TemplateRef<void> | undefined;

    _iconTemplate: TemplateRef<ButtonIconTemplateContext> | undefined;

    _loadingIconTemplate: TemplateRef<ButtonLoadingIconTemplateContext> | undefined;

    onAfterContentInit() {
        this.templates()?.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this._contentTemplate = item.template;
                    break;

                case 'icon':
                    this._iconTemplate = item.template;
                    break;

                case 'loadingicon':
                    this._loadingIconTemplate = item.template;
                    break;

                default:
                    this._contentTemplate = item.template;
                    break;
            }
        });
    }

    get dataP() {
        const iconPos = this.iconPos();
        return this.cn({
            [this.size() as string]: this.size(),
            'icon-only': this.hasIcon && !this.label() && !this.badge(),
            loading: this.loading(),
            fluid: this.hasFluid,
            rounded: this.rounded(),
            raised: this.raised(),
            outlined: this.outlined() || this.variant() === 'outlined',
            text: this.text() || this.variant() === 'text',
            link: this.link(),
            vertical: (iconPos === 'top' || iconPos === 'bottom') && this.label()
        });
    }

    get dataIconP() {
        return this.cn({
            [this.iconPos()]: this.iconPos(),
            [this.size() as string]: this.size()
        });
    }

    get dataLabelP() {
        return this.cn({
            [this.size() as string]: this.size(),
            'icon-only': this.hasIcon && !this.label() && !this.badge()
        });
    }
}

@NgModule({
    imports: [CommonModule, ButtonDirective, Button, SharedModule, ButtonLabel, ButtonIcon],
    exports: [ButtonDirective, Button, ButtonLabel, ButtonIcon, SharedModule]
})
export class ButtonModule {}
