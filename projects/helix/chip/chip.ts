import { CommonModule } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, Component, Input, inject, InjectionToken, NgModule,  SimpleChanges, TemplateRef, ViewEncapsulation, input, output, contentChildren, model, contentChild, booleanAttribute } from '@angular/core';
import { PrimeTemplate, SharedModule, TranslationKeys } from '@gravionlabs/helix/api';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind } from '@gravionlabs/helix/bind';
import { TimesCircleIcon } from '@gravionlabs/helix/icons';
import { ChipProps, ChipPassThrough } from '@gravionlabs/helix/types/chip';
import { ChipStyle } from './style/chipstyle';

const CHIP_INSTANCE = new InjectionToken<Chip>('CHIP_INSTANCE');

/**
 * Chip represents people using icons, labels and images.
 * @group Components
 */
@Component({
    selector: 'h-chip',
    standalone: true,
    imports: [CommonModule, TimesCircleIcon, SharedModule, Bind],
    templateUrl: './chip.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ChipStyle, { provide: CHIP_INSTANCE, useExisting: Chip }, { provide: PARENT_INSTANCE, useExisting: Chip }],
    host: {
        '[class]': "cn(cx('root'), styleClass)",
        '[style]': "sx('root')",
        '[attr.aria-label]': 'label',
        '[attr.data-p]': 'dataP'
    },
    hostDirectives: [Bind]
})
export class Chip extends BaseComponent<ChipPassThrough> {
    componentName = 'Chip';

    $pcChip: Chip | undefined = inject(CHIP_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }
    /**
     * Defines the text to display.
     * @group Props
     */
    readonly label = model<string | undefined>(undefined);
    /**
     * Defines the icon to display.
     * @group Props
     */
    readonly icon = model<string | undefined>(undefined);
    /**
     * Defines the image to display.
     * @group Props
     */
    readonly image = model<string | undefined>(undefined);
    /**
     * Alt attribute of the image.
     * @group Props
     */
    readonly alt = model<string | undefined>(undefined);
    /**
     * Class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    readonly styleClass = model<string | undefined>(undefined);
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    readonly disabled = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether to display a remove icon.
     * @group Props
     */
    readonly removable = model<boolean | undefined>(false);
    /**
     * Icon of the remove element.
     * @group Props
     */
    readonly removeIcon = model<string | undefined>(undefined);
    /**
     * Callback to invoke when a chip is removed.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    readonly onRemove = output<MouseEvent>();
    /**
     * This event is triggered if an error occurs while loading an image file.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onImageError = output<Event>();

    visible: boolean = true;

    get removeAriaLabel() {
        return this.config.getTranslation(TranslationKeys.ARIA)['removeLabel'];
    }
    /**
     * Used to pass all properties of the chipProps to the Chip component.
     * @group Props
     */
    @Input() get chipProps(): ChipProps | undefined {
        return this._chipProps;
    }
    set chipProps(val: ChipProps | undefined) {
        this._chipProps = val;

        if (val && typeof val === 'object') {
            //@ts-ignore
            Object.entries(val).forEach(([k, v]) => this[`_${k}`] !== v && (this[`_${k}`] = v));
        }
    }

    _chipProps: ChipProps | undefined;

    _componentStyle = inject(ChipStyle);

    /**
     * Custom remove icon template.
     * @group Templates
     */
    readonly removeIconTemplate = contentChild<TemplateRef<void>>('removeicon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    _removeIconTemplate: TemplateRef<void> | undefined;

    onAfterContentInit() {
        this.templates().forEach((item) => {
            switch (item.getType()) {
                case 'removeicon':
                    this._removeIconTemplate = item.template;
                    break;

                default:
                    this._removeIconTemplate = item.template;
                    break;
            }
        });
    }

    onChanges(simpleChanges: SimpleChanges) {
        if (simpleChanges.chipProps && simpleChanges.chipProps.currentValue) {
            const { currentValue } = simpleChanges.chipProps;

            if (currentValue.label !== undefined) {
                this.label.set(currentValue.label);
            }
            if (currentValue.icon !== undefined) {
                this.icon.set(currentValue.icon);
            }
            if (currentValue.image !== undefined) {
                this.image.set(currentValue.image);
            }
            if (currentValue.alt !== undefined) {
                this.alt.set(currentValue.alt);
            }
            if (currentValue.styleClass !== undefined) {
                this.styleClass.set(currentValue.styleClass);
            }
            if (currentValue.removable !== undefined) {
                this.removable.set(currentValue.removable);
            }
            if (currentValue.removeIcon !== undefined) {
                this.removeIcon.set(currentValue.removeIcon);
            }
        }
    }

    close(event: MouseEvent) {
        this.visible = false;
        this.onRemove.emit(event);
    }

    onKeydown(event) {
        if (event.key === 'Enter' || event.key === 'Backspace') {
            this.close(event);
        }
    }

    imageError(event: Event) {
        this.onImageError.emit(event);
    }

    get dataP() {
        return this.cn({
            removable: this.removable()
        });
    }
}

@NgModule({
    imports: [Chip, SharedModule],
    exports: [Chip, SharedModule]
})
export class ChipModule {}
