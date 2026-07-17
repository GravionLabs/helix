import { CommonModule, isPlatformBrowser } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, Directive, effect, ElementRef, forwardRef, inject, InjectionToken, input, Input, NgModule, NgZone, numberAttribute, Pipe, PipeTransform, signal, TemplateRef, ViewEncapsulation, output, viewChild, contentChild, contentChildren } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MotionOptions } from '@primeuix/motion';
import { absolutePosition, addClass, hasClass, isTouchDevice, removeClass } from '@primeuix/utils';
import { OverlayOptions, OverlayService, PrimeTemplate, SharedModule, TranslationKeys } from '@gravionlabs/helix/api';
import { AutoFocus } from '@gravionlabs/helix/autofocus';
import { PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { BaseEditableHolder } from '@gravionlabs/helix/baseeditableholder';
import { BaseInput } from '@gravionlabs/helix/baseinput';
import { Bind, BindModule } from '@gravionlabs/helix/bind';
import { ConnectedOverlayScrollHandler, DomHandler } from '@gravionlabs/helix/dom';
import { Fluid } from '@gravionlabs/helix/fluid';
import { EyeIcon, EyeSlashIcon, TimesIcon } from '@gravionlabs/helix/icons';
import { InputText } from '@gravionlabs/helix/inputtext';
import { Overlay } from '@gravionlabs/helix/overlay';
import { Nullable, VoidListener } from '@gravionlabs/helix/ts-helpers';
import type { PasswordIconTemplateContext, PasswordPassThrough } from '@gravionlabs/helix/types/password';
import { Subscription } from 'rxjs';
import { PasswordStyle } from './style/passwordstyle';

const PASSWORD_DIRECTIVE_INSTANCE = new InjectionToken<PasswordDirective>('PASSWORD_DIRECTIVE_INSTANCE');

const PASSWORD_INSTANCE = new InjectionToken<Password>('PASSWORD_INSTANCE');

type Meter = {
    strength: string;
    width: string;
};
/**
 * Password directive.
 * @group Components
 */
@Directive({
    selector: '[hPassword]',
    standalone: true,
    host: {
        '[class]': "cx('rootDirective')",
        '(input)': 'onInput($event)',
        '(focus)': 'onFocus()',
        '(blur)': 'onBlur()',
        '(keyup)': 'onKeyup($event)'
    },
    providers: [PasswordStyle, { provide: PASSWORD_DIRECTIVE_INSTANCE, useExisting: PasswordDirective }, { provide: PARENT_INSTANCE, useExisting: PasswordDirective }],
    hostDirectives: [Bind]
})
export class PasswordDirective extends BaseEditableHolder {
    bindDirectiveInstance = inject(Bind, { self: true });

    $pcPasswordDirective: PasswordDirective | undefined = inject(PASSWORD_DIRECTIVE_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    /**
     * Used to pass attributes to DOM elements inside the Password component.
     * @defaultValue undefined
     * @group Props
     */
    pPasswordPT = input<PasswordPassThrough | undefined>();
    /**
     * Indicates whether the component should be rendered without styles.
     * @defaultValue undefined
     * @group Props
     */
    pPasswordUnstyled = input<boolean | undefined>();

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }
    /**
     * Text to prompt password entry. Defaults to Helix I18N API configuration.
     * @group Props
     */
    readonly promptLabel = input<string>('Enter a password');
    /**
     * Text for a weak password. Defaults to Helix I18N API configuration.
     * @group Props
     */
    readonly weakLabel = input<string>('Weak');
    /**
     * Text for a medium password. Defaults to Helix I18N API configuration.
     * @group Props
     */
    readonly mediumLabel = input<string>('Medium');
    /**
     * Text for a strong password. Defaults to Helix I18N API configuration.
     * @group Props
     */
    readonly strongLabel = input<string>('Strong');
    /**
     * Whether to show the strength indicator or not.
     * @group Props
     */
    readonly feedback = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Sets the visibility of the password field.
     * @defaultValue false
     * @type boolean
     * @group Props
     */
    readonly showPassword = input<boolean>(false);
    /**
     * Specifies the input variant of the component.
     * @defaultValue 'outlined'
     * @group Props
     */
    variant = input<'filled' | 'outlined' | undefined>();
    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue false
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });
    /**
     * Specifies the size of the component.
     * @defaultValue undefined
     * @group Props
     */
    size = input<'large' | 'small' | undefined>(undefined, { alias: 'pSize' });

    pcFluid: Fluid | null = inject(Fluid, { optional: true, host: true, skipSelf: true });

    $variant = computed(() => this.variant() || this.config.inputStyle() || this.config.inputVariant());

    get hasFluid() {
        return this.fluid() ?? !!this.pcFluid;
    }

    panel: Nullable<HTMLDivElement>;

    meter: Nullable<HTMLDivElement>;

    info: Nullable<HTMLDivElement>;

    filled: Nullable<boolean>;

    content: Nullable<HTMLDivElement>;

    label: Nullable<HTMLLabelElement>;

    scrollHandler: Nullable<ConnectedOverlayScrollHandler>;

    documentResizeListener: VoidListener;

    _componentStyle = inject(PasswordStyle);

    constructor(public zone: NgZone) {
        super();

        effect(() => {
            this.el.nativeElement.type = this.showPassword() ? 'text' : 'password';
        });

        effect(() => {
            const pt = this.pPasswordPT();
            pt && this.directivePT.set(pt);
        });

        effect(() => {
            this.pPasswordUnstyled() && this.directiveUnstyled.set(this.pPasswordUnstyled());
        });
    }

    onInput(e: Event) {
        this.writeModelValue(this.el.nativeElement.value);
    }

    createPanel() {
        if (isPlatformBrowser(this.platformId)) {
            this.panel = this.renderer.createElement('div');
            this.renderer.addClass(this.panel, 'p-password-overlay');
            this.renderer.addClass(this.panel, 'p-component');

            this.content = this.renderer.createElement('div');
            this.renderer.addClass(this.content, 'p-password-content');
            this.renderer.appendChild(this.panel, this.content);

            this.meter = this.renderer.createElement('div');
            this.renderer.addClass(this.meter, 'p-password-meter');
            this.renderer.appendChild(this.content, this.meter);

            this.label = this.renderer.createElement('div');
            this.renderer.addClass(this.label, 'p-password-meter-label');
            this.renderer.appendChild(this.meter, this.label);

            this.info = this.renderer.createElement('div');
            this.renderer.addClass(this.info, 'p-password-meter-text');
            this.renderer.setProperty(this.info, 'textContent', this.promptLabel());
            this.renderer.appendChild(this.content, this.info);

            this.renderer.setStyle(this.panel, 'minWidth', `${this.el.nativeElement.offsetWidth}px`);
            this.renderer.appendChild(document.body, this.panel);
            this.updateMeter();
        }
    }

    showOverlay() {
        if (this.feedback()) {
            if (!this.panel) {
                this.createPanel();
            }

            this.renderer.setStyle(this.panel, 'zIndex', String(++DomHandler.zindex));
            this.renderer.setStyle(this.panel, 'display', 'block');
            this.zone.runOutsideAngular(() => {
                setTimeout(() => {
                    addClass(this.panel!, 'p-connected-overlay-visible');
                    this.bindScrollListener();
                    this.bindDocumentResizeListener();
                }, 1);
            });
            absolutePosition(this.panel!, this.el.nativeElement);
        }
    }

    hideOverlay() {
        if (this.feedback() && this.panel) {
            addClass(this.panel, 'p-connected-overlay-hidden');
            removeClass(this.panel, 'p-connected-overlay-visible');
            this.unbindScrollListener();
            this.unbindDocumentResizeListener();

            this.zone.runOutsideAngular(() => {
                setTimeout(() => {
                    this.onDestroy();
                }, 150);
            });
        }
    }

    onFocus() {
        this.showOverlay();
    }

    onBlur() {
        this.hideOverlay();
    }

    labelSignal = signal('');

    onKeyup(e: Event) {
        if (this.feedback()) {
            let value = (e.target as HTMLInputElement).value,
                label: string | null = null,
                meterPos: string | null = null;

            if (value.length === 0) {
                label = this.promptLabel();
                meterPos = '0px 0px';
            } else {
                var score = this.testStrength(value);

                if (score < 30) {
                    label = this.weakLabel();
                    meterPos = '0px -10px';
                } else if (score >= 30 && score < 80) {
                    label = this.mediumLabel();
                    meterPos = '0px -20px';
                } else if (score >= 80) {
                    label = this.strongLabel();
                    meterPos = '0px -30px';
                }

                this.labelSignal.set(label!);
                this.updateMeter();
            }

            if (!this.panel || !hasClass(this.panel, 'p-connected-overlay-visible')) {
                this.showOverlay();
            }

            if (this.meter) {
                this.renderer.setStyle(this.meter, 'backgroundPosition', meterPos);
            }

            if (this.info) {
                (this.info as HTMLDivElement).textContent = label;
            }
        }
    }

    updateMeter() {
        if (this.labelSignal() && this.meter && this.info) {
            const label = this.labelSignal();
            const strengthClass = this.strengthClass(label.toLowerCase());
            const width = this.getWidth(label.toLowerCase());

            this.renderer.addClass(this.meter, strengthClass);
            this.renderer.setStyle(this.meter, 'width', width);
            (this.info as HTMLDivElement).textContent = label;
        }
    }

    getWidth(label: string) {
        return label === 'weak' ? '33.33%' : label === 'medium' ? '66.66%' : label === 'strong' ? '100%' : '';
    }

    strengthClass(label) {
        return `p-password-meter${label ? `-${label}` : ''}`;
    }

    testStrength(str: string) {
        let grade: number = 0;
        let val: Nullable<RegExpMatchArray>;

        val = str.match('[0-9]');
        grade += this.normalize(val ? val.length : 1 / 4, 1) * 25;

        val = str.match('[a-zA-Z]');
        grade += this.normalize(val ? val.length : 1 / 2, 3) * 10;

        val = str.match('[!@#$%^&*?_~.,;=]');
        grade += this.normalize(val ? val.length : 1 / 6, 1) * 35;

        val = str.match('[A-Z]');
        grade += this.normalize(val ? val.length : 1 / 6, 1) * 30;

        grade *= str.length / 8;

        return grade > 100 ? 100 : grade;
    }

    normalize(x: number, y: number) {
        let diff = x - y;

        if (diff <= 0) return x / y;
        else return 1 + 0.5 * (x / (x + y / 4));
    }

    bindScrollListener() {
        if (!this.scrollHandler) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.el.nativeElement, () => {
                if (hasClass(this.panel!, 'p-connected-overlay-visible')) {
                    this.hideOverlay();
                }
            });
        }

        this.scrollHandler.bindScrollListener();
    }

    unbindScrollListener() {
        if (this.scrollHandler) {
            this.scrollHandler.unbindScrollListener();
        }
    }

    bindDocumentResizeListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.documentResizeListener) {
                const window = this.document.defaultView as Window;
                this.documentResizeListener = this.renderer.listen(window, 'resize', this.onWindowResize.bind(this));
            }
        }
    }

    unbindDocumentResizeListener() {
        if (this.documentResizeListener) {
            this.documentResizeListener();
            this.documentResizeListener = null;
        }
    }

    onWindowResize() {
        if (!isTouchDevice()) {
            this.hideOverlay();
        }
    }

    onDestroy() {
        if (this.panel) {
            if (this.scrollHandler) {
                this.scrollHandler.destroy();
                this.scrollHandler = null;
            }

            this.unbindDocumentResizeListener();

            this.renderer.removeChild(this.document.body, this.panel);
            this.panel = null;
            this.meter = null;
            this.info = null;
        }
    }
}

