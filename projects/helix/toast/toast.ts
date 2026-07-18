import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  InjectionToken,
  input,
  model,
  NgModule,
  NgZone,
  numberAttribute,
  output,
  signal,
  TemplateRef,
  ViewEncapsulation,
  contentChild,
  contentChildren
} from '@angular/core';
import { MotionEvent, MotionOptions } from '@primeuix/motion';
import { isEmpty, setAttribute, uuid } from '@primeuix/utils';
import { MessageService, PrimeTemplate, SharedModule, ToastMessageOptions } from '@gravionlabs/helix/api';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind } from '@gravionlabs/helix/bind';
import { CheckIcon, ExclamationTriangleIcon, InfoCircleIcon, TimesCircleIcon, TimesIcon } from '@gravionlabs/helix/icons';
import { MotionModule } from '@gravionlabs/helix/motion';
import { ToastCloseEvent, ToastHeadlessTemplateContext, ToastItemCloseEvent, ToastMessageTemplateContext, ToastPassThrough, ToastPositionType } from '@gravionlabs/helix/types/toast';
import { ZIndexUtils } from '@gravionlabs/helix/utils';
import { Subscription } from 'rxjs';
import { ToastStyle } from './style/toaststyle';

const TOAST_INSTANCE = new InjectionToken<Toast>('TOAST_INSTANCE');

@Component({
    selector: 'h-toastItem',
    standalone: true,
    imports: [CommonModule, CheckIcon, ExclamationTriangleIcon, InfoCircleIcon, TimesIcon, TimesCircleIcon, SharedModule, Bind, MotionModule],
    templateUrl: './toastitem.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ToastStyle]
})
export class ToastItem extends BaseComponent<ToastPassThrough> {
    readonly message = input<ToastMessageOptions | null | undefined>(undefined);

    readonly index = input<number | null, unknown>(undefined, { transform: numberAttribute });

    readonly life = input<number, unknown>(undefined!, { transform: numberAttribute });

    readonly template = input<TemplateRef<ToastMessageTemplateContext>>();

    readonly headlessTemplate = input<TemplateRef<ToastHeadlessTemplateContext> | undefined>(undefined);

    readonly showTransformOptions = input<string>();

    readonly hideTransformOptions = input<string>();

    readonly showTransitionOptions = input<string>();

    readonly hideTransitionOptions = input<string>();

    motionOptions = input<MotionOptions>();

    clearAll = input<any>(null);

    onAnimationStart = output<HTMLElement>();

    onAnimationEnd = output<HTMLElement>();

    onBeforeEnter(event: MotionEvent) {
        this.onAnimationStart.emit(event.element as HTMLElement);
    }

    onAfterLeave(event: MotionEvent) {
        if (!this.visible() && !this.isDestroyed) {
            this.onClose.emit({
                index: <number>this.index(),
                message: <ToastMessageOptions>this.message()
            });

            if (!this.isDestroyed) {
                this.onAnimationEnd.emit(event.element as HTMLElement);
            }
        }
    }

    readonly onClose = output<ToastItemCloseEvent>();

    _componentStyle = inject(ToastStyle);

    timeout: any;

    visible = signal<boolean | undefined>(undefined);

    private isDestroyed = false;

    private isClosing = false;

    constructor(private zone: NgZone) {
        super();

        effect(() => {
            if (this.clearAll()) {
                this.visible.set(false);
            }
        });
    }

    onAfterViewInit() {
        this.message()?.sticky && this.visible.set(true);
        this.initTimeout();
    }

    initTimeout() {
        if (!this.message()?.sticky) {
            this.clearTimeout();
            this.zone.runOutsideAngular(() => {
                this.visible.set(true);
                this.timeout = setTimeout(
                    () => {
                        this.visible.set(false);
                    },
                    this.message()?.life || this.life() || 3000
                );
            });
        }
    }

    clearTimeout() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

    onMouseEnter() {
        this.clearTimeout();
    }

    onMouseLeave() {
        if (!this.isClosing) {
            this.initTimeout();
        }
    }

    onCloseIconClick = (event: Event) => {
        this.isClosing = true;
        this.clearTimeout();
        this.visible.set(false);
        event.preventDefault();
    };

