
import { ChangeDetectionStrategy, Component, inject, InjectionToken, NgModule, ViewEncapsulation, input } from '@angular/core';
import { SharedModule } from '@gravionlabs/helix/api';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind } from '@gravionlabs/helix/bind';
import { AvatarGroupPassThrough } from '@gravionlabs/helix/types/avatargroup';
import { AvatarGroupStyle } from './style/avatargroupstyle';

const AVATARGROUP_INSTANCE = new InjectionToken<AvatarGroup>('AVATARGROUP_INSTANCE');

/**
 * AvatarGroup is a helper component for Avatar.
 * @group Components
 */
@Component({
    selector: 'h-avatarGroup, h-avatar-group, h-avatargroup',
    standalone: true,
    imports: [SharedModule],
    templateUrl: './avatargroup.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [AvatarGroupStyle, { provide: AVATARGROUP_INSTANCE, useExisting: AvatarGroup }, { provide: PARENT_INSTANCE, useExisting: AvatarGroup }],
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[style]': 'style()'
    },
    hostDirectives: [Bind]
})
export class AvatarGroup extends BaseComponent<AvatarGroupPassThrough> {
    componentName = 'AvatarGroup';

    $pcAvatarGroup: AvatarGroup | undefined = inject(AVATARGROUP_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    /**
     * Style class of the component
     * @group Props
     */
    readonly styleClass = input<string>();
    /**
     * Inline style of the component.
     * @group Props
     */
    readonly style = input<{
    [klass: string]: any;
} | null>();

    _componentStyle = inject(AvatarGroupStyle);
}

@NgModule({
    imports: [AvatarGroup, SharedModule],
    exports: [AvatarGroup, SharedModule]
})
export class AvatarGroupModule {}
