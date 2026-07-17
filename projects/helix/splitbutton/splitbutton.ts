import { CommonModule } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, ElementRef, inject, InjectionToken, input, Input, NgModule, numberAttribute, signal, TemplateRef, ViewEncapsulation, output, viewChild, contentChild, contentChildren } from '@angular/core';
import { MotionOptions } from '@primeuix/motion';
import { uuid } from '@primeuix/utils';
import { MenuItem, PrimeTemplate, SharedModule, TooltipOptions } from '@gravionlabs/helix/api';
import { AutoFocus } from '@gravionlabs/helix/autofocus';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind } from '@gravionlabs/helix/bind';
import { ButtonDirective } from '@gravionlabs/helix/button';
import { ChevronDownIcon } from '@gravionlabs/helix/icons';
import { Ripple } from '@gravionlabs/helix/ripple';
import { TieredMenu } from '@gravionlabs/helix/tieredmenu';
import { TooltipModule } from '@gravionlabs/helix/tooltip';
import { ButtonProps, MenuButtonProps, SplitButtonPassThrough } from '@gravionlabs/helix/types/splitbutton';
import { SplitButtonStyle } from './style/splitbuttonstyle';

const SPLITBUTTON_INSTANCE = new InjectionToken<SplitButton>('SPLITBUTTON_INSTANCE');

type SplitButtonIconPosition = 'left' | 'right';
/**
 * SplitButton groups a set of commands in an overlay with a default command.
 * @group Components
 */
@Component({
    selector: 'h-splitbutton, h-splitButton, h-split-button',
    standalone: true,
    imports: [CommonModule, ButtonDirective, TieredMenu, AutoFocus, ChevronDownIcon, Ripple, TooltipModule, SharedModule],
    templateUrl: './splitbutton.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SplitButtonStyle, { provide: SPLITBUTTON_INSTANCE, useExisting: SplitButton }, { provide: PARENT_INSTANCE, useExisting: SplitButton }],
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[attr.data-p-severity]': 'severity()'
    },
    hostDirectives: [Bind]
})
export class SplitButton extends BaseComponent<SplitButtonPassThrough> {
    componentName = 'SplitButton';
    $pcSplitButton: SplitButton | undefined = inject(SPLITBUTTON_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }
    /**
     * MenuModel instance to define the overlay items.
     * @group Props
     */
    readonly model = input<MenuItem[]>();
    /**
     * Defines the style of the button.
     * @group Props
     */
    readonly severity = input<'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | null>();
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
     * Add a border class without a background initially.
     * @group Props
     */
    readonly outlined = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Defines the size of the button.
     * @group Props
     */
    readonly size = input<'small' | 'large' | undefined | null>(null);
    /**
     * Add a plain textual class to the button without a background initially.
     * @group Props
     */
    readonly plain = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Name of the icon.
     * @group Props
     */
    readonly icon = input<string>();
    /**
     * Position of the icon.
     * @group Props
     */
    readonly iconPos = input<SplitButtonIconPosition>('left');
    /**
     * Text of the button.
     * @group Props
     */
    readonly label = input<string>();
    /**
     * Tooltip for the main button.
     * @group Props
     */
    readonly tooltip = input<string>();
    /**
     * Tooltip options for the main button.
     * @group Props
     */
    readonly tooltipOptions = input<TooltipOptions>();
    /**
     * Class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    readonly styleClass = input<string>();
    /**
     * Inline style of the overlay menu.
     * @group Props
     */
    readonly menuStyle = input<{
    [klass: string]: any;
} | null>();
    /**
     * Style class of the overlay menu.
     * @group Props
     */
    readonly menuStyleClass = input<string>();
    /**
     * Name of the dropdown icon.
     * @group Props
     */
    readonly dropdownIcon = input<string>();
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'body'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>('body');
    /**
     * Indicates the direction of the element.
     * @group Props
     */
    readonly dir = input<string>();
    /**
     * Defines a string that labels the expand button for accessibility.
     * @group Props
     */
    readonly expandAriaLabel = input<string>();
    /**
     * Transition options of the show animation.
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    readonly showTransitionOptions = input<string>('.12s cubic-bezier(0, 0, 0.2, 1)');
    /**
     * Transition options of the hide animation.
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    readonly hideTransitionOptions = input<string>('.1s linear');
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
     * Button Props
     */
    readonly buttonProps = input<ButtonProps>();
    /**
     * Menu Button Props
     */
    readonly menuButtonProps = input<MenuButtonProps>();
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    readonly autofocus = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    readonly disabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number, unknown>(undefined, { transform: numberAttribute });
    /**
     * When present, it specifies that the menu button element should be disabled.
     * @group Props
     */
    readonly menuButtonDisabled = input<boolean, unknown>(false, { transform: booleanAttribute });