    get closeAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.close : undefined;
    }

    onDestroy() {
        this.isDestroyed = true;
        this.clearTimeout();
        this.visible.set(false);
    }

    get dataP() {
        return this.cn({
            [this.message()?.severity as string]: this.message()?.severity
        });
    }
}

/**
 * Toast is used to display messages in an overlay.
 * @group Components
 */
@Component({
    selector: 'h-toast',
    standalone: true,
    imports: [CommonModule, ToastItem, SharedModule],
    templateUrl: './toast.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ToastStyle, { provide: TOAST_INSTANCE, useExisting: Toast }, { provide: PARENT_INSTANCE, useExisting: Toast }],
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[style]': "sx('root')",
        '[attr.data-p]': 'dataP'
    },
    hostDirectives: [Bind]
})
export class Toast extends BaseComponent<ToastPassThrough> {
    componentName = 'Toast';

    $pcToast: Toast | undefined = inject(TOAST_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }
    /**
     * Key of the message in case message is targeted to a specific toast component.
     * @group Props
     */
    readonly key = input<string>();
    /**
     * Whether to automatically manage layering.
     * @group Props
     */
    readonly autoZIndex = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Base zIndex value to use in layering.
     * @group Props
     */
    readonly baseZIndex = input<number, unknown>(0, { transform: numberAttribute });
    /**
     * The default time to display messages for in milliseconds.
     * @group Props
     */
    readonly life = input<number, unknown>(3000, { transform: numberAttribute });
    /**
     * Inline class of the component.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    readonly styleClass = input<string>();
    /**
     * Position of the toast in viewport.
     * @group Props
     */
    readonly position = model<ToastPositionType>('top-right');

    /**
     * It does not add the new message if there is already a toast displayed with the same content
     * @group Props
     */
    readonly preventOpenDuplicates = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Displays only once a message with the same content.
     * @group Props
     */
    readonly preventDuplicates = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Transform options of the show animation.
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    readonly showTransformOptions = input<string>('translateY(100%)');
    /**
     * Transform options of the hide animation.
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    readonly hideTransformOptions = input<string>('translateY(-100%)');
    /**
     * Transition options of the show animation.
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    readonly showTransitionOptions = input<string>('300ms ease-out');
    /**
     * Transition options of the hide animation.
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    readonly hideTransitionOptions = input<string>('250ms ease-in');
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
     * Object literal to define styles per screen size.
     * @group Props
     */
    readonly breakpoints = input<{
    [key: string]: any;
}>();
    /**
     * Callback to invoke when a message is closed.
     * @param {ToastCloseEvent} event - custom close event.
     * @group Emits
     */
    readonly onClose = output<ToastCloseEvent>();
    /**
     * Custom message template.
     * @param {ToastMessageTemplateContext} context - message context.
     * @see {@link ToastMessageTemplateContext}
     * @group Templates
     */
    readonly template = contentChild<TemplateRef<ToastMessageTemplateContext>>('message');
    /**
     * Custom headless template.
     * @param {ToastHeadlessTemplateContext} context - headless context.
     * @see {@link ToastHeadlessTemplateContext}
     * @group Templates
     */
    readonly headlessTemplate = contentChild<TemplateRef<ToastHeadlessTemplateContext>>('headless');

    messageSubscription: Subscription | undefined;

    clearSubscription: Subscription | undefined;

    messages: ToastMessageOptions[] | null | undefined;

    messagesArchieve: ToastMessageOptions[] | undefined;



    messageService: MessageService = inject(MessageService);

    _componentStyle = inject(ToastStyle);

    styleElement: any;

    id: string = uuid('pn_id_');

    readonly templates = contentChildren(PrimeTemplate);

    clearAllTrigger = signal<{} | null>(null);

    constructor() {
        super();
    }

    onInit() {
        this.messageSubscription = this.messageService.messageObserver.subscribe((messages) => {
            if (messages) {
                if (Array.isArray(messages)) {
                    const filteredMessages = messages.filter((m) => this.canAdd(m));
                    this.add(filteredMessages);
                } else if (this.canAdd(messages)) {
                    this.add([messages]);
                }
            }
        });

        this.clearSubscription = this.messageService.clearObserver.subscribe((key) => {
            if (key) {
                if (this.key() === key) {
                    this.clearAll();
                }
            } else {
                this.clearAll();
            }

            this.cd.markForCheck();
        });
    }

