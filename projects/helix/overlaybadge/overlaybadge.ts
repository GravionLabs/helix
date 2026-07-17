
import { booleanAttribute, ChangeDetectionStrategy, Component, inject, InjectionToken, Input, NgModule, ViewEncapsulation, input, effect } from '@angular/core';
import { SharedModule } from '@gravionlabs/helix/api';
import { BadgeModule } from '@gravionlabs/helix/badge';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind } from '@gravionlabs/helix/bind';
import { OverlayBadgePassThrough } from '@gravionlabs/helix/types/overlaybadge';
import { OverlayBadgeStyle } from './style/overlaybadgestyle';

const OVERLAYBADGE_INSTANCE = new InjectionToken<OverlayBadge>('OVERLAYBADGE_INSTANCE');

/**
 * OverlayPanel is a container component positioned as connected to its target.
 * @group Components
 */
@Component({
    selector: 'h-overlayBadge, h-overlay-badge, h-overlaybadge',
    standalone: true,
    imports: [BadgeModule, SharedModule, Bind],
    templateUrl: './overlaybadge.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [OverlayBadgeStyle, { provide: OVERLAYBADGE_INSTANCE, useExisting: OverlayBadge }, { provide: PARENT_INSTANCE, useExisting: OverlayBadge }],
    hostDirectives: [Bind]
})
export class OverlayBadge extends BaseComponent<OverlayBadgePassThrough> {
    componentName = 'OverlayBadge';

    $pcOverlayBadge: OverlayBadge | undefined = inject(OVERLAYBADGE_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    /**
     * Class of the element.
     * @group Props
     */
    readonly styleClass = input<string>();
    /**
     * Inline style of the element.
     * @group Props
     */
    readonly style = input<{
    [klass: string]: any;
} | null>();
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     */
    readonly badgeSize = input<'small' | 'large' | 'xlarge' | null>();
    /**
     * Severity type of the badge.
     * @group Props
     */
    readonly severity = input<'secondary' | 'info' | 'success' | 'warn' | 'danger' | 'contrast' | null>();
    /**
     * Value to display inside the badge.
     * @group Props
     */
    readonly value = input<string | number | null>();
    /**
     * When specified, disables the component.
     * @group Props
     */
    readonly badgeDisabled = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     * @deprecated use badgeSize instead.
     */
    public readonly size = input<'large' | 'xlarge' | 'small' | undefined | null>(undefined);

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('host'));
    }

    _componentStyle = inject(OverlayBadgeStyle);

    constructor() {
        super();
    }
}

@NgModule({
    imports: [OverlayBadge, SharedModule],
    exports: [OverlayBadge, SharedModule]
})
export class OverlayBadgeModule {}
