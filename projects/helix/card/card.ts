import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, contentChild, contentChildren, inject, InjectionToken, input, NgModule, TemplateRef, ViewEncapsulation } from '@angular/core';
import { BlockableUI, Footer, Header, PrimeTemplate, SharedModule } from '@gravionlabs/helix/api';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind, BindModule } from '@gravionlabs/helix/bind';
import { CardStyle } from './style/cardstyle';
import { CardPassThrough } from '@gravionlabs/helix/types/card';

const CARD_INSTANCE = new InjectionToken<Card>('CARD_INSTANCE');

/**
 * Card is a flexible container component.
 * @group Components
 */
@Component({
    selector: 'h-card',
    standalone: true,
    imports: [CommonModule, SharedModule, BindModule],
    templateUrl: './card.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [CardStyle, { provide: CARD_INSTANCE, useExisting: Card }, { provide: PARENT_INSTANCE, useExisting: Card }],
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[style]': 'style()'
    },
    hostDirectives: [Bind]
})
export class Card extends BaseComponent<CardPassThrough> implements BlockableUI {
    componentName = 'Card';

    $pcCard: Card | undefined = inject(CARD_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(CardStyle);

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }
    /**
     * Header of the card.
     * @group Props
     */
    readonly header = input<string>();
    /**
     * Subheader of the card.
     * @group Props
     */
    readonly subheader = input<string>();
    /**
     * Inline style of the element.
     * @group Props
     */
    readonly style = input<{ [klass: string]: any } | null | undefined>(null);
    /**
     * Class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    readonly styleClass = input<string>();

    readonly headerFacet = contentChild(Header);

    readonly footerFacet = contentChild(Footer);

    /**
     * Custom header template.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<void>>('header', { descendants: false });

    /**
     * Custom title template.
     * @group Templates
     */
    readonly titleTemplate = contentChild<TemplateRef<void>>('title', { descendants: false });

    /**
     * Custom subtitle template.
     * @group Templates
     */
    readonly subtitleTemplate = contentChild<TemplateRef<void>>('subtitle', { descendants: false });

    /**
     * Custom content template.
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<void>>('content', { descendants: false });

    /**
     * Custom footer template.
     * @group Templates
     */
    readonly footerTemplate = contentChild<TemplateRef<void>>('footer', { descendants: false });

    _headerTemplate: TemplateRef<void> | undefined;

    _titleTemplate: TemplateRef<void> | undefined;

    _subtitleTemplate: TemplateRef<void> | undefined;

    _contentTemplate: TemplateRef<void> | undefined;

    _footerTemplate: TemplateRef<void> | undefined;

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement;
    }

    readonly templates = contentChildren(PrimeTemplate);

    onAfterContentInit() {
        this.templates().forEach((item) => {
            switch (item.getType()) {
                case 'header':
                    this._headerTemplate = item.template;
                    break;

                case 'title':
                    this._titleTemplate = item.template;
                    break;

                case 'subtitle':
                    this._subtitleTemplate = item.template;
                    break;

                case 'content':
                    this._contentTemplate = item.template;
                    break;

                case 'footer':
                    this._footerTemplate = item.template;
                    break;

                default:
                    this._contentTemplate = item.template;
                    break;
            }
        });
    }
}

@NgModule({
    imports: [Card, SharedModule, BindModule],
    exports: [Card, SharedModule, BindModule]
})
export class CardModule {}