    clearAll() {
        // trigger signal to clear all messages
        this.clearAllTrigger.set({});
    }

    _template: TemplateRef<ToastMessageTemplateContext> | undefined;

    _headlessTemplate: TemplateRef<ToastHeadlessTemplateContext> | undefined;

    onAfterContentInit() {
        this.templates()?.forEach((item) => {
            switch (item.getType()) {
                case 'message':
                    this._template = item.template;
                    break;
                case 'headless':
                    this._headlessTemplate = item.template;
                    break;

                default:
                    this._template = item.template;
                    break;
            }
        });
    }

    onAfterViewInit() {
        if (this.breakpoints()) {
            this.createStyle();
        }
    }

    add(messages: ToastMessageOptions[]): void {
        this.messages = this.messages ? [...this.messages, ...messages] : [...messages];

        if (this.preventDuplicates()) {
            this.messagesArchieve = this.messagesArchieve ? [...this.messagesArchieve, ...messages] : [...messages];
        }

        this.cd.markForCheck();
    }

    canAdd(message: ToastMessageOptions): boolean {
        let allow = this.key() === message.key;

        if (allow && this.preventOpenDuplicates()) {
            allow = !this.containsMessage(this.messages!, message);
        }

        if (allow && this.preventDuplicates()) {
            allow = !this.containsMessage(this.messagesArchieve!, message);
        }

        return allow;
    }

    containsMessage(collection: ToastMessageOptions[], message: ToastMessageOptions): boolean {
        if (!collection) {
            return false;
        }

        return (
            collection.find((m) => {
                return m.summary === message.summary && m.detail == message.detail && m.severity === message.severity;
            }) != null
        );
    }

    onMessageClose(event: ToastItemCloseEvent) {
        this.messages?.splice(event.index, 1);

        this.onClose.emit({
            message: event.message
        });
        this.onAnimationEnd();
        this.cd.detectChanges();
    }

    onAnimationStart() {
        this.renderer.setAttribute(this.el?.nativeElement, this.id, '');
        if (this.autoZIndex() && this.el?.nativeElement.style.zIndex === '') {
            ZIndexUtils.set('modal', this.el?.nativeElement, this.baseZIndex() || this.config.zIndex.modal);
        }
    }

    onAnimationEnd() {
        if (this.autoZIndex() && isEmpty(this.messages)) {
            ZIndexUtils.clear(this.el?.nativeElement);
        }
    }

    createStyle() {
        const bps = this.breakpoints();
        if (!this.styleElement) {
            this.styleElement = this.renderer.createElement('style');
            this.styleElement.type = 'text/css';
            setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
            this.renderer.appendChild(this.document.head, this.styleElement);
            let innerHTML = '';
            for (let breakpoint in bps) {
                let breakpointStyle = '';
                for (let styleProp in bps[breakpoint]) {
                    breakpointStyle += styleProp + ':' + bps[breakpoint][styleProp] + ' !important;';
                }
                innerHTML += `
                    @media screen and (max-width: ${breakpoint}) {
                        .p-toast[${this.id}] {
                           ${breakpointStyle}
                        }
                    }
                `;
            }

            this.renderer.setProperty(this.styleElement, 'innerHTML', innerHTML);
            setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
        }
    }

    destroyStyle() {
        if (this.styleElement) {
            this.renderer.removeChild(this.document.head, this.styleElement);
            this.styleElement = null;
        }
    }

    onDestroy() {
        if (this.messageSubscription) {
            this.messageSubscription.unsubscribe();
        }

        if (this.el && this.autoZIndex()) {
            ZIndexUtils.clear(this.el.nativeElement);
        }

        if (this.clearSubscription) {
            this.clearSubscription.unsubscribe();
        }

        this.destroyStyle();
    }

    get dataP() {
        return this.cn({
            [this.position()]: this.position()
        });
    }
}

@NgModule({
    imports: [Toast, SharedModule],
    exports: [Toast, SharedModule]
})
export class ToastModule {}
