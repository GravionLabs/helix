import { Component, inject, InjectionToken, Input, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { SharedModule } from '@gravionlabs/helix/api';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind, BindModule } from '@gravionlabs/helix/bind';
import { InputGroupPassThrough } from '@gravionlabs/helix/types/inputgroup';
import { InputGroupStyle } from './style/inputgroupstyle';

const INPUTGROUP_INSTANCE = new InjectionToken<InputGroup>('INPUTGROUP_INSTANCE');

/**
 * InputGroup displays text, icon, buttons and other content can be grouped next to an input.
 * @group Components
 */
@Component({
    selector: 'h-inputgroup, h-inputGroup, h-input-group',
    standalone: true,
    imports: [BindModule],
    template: ` <ng-content></ng-content> `,
    providers: [InputGroupStyle, { provide: INPUTGROUP_INSTANCE, useExisting: InputGroup }, { provide: PARENT_INSTANCE, useExisting: InputGroup }],
    hostDirectives: [Bind],
    changeDetection: ChangeDetectionStrategy.Eager,
    host: {
        '[class]': "cn(cx('root'), styleClass)"
    }
})
export class InputGroup extends BaseComponent<InputGroupPassThrough> {
    componentName = 'InputGroup';

    _componentStyle = inject(InputGroupStyle);

    $pcInputGroup: InputGroup | undefined = inject(INPUTGROUP_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    /**
     * Class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    @Input() styleClass: string | undefined;
}

@NgModule({
    imports: [InputGroup, SharedModule],
    exports: [InputGroup, SharedModule]
})
export class InputGroupModule {}
