import { CommonModule } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, InjectionToken, input, Input, NgModule, signal, TemplateRef, ViewEncapsulation, output, contentChildren, contentChild } from '@angular/core';
import { MotionOptions } from '@primeuix/motion';
import { PrimeTemplate, SharedModule } from '@gravionlabs/helix/api';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind } from '@gravionlabs/helix/bind';
import { TimesIcon } from '@gravionlabs/helix/icons';
import { MotionModule } from '@gravionlabs/helix/motion';
import { Ripple } from '@gravionlabs/helix/ripple';
import { MessageContainerTemplateContext, MessagePassThrough } from '@gravionlabs/helix/types/message';
import { MessageStyle } from './style/messagestyle';

const MESSAGE_INSTANCE = new InjectionToken<Message>('MESSAGE_INSTANCE');

/**
 * Message groups a collection of contents in tabs.
 * @group Components
 */
@Component({
    selector: 'h-message',
    standalone: true,
    imports: [CommonModule, TimesIcon, Ripple, SharedModule, Bind, MotionModule],
    templateUrl: './message.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [MessageStyle, { provide: MESSAGE_INSTANCE, useExisting: Message }, { provide: PARENT_INSTANCE, useExisting: Message }],
    hostDirectives: [Bind],
    host: {
        '[attr.data-p]': 'dataP',
        role: 'alert',
        'aria-live': 'polite',
        '[class]': 'cn(cx("root"), styleClass())',
        '[animate.enter]': '"p-message-enter-active"',
        '[animate.leave]': '"p-message-leave-active"',
        '[class.p-message-leave-active]': '!visible()'
    }
})
export class Message extends BaseComponent<MessagePassThrough> {
    componentName = 'Message';

    _componentStyle = inject(MessageStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcMessage: Message | undefined = inject(MESSAGE_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    /**
     * Severity level of the message.
     * @defaultValue 'info'
     * @group Props
     */
    readonly severity = input<'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast' | undefined | null>('info');
    /**
     * Text content.
     * @deprecated since v20.0.0. Use content projection instead '<h-message>Content</h-message>'.
     * @group Props
     */
    readonly text = input<string>();
    /**
     * Whether displaying messages would be escaped or not.
     * @deprecated since v20.0.0. Use content projection instead '<h-message>Content</h-message>'.
     * @group Props
     */
    readonly escape = input<boolean, unknown>(true, { transform: booleanAttribute });
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
     * Whether the message can be closed manually using the close icon.
     * @group Props
     * @defaultValue false
     */
    readonly closable = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Icon to display in the message.
     * @group Props
     * @defaultValue undefined
     */
    readonly icon = input<string>();
    /**
     * Icon to display in the message close button.
     * @group Props
     * @defaultValue undefined
     */
    readonly closeIcon = input<string>();
    /**
     * Delay in milliseconds to close the message automatically.
     * @defaultValue undefined
     */
    readonly life = input<number>();
    /**
     * Transition options of the show animation.
     * @defaultValue '300ms ease-out'
     * @group Props
     * @deprecated since v21.0.0, use `motionOptions` instead.
     */
    readonly showTransitionOptions = input<string>('300ms ease-out');
    /**
     * Transition options of the hide animation.
     * @defaultValue '200ms cubic-bezier(0.86, 0, 0.07, 1)'
     * @group Props
     * @deprecated since v21.0.0, use `motionOptions` instead.
     */
    readonly hideTransitionOptions = input<string>('200ms cubic-bezier(0.86, 0, 0.07, 1)');
    /**
     * Defines the size of the component.
     * @group Props
     */
    readonly size = input<'large' | 'small'>();
    /**
     * Specifies the input variant of the component.
     * @group Props
     */
    readonly variant = input<'outlined' | 'text' | 'simple'>();
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
     * Emits when the message is closed.
     * @param {{ originalEvent: Event }} event - The event object containing the original event.
     * @group Emits
     */
    readonly onClose = output<{
    originalEvent: Event;
}>();

    get closeAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.close : undefined;
    }

    visible = signal<boolean>(true);

    /**
     * Custom template of the message container.
     * @param {MessageContainerTemplateContext} context - container context.
     * @see {@link MessageContainerTemplateContext}
     * @group Templates
     */
    readonly containerTemplate = contentChild<TemplateRef<MessageContainerTemplateContext>>('container', { descendants: false });

    /**
     * Custom template of the message icon.
     * @group Templates
     */
    readonly iconTemplate = contentChild<TemplateRef<void>>('icon', { descendants: false });

    /**
     * Custom template of the close icon.
     * @group Templates
     */
    readonly closeIconTemplate = contentChild<TemplateRef<void>>('closeicon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    _containerTemplate: TemplateRef<MessageContainerTemplateContext> | undefined;

    _iconTemplate: TemplateRef<void> | undefined;

    _closeIconTemplate: TemplateRef<void> | undefined;

    closeCallback = (event: Event) => {
        this.close(event);
    };

    onInit() {
        const life = this.life();
        if (life) {
            setTimeout(() => {
                this.visible.set(false);
            }, life);
        }
    }

    onAfterContentInit() {
        this.templates()?.forEach((item) => {
            switch (item.getType()) {
                case 'container':
                    this._containerTemplate = item.template;
                    break;

                case 'icon':
                    this._iconTemplate = item.template;
                    break;

                case 'closeicon':
                    this._closeIconTemplate = item.template;
                    break;
            }
        });
    }

    /**
     * Closes the message.
     * @param {Event} event - Browser event.
     * @group Method
     */
    public close(event: Event) {
        this.visible.set(false);
        this.onClose.emit({ originalEvent: event });
    }

    get dataP() {
        return this.cn({
            outlined: this.variant() === 'outlined',
            simple: this.variant() === 'simple',
            [this.severity() as string]: this.severity(),
            [this.size() as string]: this.size()
        });
    }
}

@NgModule({
    imports: [Message, SharedModule],
    exports: [Message, SharedModule]
})
export class MessageModule {}