type Mapper<T, G> = (item: T, ...args: any[]) => G;

@Pipe({
    name: 'mapper',
    pure: true,
    standalone: true
})
export class MapperPipe implements PipeTransform {
    public transform<T, G>(value: T, mapper: Mapper<T, G>, ...args: unknown[]): G {
        return mapper(value, ...args);
    }
}

export const Password_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Password),
    multi: true
};
/**
 * Password displays strength indicator for password fields.
 * @group Components
 */
@Component({
    selector: 'h-password',
    standalone: true,
    imports: [CommonModule, InputText, AutoFocus, TimesIcon, EyeSlashIcon, EyeIcon, Overlay, SharedModule, BindModule],
    templateUrl: './password.html',
    providers: [Password_VALUE_ACCESSOR, PasswordStyle, { provide: PASSWORD_INSTANCE, useExisting: Password }, { provide: PARENT_INSTANCE, useExisting: Password }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[style]': "sx('root')",
        '[attr.data-p]': 'containerDataP'
    },
    hostDirectives: [Bind]
})
export class Password extends BaseInput<PasswordPassThrough> {
    componentName = 'Password';

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcPassword: Password | undefined = inject(PASSWORD_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    readonly ariaLabel = input<string>();
    /**
     * Specifies one or more IDs in the DOM that labels the input field.
     * @group Props
     */
    readonly ariaLabelledBy = input<string>();
    /**
     * Label of the input for accessibility.
     * @group Props
     */
    readonly label = input<string>();
    /**
     * Text to prompt password entry. Defaults to Helix I18N API configuration.
     * @group Props
     */
    readonly promptLabel = input<string>();
    /**
     * Regex value for medium regex.
     * @group Props
     */
    readonly mediumRegex = input<string>('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');
    /**
     * Regex value for strong regex.
     * @group Props
     */
    readonly strongRegex = input<string>('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})');
    /**
     * Text for a weak password. Defaults to Helix I18N API configuration.
     * @group Props
     */
    readonly weakLabel = input<string>();
    /**
     * Text for a medium password. Defaults to Helix I18N API configuration.
     * @group Props
     */
    readonly mediumLabel = input<string>();
    /**
     * specifies the maximum number of characters allowed in the input element.
     * @deprecated since v20.0.0, use maxlength instead.
     * @group Props
     */
    readonly maxLength = input<number, unknown>(undefined, { transform: numberAttribute });
    /**
     * Text for a strong password. Defaults to Helix I18N API configuration.
     * @group Props
     */
    readonly strongLabel = input<string>();
    /**
     * Identifier of the accessible input element.
     * @group Props
     */
    readonly inputId = input<string>();
    /**
     * Whether to show the strength indicator or not.
     * @group Props
     */
    readonly feedback = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether to show an icon to display the password as plain text.
     * @group Props
     */
    readonly toggleMask = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Style class of the input field.
     * @group Props
     */
    readonly inputStyleClass = input<string>();
    /**
     * Style class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    readonly styleClass = input<string>();
    /**
     * Inline style of the input field.
     * @group Props
     */
    readonly inputStyle = input<{
    [klass: string]: any;
} | null>();
    /**
     * Transition options of the show animation.
     * @group Props
     * @deprecated since v21.0.0, use `motionOptions` instead.
     */
    readonly showTransitionOptions = input<string>('.12s cubic-bezier(0, 0, 0.2, 1)');
    /**
     * Transition options of the hide animation.
     * @group Props
     * @deprecated since v21.0.0, use `motionOptions` instead.
     */
    readonly hideTransitionOptions = input<string>('.1s linear');
    /**
     * Specify automated assistance in filling out password by browser.
     * @group Props
     */
    readonly autocomplete = input<string>();
    /**
     * Advisory information to display on input.
     * @group Props
     */
    readonly placeholder = input<string>();
    /**
     * When enabled, a clear icon is displayed to clear the value.
     * @group Props
     */
    readonly showClear = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    readonly autofocus = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number, unknown>(undefined, { transform: numberAttribute });
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>('self');
    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);
    /**
     * Whether to use overlay API feature. The properties of overlay API can be used like an object in it.
     * @group Props
     */
    readonly overlayOptions = input<OverlayOptions>();
    /**
     * Callback to invoke when the component receives focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onFocus = output<Event>();
    /**
     * Callback to invoke when the component loses focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onBlur = output<Event>();
    /**
     * Callback to invoke when clear button is clicked.
     * @group Emits
     */
    readonly onClear = output<void>();

