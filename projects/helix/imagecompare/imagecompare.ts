import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, InjectionToken, NgModule, TemplateRef, ViewEncapsulation, input, contentChild, contentChildren } from '@angular/core';
import { PrimeTemplate, SharedModule } from '@gravionlabs/helix/api';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind, BindModule } from '@gravionlabs/helix/bind';
import { ImageComparePassThrough } from '@gravionlabs/helix/types/imagecompare';
import { ImageCompareStyle } from './style/imagecomparestyle';

const IMAGECOMPARE_INSTANCE = new InjectionToken<ImageCompare>('IMAGECOMPARE_INSTANCE');

/**
 * Compare two images side by side with a slider.
 * @group Components
 */
@Component({
    selector: 'h-imageCompare, h-imagecompare, h-image-compare',
    standalone: true,
    imports: [CommonModule, SharedModule, BindModule],
    templateUrl: './imagecompare.html',
    host: {
        '[class]': "cx('root')",
        '[attr.tabindex]': 'tabindex()',
        '[attr.aria-labelledby]': 'ariaLabelledby()',
        '[attr.aria-label]': 'ariaLabel()'
    },
    hostDirectives: [Bind],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ImageCompareStyle, { provide: IMAGECOMPARE_INSTANCE, useExisting: ImageCompare }, { provide: PARENT_INSTANCE, useExisting: ImageCompare }]
})
export class ImageCompare extends BaseComponent<ImageComparePassThrough> {
    componentName = 'ImageCompare';

    $pcImageCompare: ImageCompare | undefined = inject(IMAGECOMPARE_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });
    /**
     * Index of the element in tabbing order.
     * @defaultValue 0
     * @group Props
     */
    readonly tabindex = input<number>();
    /**
     * Defines a string value that labels an interactive element.
     * @group Props
     */
    readonly ariaLabelledby = input<string>();
    /**
     * Identifier of the underlying input element.
     * @group Props
     */
    readonly ariaLabel = input<string>();

    /**
     * Custom left side template.
     * @group Templates
     */
    readonly leftTemplate = contentChild<TemplateRef<void>>('left', { descendants: false });

    /**
     * Custom right side template.
     * @group Templates
     */
    readonly rightTemplate = contentChild<TemplateRef<void>>('right', { descendants: false });

    _leftTemplate: TemplateRef<void> | undefined;

    _rightTemplate: TemplateRef<void> | undefined;

    readonly templates = contentChildren(PrimeTemplate);

    _componentStyle = inject(ImageCompareStyle);

    mutationObserver: MutationObserver;

    isRTL: boolean = false;

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    onInit() {
        this.updateDirection();
        this.observeDirectionChanges();
    }

    onAfterContentInit() {
        this.templates().forEach((item) => {
            switch (item.getType()) {
                case 'left':
                    this._leftTemplate = item.template;
                    break;
                case 'right':
                    this._rightTemplate = item.template;
                    break;
            }
        });
    }

    onSlide(event) {
        const value = event.target.value;
        const image = event.target.previousElementSibling;

        if (this.isRTL) {
            image.style.clipPath = `polygon(${100 - value}% 0, 100% 0, 100% 100%, ${100 - value}% 100%)`;
        } else {
            image.style.clipPath = `polygon(0 0, ${value}% 0, ${value}% 100%, 0 100%)`;
        }
    }

    updateDirection() {
        this.isRTL = !!this.el.nativeElement.closest('[dir="rtl"]');
    }

    observeDirectionChanges() {
        if (isPlatformBrowser(this.platformId)) {
            const targetNode = document?.documentElement;
            const config = { attributes: true, attributeFilter: ['dir'] };

            this.mutationObserver = new MutationObserver(() => {
                this.updateDirection();
            });

            this.mutationObserver.observe(targetNode, config);
        }
    }

    onDestroy() {
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
    }
}

@NgModule({
    imports: [ImageCompare, SharedModule],
    exports: [ImageCompare, SharedModule]
})
export class ImageCompareModule {}
