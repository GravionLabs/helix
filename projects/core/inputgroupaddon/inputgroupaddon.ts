import { Component, inject, InjectionToken, NgModule, ChangeDetectionStrategy, input } from '@angular/core';
import { SharedModule } from '@helix/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@helix/core/basecomponent';
import { Bind, BindModule } from '@helix/core/bind';
import { InputGroupAddonPassThrough } from '@helix/core/types/inputgroupaddon';
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
        '[class]': "cn(cx('root'), styleClass())",
        '[style]': 'style()'
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
    readonly style = input<{ [klass: string]: any } | null>();
    /**
     * Class of the element.
     * @group Props
     */
    readonly styleClass = input<string>();
}

@NgModule({
    imports: [InputGroupAddon, SharedModule],
    exports: [InputGroupAddon, SharedModule]
})
export class InputGroupAddonModule {}