    readonly overlayViewChild = viewChild.required<Overlay>('overlay');

    readonly input = viewChild.required<ElementRef>('input');

    /**
     * Custom template of content.
     * @group Templates
     */
    readonly contentTemplate = contentChild<Nullable<TemplateRef<void>>>('content', { descendants: false });

    /**
     * Custom template of footer.
     * @group Templates
     */
    readonly footerTemplate = contentChild<Nullable<TemplateRef<void>>>('footer', { descendants: false });

    /**
     * Custom template of header.
     * @group Templates
     */
    readonly headerTemplate = contentChild<Nullable<TemplateRef<void>>>('header', { descendants: false });

    /**
     * Custom template of clear icon.
     * @group Templates
     */
    readonly clearIconTemplate = contentChild<Nullable<TemplateRef<void>>>('clearicon', { descendants: false });

    /**
     * Custom template of hide icon.
     * @param {PasswordIconTemplateContext} context - icon context.
     * @see {@link PasswordIconTemplateContext}
     * @group Templates
     */
    readonly hideIconTemplate = contentChild<Nullable<TemplateRef<PasswordIconTemplateContext>>>('hideicon', { descendants: false });

    /**
     * Custom template of show icon.
     * @param {PasswordIconTemplateContext} context - icon context.
     * @see {@link PasswordIconTemplateContext}
     * @group Templates
     */
    readonly showIconTemplate = contentChild<Nullable<TemplateRef<PasswordIconTemplateContext>>>('showicon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    _contentTemplate: TemplateRef<void> | undefined;

    _footerTemplate: TemplateRef<void> | undefined;

    _headerTemplate: TemplateRef<void> | undefined;

    _clearIconTemplate: TemplateRef<void> | undefined;

    _hideIconTemplate: TemplateRef<PasswordIconTemplateContext> | undefined;

    _showIconTemplate: TemplateRef<PasswordIconTemplateContext> | undefined;

    overlayVisible: boolean = false;

    meter: Nullable<Meter>;

    infoText: Nullable<string>;

    focused: boolean = false;

    unmasked: boolean = false;

    mediumCheckRegExp!: RegExp;

    strongCheckRegExp!: RegExp;

    resizeListener: VoidListener;

    scrollHandler: Nullable<ConnectedOverlayScrollHandler>;

    value: Nullable<string> = null;

    translationSubscription: Nullable<Subscription>;

    _componentStyle = inject(PasswordStyle);

    overlayService = inject(OverlayService);

    onInit() {
        this.infoText = this.promptText();
        this.mediumCheckRegExp = new RegExp(this.mediumRegex());
        this.strongCheckRegExp = new RegExp(this.strongRegex());
        this.translationSubscription = this.config.translationObserver.subscribe(() => {
            this.updateUI(this.value || '');
        });
    }

    onAfterContentInit() {
        this.templates().forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this._contentTemplate = item.template;
                    break;

                case 'header':
                    this._headerTemplate = item.template;
                    break;

                case 'footer':
                    this._footerTemplate = item.template;
                    break;

                case 'clearicon':
                    this._clearIconTemplate = item.template;
                    break;

                case 'hideicon':
                    this._hideIconTemplate = item.template;
                    break;

                case 'showicon':
                    this._showIconTemplate = item.template;
                    break;

                default:
                    this._contentTemplate = item.template;
                    break;
            }
        });
    }

    onInput(event: Event) {
        this.value = (event.target as HTMLInputElement).value;
        this.onModelChange(this.value);
    }

    onInputFocus(event: Event) {
        this.focused = true;
        if (this.feedback()) {
            this.overlayVisible = true;
        }

        this.onFocus.emit(event);
    }

    onInputBlur(event: Event) {
        this.focused = false;
        if (this.feedback()) {
            this.overlayVisible = false;
        }

        this.onModelTouched();
        this.onBlur.emit(event);
    }

    onKeyUp(event: KeyboardEvent) {
        if (this.feedback()) {
            let value = (event.target as HTMLInputElement).value;
            this.updateUI(value);

            if (event.code === 'Escape') {
                this.overlayVisible && (this.overlayVisible = false);

                return;
            }

            if (!this.overlayVisible) {
                this.overlayVisible = true;
            }
        }
    }

    updateUI(value: string) {
        let label = null;
        let meter: { strength: string; width: string } | null = null;

        switch (this.testStrength(value)) {
            case 1:
                label = this.weakText();
                meter = {
                    strength: 'weak',
                    width: '33.33%'
                };
                break;

            case 2:
                label = this.mediumText();
                meter = {
                    strength: 'medium',
                    width: '66.66%'
                };
                break;

            case 3:
                label = this.strongText();
                meter = {
                    strength: 'strong',
                    width: '100%'
                };
                break;

            default:
                label = this.promptText();
                meter = null;
                break;
        }

        this.meter = meter;
        this.infoText = label;
    }

    onMaskToggle() {
        this.unmasked = !this.unmasked;
    }

    onOverlayClick(event: Event) {
        this.overlayService.add({
            originalEvent: event,
            target: this.el.nativeElement
        });
    }

    testStrength(str: string) {
        let level = 0;

        if (this.strongCheckRegExp?.test(str)) level = 3;
        else if (this.mediumCheckRegExp?.test(str)) level = 2;
        else if (str.length) level = 1;

        return level;
    }

    promptText() {
        return this.promptLabel() || this.getTranslation(TranslationKeys.PASSWORD_PROMPT);
    }

    weakText() {
        return this.weakLabel() || this.getTranslation(TranslationKeys.WEAK);
    }

    mediumText() {
        return this.mediumLabel() || this.getTranslation(TranslationKeys.MEDIUM);
    }

    strongText() {
        return this.strongLabel() || this.getTranslation(TranslationKeys.STRONG);
    }

    inputType(unmasked: boolean) {
        return unmasked ? 'text' : 'password';
    }

    getTranslation(option: string) {
        return this.config.getTranslation(option);
    }

    clear() {
        this.value = null;
        this.onModelChange(this.value);
        this.writeValue(this.value);
        this.onClear.emit();
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        if (value === undefined) this.value = null;
        else this.value = value;

        if (this.feedback()) this.updateUI(this.value || '');
        setModelValue(this.value);
        this.cd.markForCheck();
    }

    onDestroy() {
        if (this.translationSubscription) {
            this.translationSubscription.unsubscribe();
        }
    }

    get containerDataP() {
        return this.cn({
            fluid: this.hasFluid
        });
    }

    get meterDataP() {
        return this.cn({
            [this.meter?.strength as string]: this.meter?.strength
        });
    }

    get overlayDataP() {
        return this.cn({
            ['overlay-' + this.$appendTo()]: 'overlay-' + this.$appendTo()
        });
    }
}

@NgModule({
    imports: [Password, PasswordDirective, SharedModule, BindModule],
    exports: [PasswordDirective, Password, SharedModule, BindModule]
})
export class PasswordModule {}