    readonly $menuButtonDisabled = computed(() => this.disabled() ?? this.menuButtonDisabled());
    /**
     * When present, it specifies that the button element should be disabled.
     * @group Props
     */
    readonly buttonDisabled = input<boolean, unknown>(false, { transform: booleanAttribute });

    readonly $buttonDisabled = computed(() => this.disabled() ?? this.buttonDisabled());
    /**
     * Callback to invoke when default command button is clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    readonly onClick = output<MouseEvent>();
    /**
     * Callback to invoke when overlay menu is hidden.
     * @group Emits
     */
    readonly onMenuHide = output<any>();
    /**
     * Callback to invoke when overlay menu is shown.
     * @group Emits
     */
    readonly onMenuShow = output<any>();
    /**
     * Callback to invoke when dropdown button is clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    readonly onDropdownClick = output<MouseEvent>();

    readonly buttonViewChild = viewChild<ElementRef>('defaultbtn');

    readonly menu = viewChild<TieredMenu>('menu');
    /**
     * Custom content template.
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<void>>('content', { descendants: false });
    /**
     * Custom dropdown icon template.
     * @group Templates
     **/
    readonly dropdownIconTemplate = contentChild<TemplateRef<void>>('dropdownicon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    ariaId: string | undefined;

    isExpanded = signal<boolean>(false);


    _componentStyle = inject(SplitButtonStyle);

    _contentTemplate: TemplateRef<void> | undefined;

    _dropdownIconTemplate: TemplateRef<void> | undefined;

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    onInit() {
        this.ariaId = uuid('pn_id_');
    }

    onAfterContentInit() {
        this.templates()?.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this._contentTemplate = item.template;
                    break;

                case 'dropdownicon':
                    this._dropdownIconTemplate = item.template;
                    break;

                default:
                    this._contentTemplate = item.template;
                    break;
            }
        });
    }

    onDefaultButtonClick(event: MouseEvent) {
        this.onClick?.emit(event);
        this.menu()?.hide();
    }

    onDropdownButtonClick(event?: MouseEvent) {
        this.onDropdownClick.emit(event);
        this.menu()?.toggle({ currentTarget: this.el?.nativeElement, relativeAlign: this.$appendTo() == 'self' });
    }

    onDropdownButtonKeydown(event: KeyboardEvent) {
        if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
            this.onDropdownButtonClick();
            event.preventDefault();
        }
    }

    onHide() {
        this.isExpanded.set(false);
        // TODO: The 'emit' function requires a mandatory any argument
        // TODO: The 'emit' function requires a mandatory any argument
        // TODO: The 'emit' function requires a mandatory any argument
        this.onMenuHide.emit();
    }

    onShow() {
        this.isExpanded.set(true);
        // TODO: The 'emit' function requires a mandatory any argument
        // TODO: The 'emit' function requires a mandatory any argument
        // TODO: The 'emit' function requires a mandatory any argument
        this.onMenuShow.emit();
    }
}

@NgModule({
    imports: [SplitButton, SharedModule],
    exports: [SplitButton, SharedModule]
})
export class SplitButtonModule {}
