import { Component, HostBinding, inject, InjectionToken, Input, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { SharedModule } from '@gravionlabs/helix/api';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind, BindModule } from '@gravionlabs/helix/bind';
import { InputGroupAddonPassThrough } from '@gravionlabs/helix/types/inputgroupaddon';
import { InputGroupAddonStyle } from './style/inputgroupaddonstyle';

const INPUTGROUPADDON_INSTANCE = new InjectionToken<InputGroupAddon>('INPUTGROUPADDON_INSTANCE');

/**
 * InputGroupAddon displays text, icon, buttons and other content can be grouped next to an input.
 * @group Components
 */
@Component({
    selector: 'h-inputgroup-addon, h-inputGroupAddon',
    templateUrl: './inputgroupaddon.html',
    standalone: true,
    imports: [BindModule],
    host: {
        '[class]': "cn(cx('root'), styleClass)"
    },
    providers: [InputGroupAddonStyle, { provide: INPUTGROUPADDON_INSTANCE, useExisting: InputGroupAddon }, { provide: PARENT_INSTANCE, useExisting: InputGroupAddon }],
    changeDetection: ChangeDetectionStrategy.Eager,
    hostDirectives: [Bind]
})
export class InputGroupAddon extends BaseComponent<InputGroupAddonPassThrough> {
    componentName = 'InputGroupAddon';

    _componentStyle = inject(InputGroupAddonStyle);

    $pcInputGroupAddon: InputGroupAddon | undefined = inject(INPUTGROUPADDON_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    /**
     * Inline style of the element.
     * @group Props
     */
    @Input() style: { [klass: string]: any } | null | undefined;
    /**
     * Class of the element.
     * @group Props
     */
    @Input() styleClass: string | undefined;

    @HostBinding('style') get hostStyle(): { [klass: string]: any } | null | undefined {
        return this.style;
    }
}

@NgModule({
    imports: [InputGroupAddon, SharedModule],
    exports: [InputGroupAddon, SharedModule]
})
export class InputGroupAddonModule {}
