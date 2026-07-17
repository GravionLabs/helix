import { CommonModule } from '@angular/common';
import { AfterContentInit, booleanAttribute, ChangeDetectionStrategy, Component, contentChild, contentChildren, inject, InjectionToken, NgModule, TemplateRef, ViewEncapsulation, input } from '@angular/core';
import { PrimeTemplate, SharedModule } from '@gravionlabs/helix/api';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind } from '@gravionlabs/helix/bind';
import { TagPassThrough } from '@gravionlabs/helix/types/tag';
import { TagStyle } from './style/tagstyle';

const TAG_INSTANCE = new InjectionToken<Tag>('TAG_INSTANCE');

/**
 * Tag component is used to categorize content.
 * @group Components
 */
@Component({
    selector: 'h-tag',
    standalone: true,
    imports: [CommonModule, SharedModule, Bind],
    templateUrl: './tag.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [TagStyle, { provide: TAG_INSTANCE, useExisting: Tag }, { provide: PARENT_INSTANCE, useExisting: Tag }],
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[attr.data-p]': 'dataP'
    },
    hostDirectives: [Bind]
})
export class Tag extends BaseComponent<TagPassThrough> implements AfterContentInit {
    componentName = 'Tag';
    $pcTag: Tag | undefined = inject(TAG_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

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
     * Severity type of the tag.
     * @group Props
     */
    readonly severity = input<'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null>();
    /**
     * Value to display inside the tag.
     * @group Props
     */
    readonly value = input<string>();
    /**
     * Icon of the tag to display next to the value.
     * @group Props
     */
    readonly icon = input<string>();
    /**
     * Whether the corners of the tag are rounded.
     * @group Props
     */
    readonly rounded = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Custom icon template.
     * @group Templates
     */
    readonly iconTemplate = contentChild<TemplateRef<void>>('icon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    _iconTemplate: TemplateRef<void> | undefined;

    _componentStyle = inject(TagStyle);

    onAfterContentInit() {
        this.templates()?.forEach((item) => {
            switch (item.getType()) {
                case 'icon':
                    this._iconTemplate = item.template;
                    break;
            }
        });
    }

    get dataP() {
        return this.cn({
            rounded: this.rounded(),
            [this.severity() as string]: this.severity()
        });
    }
}

@NgModule({
    imports: [Tag, SharedModule],
    exports: [Tag, SharedModule]
})
export class TagModule {}
